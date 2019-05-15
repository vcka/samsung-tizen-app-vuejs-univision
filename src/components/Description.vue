<template>
  <div id="description" :class="{category: focusedItem.type == 'category'}">
    <div class="left">
      <div :key="focusedItem.uid">
        <h1>{{ focusedItem.name }}</h1>
        <h2>{{ focusedItem.year }}</h2>
        <p>{{ focusedItem.description }}</p>
      </div>
    </div>
    <div class="right" :class="{noImage: noImageFetched}" :style="{backgroundImage: backgroundImage}">
      <div class="lds-ellipsis" :style="{visibility: fetchingImage ? 'visible' : 'hidden'}"><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="hero">
      <h1>{{ focusedItem.name }}</h1>
    </div>
  </div>
</template>

<script>
export default {

  name: 'Description',

  data () {
    return {
      backgroundPrefix: 'linear-gradient(45deg, #f8a261, #6e9fc9), linear-gradient(135deg, #08526b, #fbcd7c)',
      background: '',
      fetchingImage: false,
      noImageFetched: false,
    }
  },

  computed: {
    backgroundImage () {
      return this.backgroundPrefix + (this.background == '' ? '' : ', ' + this.background);
    },
    focusedItem () {
      return this.$store.getters.focusedItem
    }
  },

  watch: {
    focusedItem: function (focusedItem) {
      clearTimeout(this.timeout)
      this.background = ''
      this.fetchingImage = true
      var vm = this
      this.timeout = setTimeout(function () {
        fetch("https://api.themoviedb.org/3/search/movie?api_key=d2a129234a7199d7e4edea0023bb7c0d&language=en-US&query=" + focusedItem.name + "&page=1&include_adult=false&year=" + focusedItem.year).then(function (response) {
          return response.json()
        }).then(function (data) {
          if (data.results.length > 0 && data.results[0].backdrop_path != null) {
            var img = new Image()
            img.onload = function () {
              vm.background = "url(" + "https://image.tmdb.org/t/p/w1280" + data.results[0].backdrop_path + ")"
              vm.fetchingImage = false
            }
            img.src = "https://image.tmdb.org/t/p/w1280" + data.results[0].backdrop_path
            vm.noImageFetched = false
          } else {
            vm.background = "url(" + "http://192.168.2.88:8001" + focusedItem.poster + ")"
            vm.noImageFetched = true
            vm.fetchingImage = false
          }
        }).catch(function () {
          vm.fetchingImage = false
          vm.noImageFetched = true
        })
      }, 200)
    }
  }
}
</script>

<style lang="css">
  #description {
    height: 540px;
    text-align: left;
  }

  #description.category .left,
  #description.category .right {
    display: none;
  }
  #description.category .hero {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #description h2 {
    margin: 0;
    padding-top: 10px;
  }

  #description p {
    font-size: 28px;
    margin: 0;
    padding: 14px 0;
  }

  #description .left {
    display: inline-block;
    padding: 60px 50px 40px 100px;
    width: 700px;
    height: 506px;
    overflow: hidden;
    vertical-align: top;
    will-change: transform, opacity;
  }

  #description .right {
    position: relative;
    display: inline-block;
    width: 1220px;
    height: 570px;
    background-image: linear-gradient(45deg, #f8a261, #6e9fc9), linear-gradient(135deg, #08526b, #fbcd7c);
    background-size: 100% auto;
    background-blend-mode: hard-light;
    box-shadow: 60px -30px 90px 15px #000 inset;
    will-change: transform;
  }
  #description .right.noImage {
    background-size: unset;
  }

  #description .hero {
    display: none;
    height: 540px;
    text-align: center;
    background: url(../assets/background.jpg);
    background-size: 100%;
    box-shadow: 0 -60px 90px 15px #000 inset;
  }

  #description .hero h1 {
    font-size: 95px;
    font-family: 'Lobster';
    font-weight: normal;
    letter-spacing: 1px;
  }

  #description .lds-ellipsis {
    display: inline-block;
    position: absolute;
    width: 64px;
    height: 64px;
    left: 578px;
    top: 253px;
  }


</style>