import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    scrollStates: {},
    episodeSelections: {},
    serieses: []
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
    addSeries (state, payload) {
      var index = state.serieses.findIndex(function (series) {
        return series.uid == payload.uid
      })
      if (index === -1) {
        state.serieses.push(payload)
      }
    }
  },
  getters: {
    getSeriesByUid: state => uid => {
      return state.serieses.filter(function (series) {
        return series.uid == uid
      })[0]
    }
  },
  actions: {

  }
})
