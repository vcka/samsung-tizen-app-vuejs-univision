<template>
  <div class="modal seriesModal">
    <div class="content">
      <h1>{{ myItem.name }}</h1>
      <div class="buttons" ref="seriesButtons">
        <div class="lds-ripple" v-show="loading">
          <div></div><div></div>
        </div>
        <div class="button dialogButton" :key="index" v-for="(episode, index) in episodes" tabindex="0" @keyup.enter="onButtonClick(episode, index)" @click="onButtonClick(episode, index)">
          <span>{{ index+1 + ') ' }}</span>{{ episode.name }}
        </div>
        <div class="more">
          <i v-show="episodes.length > 14"></i>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {

  name: 'SeriesDialog',

  props: ['item'],

  data () {
    return {
      loading: true,
      episodes: [],
      myItem: this.item,
      createdEventRan: false
    }
  },

  methods: {
    onButtonClick (episode, index) {
      this.$store.commit('upsertEpisodeSelection', {
        path: this.$route.fullPath,
        episodeIndex: index
      })
      this.$router.push({
        name: 'seriesmovie',
        params: {
          episodeNumber: index,
          item: episode
        }
      })
    }
  },

  created () {
    this.loading = true
    var postData = {
      episodesContentInfoIds: this.myItem.contentInfoIds
    }
    fetch(process.env.VUE_APP_API_SERVER + this.myItem.post_url, {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      return response.json()
    }).then((data) => {
      this.episodes = data['episodes']
      this.loading = false
      this.$nextTick(() => {
        this.$refs['seriesButtons'].getElementsByClassName('button')[0].focus()
      })
    }).catch(() => {
      this.loading = false
    })
  },

  activated () {
    if (!this.createdEventRan) {
      this.createdEventRan = true
      return
    }
    if (this.$route.name == 'series') {
      var index = this.$store.state.episodeSelections[this.$route.fullPath]
      index = index || 0
      this.$refs['seriesButtons'].getElementsByClassName('button')[index].focus()
    }
  }
}
</script>

<style lang="css">
</style>