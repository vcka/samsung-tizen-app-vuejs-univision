<template>
  <object id="av-player" type="application/avplayer"></object>
</template>

<script>
export default {

  name: 'AvPlayer',

  data () {
    return {

    }
  },

  methods: {
    play (url) {
      this.close()
      setTimeout(() => {
        webapis.avplay.open(url)
        webapis.avplay.setDisplayRect(0, 0, 1920, 1080)
        webapis.avplay.setListener(this.listeners)
        webapis.avplay.prepareAsync(this.success, this.error)
      }, 500)
    },
    pause () {
      webapis.avplay.pause()
    },
    resume () {
      webapis.avplay.play()
    },
    close () {
      webapis.avplay.close()
    },
    seek (seconds) {
      try {
        if (seconds > 0) {
          webapis.avplay.jumpForward(seconds * 1000)
        } else {
          webapis.avplay.jumpBackward(Math.abs(seconds) * 1000)
        }
      } catch {
        // empty
      }
    },
    success () {
      this.$emit('totaldurationupdated', webapis.avplay.getDuration())
      webapis.avplay.play()
    },
    error (err) {
      console.log('err')
      console.log(err)
    }
  },

  mounted () {
    this.listeners = {
      onbufferingprogress: (percent) => {
        this.$emit('buffering', percent)
      },
      onbufferingcomplete: () => {
        this.$emit('playing')
      },
      oncurrentplaytime: (currentTime) => {
        this.$emit('timeupdated', currentTime)
      },
      onevent: (eventType, eventData) => {
        console.log("event type: " + eventType + ", data: " + eventData)
      },
      onstreamcompleted: () => {
        this.$emit('completed')
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>