<template>
  <div class="home">
    <div id="logtest"></div>
    <router-link tag="a" :to="{name: 'search'}" class="search" tabindex="0" @focus.native="shouldCache = false">
      <font-awesome-icon icon="search" />
      <span>ХАЙЛТ</span>
    </router-link>
    <Description />
    <div id="rowlist" ref="myRowList">
      <template v-if="items.length == 1 && items[0].contains != 'category'">
        <GridList @itemClicked="itemClicked" :emitOnFocus="true" :items="items[0].list" :header="items[0].name" :itemSize="315" v-if="items[0]" class="singleCatGrid" :size="8" />
      </template>
      <template v-else>
        <RowListRecycler @itemClicked="itemClicked" :item="item" :index="index" :key="item.uid" v-for="(item, index) in items" />
      </template>
    </div>

    <div class="loader-wrapper" :style="{visibility: loading ? 'visible' : 'hidden'}">
      <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>

    <keep-alive v-if="shouldCache">
      <router-view :key="$route.path"/>
    </keep-alive>
    <router-view v-else/>
  </div>
</template>

<script>
// @ is an alias to /src
import Description from '@/components/Description.vue'
import RowListRecycler from '@/components/RowListRecycler.vue'
import GridList from '@/components/GridList.vue'

export default {
  name: 'home',
  props: ['id'],
  components: {
    Description,
    RowListRecycler,
    GridList
  },
  data () {
    return {
      loading: true,
      items: [],
      chosenItem: null,
      shouldCache: true
    };
  },
  computed: {
    listUrl () {
      var baseUrl = "http://192.168.2.88:8001/api/list/"
      if (this.id) {
        return baseUrl + this.id
      }
      return baseUrl
    }
  },
  watch: {
    '$route': function (to, from) {
      var restoreState = this.$store.state.scrollStates[to.fullPath]
      if ((from.name == 'movie' || from.name == 'series') && restoreState) {
        if (this.$refs['myRowList'].firstElementChild.classList.contains('singleCatGrid')) {
          this.$refs['myRowList'].querySelector('.vue-recycle-scroller__item-view .grid-item.lastFocused').focus()
        } else {
          this.$refs['myRowList'].querySelector('.row:nth-child(' + (restoreState.fromRow + 1) + ') .item.lastFocused').focus()
        }
        this.$store.commit('removeScrollState', to.fullPath)
      }
      if (to.name == 'browselist' && from.name == 'browselist') {
        var vm = this
        this.fetchList().then(function () {
          if (restoreState) {
            var rowScroller = vm.$refs['myRowList'].querySelector('.row:nth-child(' + (restoreState.fromRow + 1) + ') .vue-recycle-scroller')
            vm.$refs['myRowList'].scrollTop = restoreState.fromScrollPositionTop
            rowScroller.scrollLeft = restoreState.fromScrollPositionLeft

            
            setTimeout(function () {
              rowScroller.querySelector('.item[data-index="' + (restoreState.fromColumn) + '"]').focus()
            }, 200)

            /*var carousel = $(vm.$refs['myRowList']).find('.owl-carousel').eq(restoreState.fromRow)
            carousel.trigger('to.owl.carousel', [restoreState.fromColumn, 0, true])
            carousel.find('.item').eq(restoreState.fromColumn).focus()*/
            vm.$store.commit('removeScrollState', to.fullPath)
          } else {
            if (vm.$refs['myRowList'].firstElementChild.classList.contains('singleCatGrid')) {
              vm.$refs['myRowList'].querySelector('.grid-item').focus()
            } else {
              vm.$refs['myRowList'].querySelector('.item').focus()
            }
          }
        })
      }
      if (to.name == 'browselist' && from.name == 'search') {
        if (this.$refs['myRowList'].firstElementChild.classList.contains('singleCatGrid')) {
          this.$refs['myRowList'].querySelector('.vue-recycle-scroller__item-view .grid-item.lastFocused').focus()
        } else {
          this.$refs['myRowList'].querySelector('.item.lastFocused').focus()
        }
      }
    }
  },
  methods: {
    fetchList () {
      console.log("Fetch", this.listUrl)
      var vm = this
      this.loading = true
      return fetch(this.listUrl).then(function(response) {
        return response.json()
      }).then(function(data) {
        vm.items = data['data']
        vm.loading = false
      }).catch(function() {
        vm.loading = false
      });
    },
    urlCleanId (url) {
      if (url) return url.replace('/api/list/', '')
      return ''
    },
    itemClicked (item, itemRowIndex, itemColumnIndex, layoutType) {
      this.shouldCache = item.type == 'series'
      var state = {
        path: this.$route.fullPath,
        data: {
          fromScrollPositionTop: document.getElementById("rowlist").scrollTop,
          fromRow: itemRowIndex,
          fromColumn: itemColumnIndex,
          isGrid: true
        }
      }
      if (layoutType == 'recycler') {
        state.data.isGrid = false
        state.data.fromScrollPositionLeft = document.querySelector("#rowlist .row:nth-child(" + (itemRowIndex + 1) + ") .vue-recycle-scroller").scrollLeft
      }
      this.$store.commit('upsertScrollState', state)
      if (item.type == 'movie') {
        this.$router.push({
          name: 'movie',
          params: {
            movieId: item.uid,
            item: item
          }
        })
      }
      else if (item.type == 'series') {
        this.$store.commit('removeEpisodeSelection', '/browselist/series/' + item.uid)
        this.$router.push({
          name: 'series',
          params: {
            seriesId: item.uid,
            item: item
          }
        })
      }
      else {
        this.$router.push({
          name: 'browselist',
          params: {
            id: this.urlCleanId(item.url)
          }
        })
      }
    }
  },
  created () {
    var vm = this
    this.fetchList().then(function () {
      if (vm.$refs['myRowList'].firstElementChild.classList.contains('singleCatGrid')) {
        vm.$refs['myRowList'].querySelector('.grid-item').focus()
      } else {
        vm.$refs['myRowList'].querySelector('.item').focus()
      }
    })
  }
}
</script>

<style lang="css">
  #logtest {
    position: absolute;
    color: red;
  }
  #rowlist {
    height: 540px;
    overflow-y: hidden;
    overflow-x: hidden;
    /*padding-bottom: 60px;*/
    display: flex;
    flex-direction: column;
  }
  .row {
    will-change: opacity;
  }
  .row h2 {
    font-size: 32px;
    margin-left: 60px;
    text-align: left;
  }
  .top {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    padding-bottom: 12px;
  }
  .top .total {
    font-size: 30px;
    color: #D7D7D7;
    margin-right: 60px;
  }
  .row .owl-carousel .owl-stage-outer {
    overflow: visible;
  }
  .home .loader-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #000000;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .home .loader-wrapper .lds-ellipsis {
    position: relative;
    width: 64px;
    height: 64px;
  }

  .search {
    position: absolute;
    right: 20px;
    top: 16px;
    z-index: 1;
    padding: 10px 40px;
    font-size: 20px;

    -webkit-appearance: none;
    background: linear-gradient(to right, #a2ccb6 0%, #fceeb5 50%, #ee786e 100%);
    background-position: 100%;
    background-size: 500%;
    border: none;
    border-radius: 50px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    color: #fff;
    cursor: pointer;
    -webkit-font-smoothing: antialiased;
    letter-spacing: 1px;
    user-select: none;
    outline: none;
    transition: transform .3s;
    text-decoration: none;
    will-change: transform;
  }

  .search:hover, .search:focus {
    animation-name: gradient;
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-fill-mode: forwards;
    transform: scale(1.12);
  }

  .search span {
    margin-left: 10px;
  }

  @keyframes gradient {
    0% {
      background-position: 100%;
    }
    50% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100%;
    }
  }

  .grid-container {
    margin: 30px;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
  }

  .grid-row,
  .grid-container .vue-recycle-scroller__item-view {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 15px;
    margin-bottom: 30px;
  }

  .grid-item, .grid-item-dummy {
    flex: 0 0 200px;
    display: flex;
    flex-direction: column;
    margin: 0;
    transition: transform .1s;
    will-change: transform, outline;
  }

  .grid-item:focus {
    outline: 6px solid #ff4d4d;
    transform: scale(1.05);
  }

  .grid-item img {
    width: 200px;
    height: 300px;
  }

  .vertically-centered {
    font-size: 25px;
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background: rgba(0, 0, 0, .45);
  }

  .vertically-centered p {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-height: 60px;
    margin: 10px auto;
    color: #fff;
  }

  .singleCatGrid .vertically-centered {
    display: none;
  }

  .singleCatGrid {
    margin: 0 95px;
  }

  .singleCatGrid .grid-scroll-container.vue-recycle-scroller.direction-vertical,
  .grid-container .grid-scroll-container.vue-recycle-scroller.direction-vertical {
    overflow: hidden;
    padding-bottom: 60px;
  }

  .grid-container .vue-recycle-scroller__item-wrapper {
    overflow: visible;
  }

  .singleCatGrid .grid-row,
  .singleCatGrid .vue-recycle-scroller__item-view {
    margin-bottom: 0;
  }

  .singleCatGrid .grid-item:focus {
    outline: 5px solid #ff4d4d;
    transform: none;
  }

  .singleCatGrid .top {
    margin-top: 30px;
  }

  .singleCatGrid .top h2 {
    font-size: 28px;
    margin-left: 10px;
    text-align: left;
    padding: 0;
  }

  .singleCatGrid .top .total {
    color: #D7D7D7;
    margin-right: 10px;
  }

</style>