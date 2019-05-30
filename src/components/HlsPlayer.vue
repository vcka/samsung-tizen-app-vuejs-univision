<template>
  <video id="av-player"></video>
</template>
<script>
import Hls from 'hls.js'
export default {

  name: 'HlsPlayer',

  data () {
    return {

    }
  },

  methods: {
    play (url) {
      this.close()
      const hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(document.getElementById('av-player'))
      this.player.play()
    },
    pause () {
      this.player.pause()
    },
    resume () {
      this.player.play()
    },
    close () {
      this.player.src = ''
    },
    seek (seconds) {
      this.player.currentTime = this.player.currentTime + seconds;
    }
  },

  mounted () {
    this.player = document.getElementById('av-player')
    this.player.addEventListener('waiting', () => {
      this.$emit('buffering', 0)
    })
    this.player.addEventListener('playing', () => {
      this.$emit('playing')
    })
    this.player.addEventListener('loadedmetadata', () => {
      if (this.player.source !== '') {
        this.$emit('totaldurationupdated', this.player.duration * 1000)
      }
    })
    this.player.addEventListener('timeupdate', () => {
      this.$emit('timeupdated', this.player.currentTime * 1000)
    })
    this.player.addEventListener('ended', () => {
      this.$emit('completed')
    })
  }
}
</script>

<style lang="css" scoped>
</style>