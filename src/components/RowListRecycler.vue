<template>
  <div class="row">
    <div class="top">
      <h2>{{ item.name }}</h2>
      <h2 class="total">{{ focusedItemIndex + 1 }} of {{ item.list.length }}</h2>
    </div>

    <RecycleScroller class="scroller" :class="{category: item.contains == 'category'}" keyField="uid" :items="item.list" direction="horizontal" :item-size="item.contains == 'category' ? 373 : 224" v-slot="{item, index}">
      <div class="item" tabIndex="0" :data-index="index" @keyup.enter="onItemClicked(item, index)" @click="onItemClicked(item, index)" @focus="onItemFocused(item, index)" :class="{lastFocused: focusedItemIndex == index}">
        <img class="owl-lazy" :src="fullSrc(item.poster)" alt="">
      </div>
    </RecycleScroller>
    <!--<div class="owl-carousel owl-theme" :class="{category: item.contains == 'category'}" ref="carousel">
      <div class="item" tabIndex="0" @keyup.enter="onItemClicked(listItem, listItemIndex)" :key="listItem.uid" v-for="(listItem, listItemIndex) in item.list" @click="onItemClicked(listItem, listItemIndex)" @focus="onItemFocused(listItem, listItemIndex)">
        <img class="owl-lazy" :data-src="fullSrc(listItem.poster)" alt="">
      </div>
    </div>-->
  </div>
</template>

<script>

export default {

  name: 'RowListRecycler',

  props: ['item', 'index'],

  data () {
    return {
      focusedItemIndex: 0
    }
  },

  methods: {
    fullSrc (src) {
      return "http://192.168.2.88:8001" + src
    },
    onItemFocused (focusedItem, focusedItemIndex,) {
      this.focusedItemIndex = focusedItemIndex
      this.$root.$emit('itemFocused', focusedItem)
    },
    onItemClicked (item, itemIndex) {
      this.$emit('itemClicked', item, this.index, itemIndex, 'recycler')
      /*if (item.type == 'movie' || item.type == 'series') {
        console.log("MOVIE CLICKED PogU", item)
        this.$router.push({
          name: 'movie',
          params: {
            movieId: item.uid,
            item: item
          }
        })
      } else {
        this.$router.push({
          name: 'browselist',
          params: {
            id: this.urlCleanId(item.url)
          }
        })
      }*/
    }
  },

  mounted () {
    /*var carouselItems = 9,
        margin = 0
    if (this.item.contains == 'category') {
      carouselItems = 5
      margin = -150
    }
    var loop = false
    if (this.item.list.length < carouselItems) {
      loop = false
    }
    $(this.$refs["carousel"]).owlCarousel({
      stagePadding: 60,
      loop:loop,
      margin:margin,
      nav:false,
      items: carouselItems,
      mouseDrag: false,
      touchDrag: false,
      pullDrag: false,
      freeDrag: false,
      checkVisible: false,
      smartSpeed: 150,
      lazyLoad: true,
      lazyLoadEager: 2
    })*/
    /*if (this.index == 0) {
      $(this.$refs["carousel"]).find('.item:first').focus()
    }*/
  }
}
</script>

<style lang="css">
  .item {
    width: 175px;
    height: 259px;
    padding: 0;
    margin-right: 49px;
    display: block;
    transition: transform .1s;
  }

  .item:focus {
    outline: 6px solid #ff4d4d;
    transform: scale(1.1);
  }

  .item img {
    width: 175px;
    height: 259px;
  }

  .category .item,
  .category .item img {
    width: 300px;
    height: 220px;
  }

  .vue-recycle-scroller.scroller.direction-horizontal:not(.page-mode) {
    padding-left: 60px;
    padding-right: 60px;
    height: 300px;
    align-items: center;
    overflow: hidden;
  }

  .scroller,
  .row .vue-recycle-scroller.direction-horizontal .vue-recycle-scroller__item-wrapper,
  .row .vue-recycle-scroller.ready.direction-horizontal .vue-recycle-scroller__item-view {
    height: 259px;
  }

  .row .vue-recycle-scroller.direction-horizontal .vue-recycle-scroller__item-wrapper {
    overflow: visible;
  }

</style>