<template>
  <div class="modal sourceModal">
    <div class="content">
      <h1>{{ myItem.name }}</h1>
      <div class="buttons" ref="sourceButtons">
        <div class="button dialogButton" :key="index" v-for="(media, index) in myItem.medias" tabindex="0" @keyup.enter="onButtonClick(media)" @click="onButtonClick(media, index)" @focus="onItemFocused(index)" :class="{lastFocused: focusedItemIndex == index}">
          {{ translateAudio(media.audio) }}
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
      myItem: this.item,
      focusedItemIndex: 0
    }
  },

  methods: {
    onButtonClick (media) {
      // this.$store.dispatch('playStream', {name: this.myItem.name, url: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8'})
      this.$store.dispatch('playStream', {
        name: this.myItem.name,
        url: process.env.VUE_APP_MEDIA_SERVER + '/' + encodeURIComponent(media.resources[0]) + '.m3u8'
      })
    },
    onItemFocused (focusedItemIndex) {
      this.focusedItemIndex = focusedItemIndex
    },
    translateAudio (audio) {
      switch (audio) {
        case 'en':
          return 'Англи'
        case 'mn':
          return 'Монгол'
        case 'ru':
          return 'Орос'
        case 'ko':
          return 'Солонгос'
        default:
          return audio
      }
    }
  },

  mounted () {
    this.focusedItemIndex = 0
    this.$refs['sourceButtons'].children[0].focus()
  },

  activated () {
    this.focusedItemIndex = 0
    this.$refs['sourceButtons'].children[0].focus()
  }
}
</script>

<style lang="css">
</style>