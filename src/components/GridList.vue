<template>
  <div class="grid-container">
    <div class="top" v-if="header">
      <h2>{{ header }}</h2>
      <h2 class="total">{{ focusedItemIndex + 1 }} of {{ items.length }}</h2>
    </div>

    <RecycleScroller class="grid-scroll-container" key-field="id" :items="chunkedItems" :item-size="itemSize" v-slot="{item, index}">
      <div class="grid-item" tabindex="0" :data-index="columnIndex" :key="'gridItem-' + index + '-' + columnIndex" v-for="(gridItem, columnIndex) in item.items" @click="onItemClicked(gridItem, index, columnIndex)" @keyup.enter="onItemClicked(gridItem, index, columnIndex)" @focus="onItemFocused(gridItem, index * size + columnIndex)" :class="{lastFocused: focusedItemIndex == index * size + columnIndex}">
        <img :src="fullSrc(gridItem.poster)" alt="">
        <div class="vertically-centered"><p>{{ gridItem.name }}</p></div>
      </div>
      <template v-if="item.items.length < size">
        <div class="grid-item-dummy" :key="index" v-for="index in size - item.items.length"></div>
      </template>
      <!--<div class="item" tabIndex="0" :data-index="index" @keyup.enter="onItemClicked(item, index)" @click="onItemClicked(item, index)" @focus="onItemFocused(item, index)" :class="{lastFocused: focusedItemIndex == index}">
        <img class="owl-lazy" :src="fullSrc(item.poster)" alt="">
      </div>-->
    </RecycleScroller>
    <!--<div class="grid-scroll-container">
      <div class="grid-row" :key="'gridRow-' + rowIndex" v-for="(chunk, rowIndex) in chunkedItems">
        <div class="grid-item" :key="'gridItem-' + columnIndex" v-for="(item, columnIndex) in chunk" tabindex="0" @click="onItemClicked(item, rowIndex, columnIndex)" @keyup.enter="onItemClicked(item, rowIndex, columnIndex)" @focus="onItemFocused(item, rowIndex * size + columnIndex)">
          <img :src="fullSrc(item.poster)" alt="">
          <div class="vertically-centered"><p>{{ item.name }}</p></div>
        </div>
        <template v-if="chunk.length < size">
          <div class="grid-item-dummy" :key="index" v-for="index in size - chunk.length"></div>
        </template>
      </div>
    </div>-->
  </div>
</template>

<script>
export default {

  name: 'GridList',

  props: {
    items: Array,
    size: Number,
    itemSize: Number,
    header: String,
    emitOnFocus: Boolean
  },

  data () {
    return {
      focusedItemIndex: 0
    }
  },

  computed: {
    chunkedItems () {
      var result = []
      var len = Math.ceil(this.items.length / this.size)

      for (var x = 0; x < len; x++) {
        var start = x * this.size
        var end = start + this.size

        result.push({
          id: 'scroller-' + x,
          items: this.items.slice(start, end)
        })
      }
      
      return result
    }
  },

  methods: {
    fullSrc (src) {
      return 'http://192.168.2.88:8001' + src
    },
    onItemClicked (item, itemRowIndex, itemColumnIndex) {
      this.$emit('itemClicked', item, itemRowIndex, itemColumnIndex, 'grid')
    },
    onItemFocused (focusedItem, focusedItemIndex) {
      this.focusedItemIndex = focusedItemIndex
      if (this.emitOnFocus !== false) {
        this.$root.$emit('itemFocused', focusedItem)
      }
    }
  }
}
</script>

<style lang="css">
</style>