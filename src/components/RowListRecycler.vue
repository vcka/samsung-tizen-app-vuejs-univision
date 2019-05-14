<template>
  <div class="row">
    <div class="top">
      <h2>{{ item.name }}</h2>
      <h2 class="total">{{ focusedItemIndex + 1 }} of {{ item.list.length }}</h2>
    </div>

    <RecycleScroller class="scroller" :class="{category: item.contains == 'category'}" keyField="uid" :items="item.list" direction="horizontal" :item-size="item.contains == 'category' ? 373 : 224" v-slot="{item, index}">
      <div class="item" tabIndex="0" :data-index="index" @keyup.enter="onItemClicked(item, index)" @click="onItemClicked(item, index)" @focus="onItemFocused(item, index)" :class="{lastFocused: focusedItemIndex == index}">
        <img :src="fullSrc(item.poster)" alt="">
      </div>
    </RecycleScroller>
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
    onItemFocused (focusedItem, focusedItemIndex) {
      this.focusedItemIndex = focusedItemIndex
      this.$root.$emit('itemFocused', focusedItem)
      this.$emit('itemFocused', this.index)
    },
    onItemClicked (item, itemIndex) {
      this.$emit('itemClicked', item, this.index, itemIndex, 'recycler')
    }
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