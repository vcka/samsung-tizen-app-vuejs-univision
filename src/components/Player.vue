<template>
  <div id="player" v-show="playing">
    <object id="av-player" type="application/avplayer"></object>
    <div class="controls" v-show="playerControlVisibility">
      <div class="progress" :style="{transform: progressPosition}"></div>
      <div class="control">
        <h2 class="title">{{ name }}</h2>
        <div class="player-buttons">
          <button class="player-button" tabindex="0" tooltip="-30s" @focus="onButtonFocused()" >
            <font-awesome-icon icon="history" fixed-width />
          </button>
          <button class="player-button" tabindex="0" :tooltip="paused ? 'PLAY' : 'PAUSE'"  @focus="onButtonFocused()" @click="togglePlay()" ref="playButton" autofocus>
            <font-awesome-icon :icon="paused ? 'play' : 'pause'" fixed-width />
          </button>
          <button class="player-button flipped" tabindex="0" tooltip="+30s" @focus="onButtonFocused()" >
            <font-awesome-icon icon="history" flip="horizontal" fixed-width />
          </button>
        </div>
        <h2 class="time">{{ currentTimeFormatted }} / {{ totalTimeFormatted }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'Player',

  data () {
    return {
      playing: false,
      paused: false,
      currentTime: 0,
      totalTime: 0,
      name: '',
      visibilityTimeout: null
    }
  },

  computed: {
    streamItem () {
      return this.$store.getters.streamItem
    },
    playerControlVisibility () {
      return this.$store.getters.playerControlVisibility
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
        if (oldStreamObject.url == streamObject.url) return

        if (streamObject.url === '') {
          this.paused = false
          this.currentTime = 0
          this.totalTime = 0
          this.name = ''
          webapis.avplay.close()
          this.playing = false
          return
        }

        this.playing = true
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
    }
  },

  methods: {
    togglePlay () {
      if (this.paused) {
        webapis.avplay.play()
        this.paused = false
      } else {
        webapis.avplay.pause()
        this.paused = true
      }
    },
    rescheduleHide () {
      clearTimeout(this.visibilityTimeout)
      if (!this.paused) {
        var vm = this
        this.visibilityTimeout = setTimeout(function () {
          vm.$store.dispatch('hideControls')
        }, 5000)
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
    },
    onbufferingprogress (percent) {
      console.log("Buffering progress data : " + percent)
    },
    onbufferingcomplete () {
      console.log("Buffering complete.")
      console.log(webapis.avplay.getDuration())
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
  z-index: 11;
  background: #333333;
  display: flex;
  flex-direction: column;
  height: 80px;
}
#player .controls .progress {
  width: 100%;
  height: 4px;
  background: #F72F2F;
  transform: translateX(-100%);
  will-change: transform;
}
#player .controls .control {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}
#player .controls .control .title {
  position: absolute;
  left: 30px;
  line-height: 76px;
  font-size: 22px;
}
#player .controls .control .time {
  position: absolute;
  right: 30px;
  line-height: 76px;
  font-size: 22px;
}
#player .controls .control .player-buttons {
  margin-top: 4px;
}
#player .controls .control .player-button {
  position: relative;
  margin: 0 10px;
  font-size: 2.5rem;
  background: transparent;
  border: 0;
  color: #D7D7D7;
  outline: none;
}
#player .controls .control .player-button::before {
  content: "";
  position: absolute;
  top:-10px;
  left:50%;
  transform: translateX(-50%);
  border-width: 4px 6px 0 6px;
  border-style: solid;
  border-color: #ffffff transparent transparent transparent;
  z-index: 99;
  opacity:0;
}
#player .controls .control .player-button::after {
  content: attr(tooltip);
  position: absolute;
  left:50%;
  top:-10px;
  transform: translateX(-50%) translateY(-100%);
  background: #ffffff;
  text-align: center;
  color: #000;
  font-size: 20px;
  min-width: 80px;
  border-radius: 5px;
  pointer-events: none;
  padding: 8px 4px;
  z-index:99;
  opacity:0;
}
#player .controls .control .player-button:hover,
#player .controls .control .player-button:focus {
  color: #ffffff;
}
#player .controls .control .player-button:hover svg,
#player .controls .control .player-button:focus svg {
  filter: drop-shadow(12px 12px 5px rgba(0,0,0,0.5));
}
#player .controls .control .player-button.flipped:hover svg,
#player .controls .control .player-button.flipped:focus svg {
  filter: drop-shadow(-12px 12px 5px rgba(0,0,0,0.5));
}
#player .controls .control .player-button:hover::after,
#player .controls .control .player-button:hover::before,
#player .controls .control .player-button:focus::after,
#player .controls .control .player-button:focus::before {
   opacity:1
}
</style>