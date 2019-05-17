<template>
  <div class="modal sourceModal">
    <div class="content">
      <h1>{{ myItem.name }}</h1>
      <div class="buttons" ref="sourceButtons">
        <div class="button" :key="index" v-for="(media, index) in myItem.medias" tabindex="0" @keyup.enter="onButtonClick(media, index)" @click="onButtonClick(media, index)" @focus="onItemFocused(index)" :class="{lastFocused: focusedItemIndex == index}">
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
      myItem: this.item,
      focusedItemIndex: 0
    }
  },

  methods: {
    onButtonClick (media, index) {
      console.log(media, index)
      console.log("http://192.168.137.1:8000/watch.m3u8?url=" + media.resources[0])
      this.$store.dispatch('playStream', {name: this.myItem.name, url: 'http://clips.vorwaerts-gmbh.de/VfE.webm'})
    },
    onItemFocused (focusedItemIndex) {
      this.focusedItemIndex = focusedItemIndex
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