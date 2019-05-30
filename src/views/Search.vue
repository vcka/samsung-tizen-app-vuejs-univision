<template>
  <div id="search-screen">
    <div class="input-effect">
      <label>Search</label>
      <input id="searchInput" class="effect-22 searchInput" type="text" placeholder="" @input="debounceSearch($event.target.value)" ref="mySearchInput">
    </div>
    <h2 v-show="searchText != '' && !searching">Search results for "<span>{{ searchText }}</span>" ({{ items.length }})</h2>
    <h2 v-show="searching">Searching...</h2>
    <GridList @itemClicked="searchItemClicked" :emitOnFocus="false" :items="items" :itemSize="405" :size="8" ref="myGridContainer" />
      <!--<div class="grid-row" :key="'gridRow-' + rowIndex" v-for="(chunk, rowIndex) in chunkedItems">
        <div class="grid-item" :key="'gridItem-' + columnIndex" v-for="(item, columnIndex) in chunk" tabindex="0" @click="searchItemClicked(item, rowIndex, columnIndex)" @keyup.enter="searchItemClicked(item, rowIndex, columnIndex)">
          <img :src="fullSrc(item.poster)" alt="">
          <div class="vertically-centered"><p>{{ item.name }}</p></div>
        </div>
        <template v-if="chunk.length < size">
          <div class="grid-item-dummy" :key="index" v-for="index in size - chunk.length"></div>
        </template>
      </div>-->
    <router-view/>
  </div>
</template>

<script>
import GridList from '@/components/GridList.vue'

export default {

  name: 'Search',

  components: {
    GridList
  },

  data () {
    return {
      searching: false,
      searchText: '',
      items: [],
      timeout: null
    }
  },

  mounted () {
    this.$refs['mySearchInput'].focus()
  },

  methods: {
    debounceSearch (val) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.fetchSearch(val)
      }, 500)
    },
    fetchSearch (searchValue) {
      this.searching = true
      fetch(process.env.VUE_APP_API_SERVER + '/api/search/' + searchValue).then(function(response) {
        return response.json()
      }).then((data) => {
        this.searchText = searchValue
        this.searchCount = data.results.length
        this.items = data.results
        this.searching = false
      }).catch(() => {
        this.searching = false
      })
    },
    searchItemClicked (item, itemRowIndex, itemColumnIndex) {
      var state = {
        path: this.$route.fullPath,
        data: {
          fromScrollPositionTop: this.$refs['myGridContainer'].scrollTop,
          fromRow: itemRowIndex,
          fromColumn: itemColumnIndex,
          isGrid: true
        }
      }
      this.$store.commit('upsertScrollState', state)
      this.$router.push({
        name: 'searchmovie',
        params: {
          movieId: item.uid,
          item: item
        }
      })
    }
  },

  watch: {
    '$route' (to, from) {
      if (to.name == 'search' && from.name == 'searchmovie') {
        var restoreState = this.$store.state.scrollStates[to.fullPath]
        if (restoreState) {
          console.log(this.$refs['myGridContainer'].$el.querySelector('.vue-recycle-scroller__item-view .grid-item.lastFocused'))
          this.$refs['myGridContainer'].$el.querySelector('.vue-recycle-scroller__item-view .grid-item.lastFocused').focus()
          /*this.$refs['myGridContainer'].scrollTop = restoreState.fromScrollPositionTop
          this.$refs['myGridContainer'].firstElementChild.children[restoreState.fromRow].children[restoreState.fromColumn].focus()*/
          this.$store.commit('removeScrollState', to.fullPath)
        }
      }
    }
  }
}
</script>

<style lang="css">
#search-screen {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background: radial-gradient(circle at 0% 0%, #373b52, #252736 51%, #1d1e26);
  display: flex;
  flex-direction: column;
}
#search-screen .input-effect {
  display: flex;
  margin: 40px auto;
  width: 1000px;
  flex-direction: column;
  align-items: flex-start;
}
#search-screen .effect-22 {
  width: 100%;
  border: 0;
  padding: 20px 22px;
  border: 1px solid #ccc;
  background: rgba(57, 63, 84, 0.8);
  font-size: 28px;
  color: #fff;
}

#search-screen .input-effect label{
  font-size: 22px;
  color: #e4e4e4;
  margin-bottom: 10px;
}

#search-screen h2 {
  font-size: 34px;
  color: #e4e4e4;
}
#search-screen h2 span {
  color: #fff;
}
</style>