<template>
  <div class="row">
    <div class="top">
      <h2>{{ item.name }}</h2>
      <h2 class="total">{{ focusedItemIndex + 1 }} of {{ item.list.length }}</h2>
    </div>

    <template v-if="(item.contains == 'category' && item.list.length > itemsPerRowCategory) || (item.contains != 'category' && item.list.length > itemsPerRowNormal)">
      <RecycleScroller class="scroller" :class="{category: item.contains == 'category'}" keyField="uid" :items="item.list" direction="horizontal" :item-size="item.contains == 'category' ? itemWidthCategory : itemWidthNormal" v-slot="{item, index}">
        <div class="item rowItem" tabIndex="0" :data-index="index" @keyup.enter="onItemClicked(item, index, true)" @click="onItemClicked(item, index, true)" @focus="onItemFocused(item, index)" :class="{lastFocused: focusedItemIndex == index}">
          <img :src="fullSrc(item.poster)" alt="">
        </div>
      </RecycleScroller>
    </template>
    <template v-else>
      <div class="scroller normalRow" :class="{category: item.contains == 'category'}">
        <div class="item rowItem" tabIndex="0" :key="'normalRow-' + listIndex" v-for="(listItem, listIndex) in item.list" :data-index="listIndex" @keyup.enter="onItemClicked(listItem, listIndex, false)" @click="onItemClicked(listItem, listIndex, false)" @focus="onItemFocused(listItem, listIndex)" :class="{lastFocused: focusedItemIndex == listIndex}">
          <img :src="fullSrc(listItem.poster)" alt="">
        </div>
      </div>
    </template>
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
      return process.env.VUE_APP_API_SERVER + src
    },
    onItemFocused (focusedItem, focusedItemIndex) {
      this.focusedItemIndex = focusedItemIndex
      this.$store.commit('focusItem', focusedItem)
      //this.$root.$emit('itemFocused', focusedItem)
      this.$emit('itemFocused', this.index)
    },
    onItemClicked (item, itemIndex, isRecycler) {
      this.$emit('itemClicked', item, this.index, itemIndex, isRecycler ? 'recycler' : 'normal')
    }
  },

  created () {
    this.itemWidthCategory = 373
    this.itemWidthNormal = 224
    this.itemsPerRowCategory = 5
    this.itemsPerRowNormal = 8
  }
}
</script>

<style lang="css">
  .rowItem {
    width: 175px;
    height: 259px;
    padding: 0;
    margin-right: 49px;
    display: block;
    transition: transform .1s;
  }

  .rowItem:focus {
    outline: 6px solid #ff4d4d;
    transform: scale(1.1);
  }

  .rowItem img {
    width: 175px;
    height: 259px;
  }

  .category .rowItem,
  .category .rowItem img {
    width: 300px;
    height: 220px;
  }

  .scroller,
  .vue-recycle-scroller.scroller.direction-horizontal:not(.page-mode) {
    display: flex;
    padding-left: 60px;
    padding-right: 60px;
    height: 300px;
    align-items: center;
    overflow: hidden;
  }

  .row .vue-recycle-scroller.direction-horizontal .vue-recycle-scroller__item-wrapper,
  .row .vue-recycle-scroller.ready.direction-horizontal .vue-recycle-scroller__item-view {
    height: 259px;
  }

  .scroller,
  .row .vue-recycle-scroller.direction-horizontal .vue-recycle-scroller__item-wrapper {
    overflow: visible;
  }

</style>