import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    scrollStates: {},
    episodeSelections: {},
    focusedItem: null
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
    }
  },
  getters: {
    focusedItem (state) {
      return state.focusedItem || {}
    }
  },
  actions: {

  }
})
