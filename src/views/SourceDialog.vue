<template>
  <div class="modal">
    <div class="content">
      <h1>{{ myItem.name }}</h1>
      <div class="buttons" ref="sourceButtons">
        <div class="button" :key="index" v-for="(media, index) in myItem.medias" tabindex="0" @keyup.enter="onButtonClick(media, index)" @click="onButtonClick(media, index)">
          {{ media.audio }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'SourceDialog',

  props: ['item'],

  data () {
    return {
      myItem: this.item
    }
  },

  methods: {
    onButtonClick (media, index) {
      console.log(media, index)
      console.log("http://192.168.137.1:8000/watch.m3u8?url=" + media.resources[0])
      var listener = {
        onbufferingstart: function () {
          console.log("Buffering start.")
        },
        onbufferingprogress: function (percent) {
          console.log("Buffering progress data : " + percent)
        },
        onbufferingcomplete: function () {
          console.log("Buffering complete.")
        },
        oncurrentplaytime: function (currentTime) {
          console.log("Current playtime: " + currentTime)
        },
        onevent: function (eventType, eventData) {
          console.log("event type: " + eventType + ", data: " + eventData)
        },
        onstreamcompleted: function () {
          console.log("Stream Completed")
        },
        onerror: function (eventType) {
          console.log("event type error : " + eventType)
        }
      }
      webapis.avplay.open("http://clips.vorwaerts-gmbh.de/VfE.webm")
      webapis.avplay.setDisplayRect(
        0,
        0,
        1920,
        1080
      )
      webapis.avplay.setListener(listener)

      document.getElementById('av-player').style.display = 'block'

      if (webapis.avplay.getState() === 'IDLE') {
        webapis.avplay.prepare()
        webapis.avplay.play()
      } else if (webapis.avplay.getState() === 'PAUSED') {
        webapis.avplay.play()
      }
    }
  },

  mounted () {
    this.$refs['sourceButtons'].children[0].focus()
  },

  activated () {
    this.$refs['sourceButtons'].children[0].focus()
  }
}
</script>

<style lang="css">
</style>