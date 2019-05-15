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
      this.$store.dispatch('playStream', {name: this.myItem.name, url: 'http://clips.vorwaerts-gmbh.de/VfE.webm'})
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