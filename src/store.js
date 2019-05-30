import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    scrollStates: {},
    episodeSelections: {},
    focusedItem: null,
    streamItem: {
      name: '',
      url: ''
    },
    showPlayerControls: false,
    pauseStream: false
  },
  mutations: {
    upsertScrollState (state, updateStateData) {
      state.scrollStates[updateStateData.path] = updateStateData.data
    },
    removeScrollState (state, updateStateKey) {
      delete state.scrollStates[updateStateKey]
    },
    upsertEpisodeSelection (state, updateStateData) {
      state.episodeSelections[updateStateData.path] = updateStateData.episodeIndex
    },
    removeEpisodeSelection (state, updateStateKey) {
      delete state.episodeSelections[updateStateKey]
    },
    focusItem (state, item) {
      state.focusedItem = item
    },
    changeStream (state, streamObject) {
      state.streamItem = streamObject
    },
    updatePlayerControls (state, value) {
      state.showPlayerControls = value
    },
    togglePlayPause (state) {
      state.pauseStream = !state.pauseStream
    },
    updatePlayPause (state, value) {
      state.pauseStream = value
    }
  },
  getters: {
    focusedItem (state) {
      return state.focusedItem || {}
    },
    streamItem (state) {
      return state.streamItem
    },
    playerControlVisibility (state) {
      return state.showPlayerControls
    },
    isStreamPaused (state) {
      return state.pauseStream
    }
  },
  actions: {
    playStream (context, value) {
      context.commit('changeStream', value)
      context.commit('updatePlayerControls', true)
    },
    closeStream (context) {
      context.commit('changeStream', {name: '', url: ''})
    },
    hideControls (context) {
      context.commit('updatePlayerControls', false)
    },
    showControls (context) {
      context.commit('updatePlayerControls', true)
    },
    toggleStreamPlayPause (context, value) {
      if (value === undefined) {
        context.commit('togglePlayPause')
      } else {
        context.commit('updatePlayPause', value)
      }
    }
  }
})
