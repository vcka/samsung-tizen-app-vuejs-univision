<template>
  <div id="description" :class="{category: focusedItem.type == 'category'}">
    <div class="left">
      <div :key="focusedItem.uid">
        <h1>{{ focusedItem.name }}</h1>
        <div class="meta">
          <h2>{{ focusedItem.year }}</h2>
          <font-awesome-icon icon="spinner" size="lg" spin color="#FFFFFF" v-show="moviedbFetching"/>
          <span v-show="movieRating > 0">
            <font-awesome-icon icon="star" size="lg" color="#F9DF06"/>
            <p>{{ movieRating }}/10</p>
          </span>
          <h2 class="genre">{{ movieGenreString }}</h2>
        </div>
        <p class="syno">{{ focusedItem.description }}</p>
      </div>
    </div>
    <div class="right" :class="{noImage: moviedbNoBackdrop}" :style="{backgroundImage: backgroundImage}">
      <div class="lds-ellipsis" :style="{visibility: backgroundDownloading || moviedbFetching ? 'visible' : 'hidden'}"><div></div><div></div><div></div><div></div></div>
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
      backgroundUrl: '',
      backgroundDownloading: false,
      moviedbFetching: false,
      moviedbNoBackdrop: false,
      movieRating: 0,
      movieGenreString: ''
    }
  },

  computed: {
    backgroundImage () {
      return this.backgroundPrefix + (this.backgroundUrl == '' ? '' : ', ' + this.backgroundUrl)
    },
    focusedItem () {
      return this.$store.getters.focusedItem
    }
  },

  watch: {
    focusedItem: function (focusedItem) {
      clearTimeout(this.timeout)
      this.backgroundUrl = ''
      this.backgroundDownloading = false
      this.moviedbFetching = false
      this.moviedbNoBackdrop = false
      this.movieRating = 0
      this.movieGenreString = ''
      this.timeout = setTimeout(() => {
        this.moviedbFetching = true
        fetch("https://api.themoviedb.org/3/search/movie?api_key=d2a129234a7199d7e4edea0023bb7c0d&language=en-US&query=" + focusedItem.name + "&page=1&include_adult=false&year=" + focusedItem.year).then(function (response) {
          return response.json()
        }).then((data) => {
          this.moviedbFetching = false
          if (data.results.length == 0) {
            this.backgroundUrl = "url(" + "http://192.168.2.88:8001" + focusedItem.poster + ")"
            this.backgroundDownloading = false
            this.moviedbNoBackdrop = true
            this.movieRating = 0
            this.movieGenreString = ''
            return
          }

          var result = data.results[0]

          var genreNames = []
          for (var i = result.genre_ids.length - 1; i >= 0; i--) {
            if (this.moviedbGenres.hasOwnProperty(result.genre_ids[i])) {
              genreNames.push(this.moviedbGenres[result.genre_ids[i]])
            }
          }
          this.movieGenreString = genreNames.join(', ')
          this.movieRating = result.vote_average || 0

          if (result.backdrop_path != null) {
            console.log('HAS BACK DROP!')
            this.backgroundDownloading = true
            var img = new Image()
            img.onload = () => {
              this.backgroundUrl = "url(" + "https://image.tmdb.org/t/p/w1280" + result.backdrop_path + ")"
              this.backgroundDownloading = false
            }
            img.src = "https://image.tmdb.org/t/p/w1280" + result.backdrop_path
          } else {
            this.backgroundUrl = "url(" + "http://192.168.2.88:8001" + focusedItem.poster + ")"
            this.backgroundDownloading = false
            this.moviedbNoBackdrop = true
          }
        }).catch(() => {
          this.moviedbFetching = false
          this.moviedbNoBackdrop = true
        })
      }, 200)
    }
  },

  created () {
    this.backgroundPrefix = 'linear-gradient(45deg, #f8a261, #6e9fc9), linear-gradient(135deg, #08526b, #fbcd7c)'
    this.moviedbGenres = {}
    fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=d2a129234a7199d7e4edea0023bb7c0d&language=en-US").then(function (response) {
      return response.json()
    }).then((data) => {
      this.moviedbGenres = data.genres.reduce(function (obj, item) {
        obj[item.id] = item.name
        return obj
      }, {})
    })
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

  #description .syno {
    font-size: 28px;
    margin: 0;
    padding: 14px 0;
  }

  #description .meta {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }

  #description .meta > * {
    margin-right: 25px;
  }

  #description .meta p {
    margin-left: 4px;
    font-size: 20px;
    display: inline;
    vertical-align: middle;
  }

  #description .meta .genre {
    flex: 1 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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