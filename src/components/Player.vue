<template>
  <div id="player" v-show="playing">
    <object id="av-player" type="application/avplayer"></object>
    <div id="playerLoader" v-show="buffering">
      <div id="loading">
        <p>{{ bufferPercent }}</p>
        <div class="bulletouter">
          <div class="bulletinner"></div>
          <div class="mask"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
    <div class="controls" :class="{show: playerControlVisibility}">
      <vue-slider
        :value="playerProgress"
        class="vueprogress"
        width="1860px"
        :use-keyboard="true"
        :interval="2"
        :duration="0"
        :contained="true"
        :processStyle="{background: 'red'}"
        :railStyle="{background: 'white'}"
        :tooltipStyle="{padding: '14px', fontSize: '20px'}"
        :tooltip-formatter="progressFormatter"
        ref="slider">
        <template v-slot:dot>
          <div id="playerSliderDot" class="vue-slider-dot-handle" tabindex="0" @focus="focusSlider()" @blur="blurSlider()"></div>
        </template>
      </vue-slider>
      <div class="control">
        <h2 class="title">{{ name }}</h2>
        <p v-show="seekTime < 0">{{ seekTime }}s</p>
        <div class="player-buttons">
          <button class="player-button" tabindex="0" tooltip="-30s" @focus="onButtonFocused()" @click="onButtonClicked('seekBackward')" >
            <font-awesome-icon icon="history" fixed-width />
          </button>
          <button class="player-button" tabindex="0" :tooltip="paused ? 'PLAY' : 'PAUSE'"  @focus="onButtonFocused()" @click="onButtonClicked('playPause')" ref="playButton" autofocus>
            <font-awesome-icon :icon="paused ? 'play' : 'pause'" fixed-width />
          </button>
          <button class="player-button flipped" tabindex="0" tooltip="+30s" @focus="onButtonFocused()" @click="onButtonClicked('seekForward')" >
            <font-awesome-icon icon="history" flip="horizontal" fixed-width />
          </button>
        </div>
        <p v-show="seekTime > 0">+{{ seekTime }}s</p>
        <h2 class="time">{{ currentTimeFormatted }} / {{ totalTimeFormatted }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
export default {

  name: 'Player',

  components: {
    VueSlider
  },

  data () {
    return {
      playing: false,
      currentTime: 0,
      totalTime: 0,
      name: '',
      visibilityTimeout: null,
      seekTimeout: null,
      seekTime: 0,
      buffering: false,
      bufferPercent: 0
    }
  },

  computed: {
    playerProgress () {
      return isNaN(this.currentTime / (this.totalTime / 100)) ? 0 : this.currentTime / (this.totalTime / 100)
    },
    streamItem () {
      return this.$store.getters.streamItem
    },
    playerControlVisibility () {
      return this.$store.getters.playerControlVisibility
    },
    paused () {
      return this.$store.getters.isStreamPaused
    },
    progressPosition () {
      return 'translateX(-' + (100 - (this.currentTime / (this.totalTime / 100))) + '%)'
    },
    currentTimeFormatted () {
      return this.msToTime(this.currentTime)
    },
    totalTimeFormatted () {
      return this.msToTime(this.totalTime)
    }
  },

  watch: {
    playerControlVisibility: function (show) {
      if (show) {
        var vm = this
        vm.$nextTick(function () {
          vm.$refs['playButton'].focus()
        })
        this.rescheduleHide()
      }
    },
    streamItem: {
      handler: function (streamObject, oldStreamObject) {
        if (streamObject.url === '') {
          this.$store.dispatch('toggleStreamPlayPause', false)
          this.currentTime = 0
          this.totalTime = 0
          this.name = ''
          this.playing = false
          webapis.avplay.close()
          return
        }

        if (oldStreamObject.url == streamObject.url) return

        this.playing = true
        this.buffering = true
        this.name = streamObject.name

        var vm = this
        setTimeout(function () {
          var state = webapis.avplay.getState()
          if (state == 'PLAYING' || state == 'PAUSED') {
            webapis.avplay.close()
          }
          webapis.avplay.open(streamObject.url)
          webapis.avplay.setDisplayRect(0, 0, 1920, 1080)
          webapis.avplay.setListener(vm.listeners)

          webapis.avplay.prepare()
          webapis.avplay.play()
        }, 500)
      },
      deep: true
    },
    paused: function (value) {
      if (value === true) {
        webapis.avplay.pause()
      } else {
        webapis.avplay.play()
        this.rescheduleHide()
      }
    }
  },

  methods: {
    focusSlider() {
      console.log('FOCUS SLIDER!!!')
      this.$refs['slider'].focus()
    },
    blurSlider() {
      this.$refs['slider'].blur()
    },
    progressFormatter (val) {
      return this.msToTime(this.totalTime / 100 * this.playerProgress)
      //return this.playerProgress + '%'
    },
    togglePlay () {
      this.$store.dispatch('toggleStreamPlayPause')
    },
    rescheduleHide () {
      clearTimeout(this.visibilityTimeout)
      var vm = this
      this.visibilityTimeout = setTimeout(function () {
        if (!vm.paused) {
          vm.$store.dispatch('hideControls')
        }
      }, 5000)
    },
    seek (value) {
      var vm = this
      this.seekTime += value
      clearTimeout(this.seekTimeout)
      this.seekTimeout = setTimeout(function () {
        try {
          console.log(vm.seekTime)
          if (vm.seekTime > 0) {
            webapis.avplay.jumpForward(vm.seekTime * 1000)
          } else {
            webapis.avplay.jumpBackward(Math.abs(vm.seekTime) * 1000)
          }
        } catch {}
        vm.seekTime = 0
      }, 500)
    },
    onButtonClicked (action) {
      switch (action) {
        case 'playPause':
          this.togglePlay()
          break
        case 'seekForward':
          this.seek(5)
          break
        case 'seekBackward':
          this.seek(-5)
          break
      }
    },
    onButtonFocused () {
      this.rescheduleHide()
    },
    msToTime (duration) {
      var seconds = Math.floor((duration / 1000) % 60)
      var minutes = Math.floor((duration / (1000 * 60)) % 60)
      seconds = (seconds < 10) ? '0' + seconds : seconds
      minutes = (minutes < 10) ? '0' + minutes : minutes
      return minutes + ':' + seconds
    },
    onbufferingstart () {
      console.log("Buffering start.")
      this.buffering = true
    },
    onbufferingprogress (percent) {
      console.log("Buffering progress data : " + percent)
      this.bufferPercent = percent
    },
    onbufferingcomplete () {
      console.log("Buffering complete.")
      console.log(webapis.avplay.getDuration())
      this.buffering = false
      this.buffering = 0
      this.totalTime = webapis.avplay.getDuration()
    },
    oncurrentplaytime (currentTime) {
      console.log("Current playtime: " + currentTime)
      this.currentTime = currentTime
    },
    onevent (eventType, eventData) {
      console.log("event type: " + eventType + ", data: " + eventData)
    },
    onstreamcompleted () {
      console.log("Stream Completed")
      this.$store.dispatch('closeStream')
    },
    onerror (eventType) {
      console.log("event type error : " + eventType)
    }
  },

  mounted () {
    this.listeners = {
      onbufferingstart: this.onbufferingstart,
      onbufferingprogress: this.onbufferingprogress,
      onbufferingcomplete: this.onbufferingcomplete,
      oncurrentplaytime: this.oncurrentplaytime,
      onevent: this.onevent,
      onstreamcompleted: this.onstreamcompleted,
      onerror: this.onerror,
    }
  }
}
</script>

<style lang="css">
#player {
  position: fixed;
}
#av-player {
  position: absolute;
  background: #000000;
}
#player, #av-player {
  left: 0;
  right: 0;
  width: 1920px;
  height: 1080px;
  z-index: 10;
}
#player .controls {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 12;
  display: flex;
  flex-direction: column;
  height: 200px;
  background: linear-gradient(0deg, rgba(0,0,0,0.6) 0%,rgba(0,0,0,0) 100%);
  opacity: 0;
  will-change: transform, opacity;
  transform: translateY(100%);
  transition: .2s linear;
}
#player .controls.show {
  transition: .2s linear;
  transform: translateY(0);
  opacity: 1;
}
#player .controls .control {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative;
}
#player .controls .control p {
  font-size: 20px;
  margin-bottom: 50px;
  color: #ffffff;
}
#player .controls .control .title {
  position: absolute;
  left: 32px;
  top: 0;
  bottom: 0;
  font-size: 32px;
  display: flex;
  align-items: center;
  text-align: left;
  max-width: 700px;
}
#player .controls .control .time {
  position: absolute;
  right: 30px;
  line-height: 46px;
  font-size: 22px;
}
#player .controls .control .player-buttons {
  margin-top: 4px;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  align-self: stretch;
  align-items: center;
}
#player .controls .control .player-button {
  position: relative;
  margin-bottom: 35px;
  font-size: 2.2rem;
  background: transparent;
  border: 0;
  color: #ffffff;
  outline: none;
  width: 90px;
  height: 90px;
}
#player .controls .control .player-button::after {
  content: attr(tooltip);
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateY(120%);
  font-size: 20px;
  visibility: hidden;
}
#player .controls .control .player-button:hover,
#player .controls .control .player-button:focus {
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
}
#player .controls .control .player-button:hover::after,
#player .controls .control .player-button:focus::after {
  visibility: visible;
}

.vueprogress {
  margin: 0 auto;
  margin-top: 8px;
}

.vue-slider-dot-handle {
  background: red;
}

@keyframes loadinganim {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
#playerLoader {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  color: white;
  text-align: center;
  z-index: 11;
}
#playerLoader #loading {
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 3px;
  vertical-align: middle;
  font-family: helvetica, sans-serif;
  position: relative;
}
#playerLoader #loading .bulletouter {
  animation: loadinganim 1.3s infinite;
  animation-timing-function: linear;
  animation-direction: reverse;
  width: 75px;
  height: 75px;
  background: white;
  border-radius: 50%;
  margin: 0 auto;
}
#playerLoader #loading .bulletouter .bulletinner {
  position: relative;
  left: -7.5px;
  width: 67.5px;
  height: 67.5px;
  background: #000;
  border-radius: 50%;
  margin: 0 auto;
}
#playerLoader #loading .bulletouter .mask {
  position: relative;
  left: -7.5px;
  top: -22.5px;
  width: 75px;
  height: 37.5px;
  background: #000;
  transform: rotate(45deg);
}
#playerLoader #loading .bulletouter .dot {
  position: relative;
  left: 49.5px;
  top: -48px;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
}
#playerLoader #loading p {
  position: absolute;
  left: 0;
  top: 0;
  width: 75px;
  height: 75px;
  margin: 0;
  padding: 0;
  line-height: 75px;
  text-align: center;
  z-index: 1;
  font-size: 18px;
}
</style>