<template>
  <div id="app">
    <div id="logtest"></div>
    <object id="av-player" type="application/avplayer"></object>
    <router-view/>
  </div>
</template>

<script>
export default {

  name: 'App',

  data () {
    return {
    }
  },

  methods: {
    focusNextItem () {
      document.getElementById("logtest").innerHTML = event.keyCode
      // Using "\" key as a back button for debugging (since we're using vue-router abstract mode)
      if (event.keyCode == 220) {
        this.$router.go(-1)
        return
      }
      if (event.keyCode == 10009) {
        if (this.$route.name == 'browselist' && this.$route.path == '/') {
          var choice = confirm('Are you sure you want to exit?')
          if (choice == true) {
            try {
              tizen.application.getCurrentApplication().exit()
            } catch {
              console.log('Tizen app exit failed')
            }
          }
        } else {
          this.$router.go(-1)
        }
        return
      }
      if (this.scrolling) {
        return
      }
      var vm = this
      var activeElement = document.activeElement

      // Browse handling
      if (activeElement.classList.contains('item')) {
        if (event.keyCode == 40 || event.keyCode == 38) {
          event.preventDefault()
          vm.scrolling = true
          this.rowList = document.getElementById('rowlist')
          var currentRow = activeElement.closest('.row')
          var nextRow = (event.keyCode == 40) ? currentRow.nextElementSibling : currentRow.previousElementSibling
          if (nextRow) {
            this.rowList.scrollTop = this.rowList.scrollTop - this.rowList.offsetTop + nextRow.getBoundingClientRect().top
            vm.scrolling = false
            nextRow.lastChild.firstElementChild.querySelector('.item.lastFocused').focus()
          } else {
            vm.scrolling = false
            if (event.keyCode == 38) {
              document.getElementsByClassName('search')[0].focus()
            }
          }
        } else if (event.keyCode == 39 || event.keyCode == 37) {
          event.preventDefault()
          //vm.scrolling = true
          this.scroller = activeElement.closest('.vue-recycle-scroller')
          var itemWidth = this.scroller.classList.contains('category') ? this.itemWidthCategory : this.itemWidthNormal
          this.activeElementTransformNum = parseInt(activeElement.parentNode.style.transform.split("(")[1].split("px")[0])
          if (event.keyCode == 39) {
            if (this.activeElementTransformNum == this.scroller.scrollWidth - itemWidth - this.scrollerPaddingLeft) return

            this.scroller.scrollLeft += itemWidth

            this.nextItem = null
            this.maxWhile = activeElement.parentNode.parentNode.children.length
            while (this.maxWhile > 0) {
              this.nextItem = this.nextItem || activeElement.parentNode
              this.nextItem = this.nextItem.nextElementSibling || this.nextItem.parentNode.firstElementChild

              this.nextItemTransformNum = parseInt(this.nextItem.style.transform.split("(")[1].split("px")[0])

              if (this.nextItemTransformNum == this.activeElementTransformNum + itemWidth) {
                if (this.nextItemTransformNum >= 0) {
                  this.nextItem.firstChild.focus()
                }
                break
              }
              this.maxWhile--
            }
          } else {
            if (this.activeElementTransformNum == 0) return

            this.found = false
            this.nextItem = null
            this.maxWhile = activeElement.parentNode.parentNode.children.length
            while (this.maxWhile > 0) {
              this.nextItem = this.nextItem || activeElement.parentNode
              this.nextItem = this.nextItem.previousElementSibling || this.nextItem.parentNode.lastChild

              this.nextItemTransformNum = parseInt(this.nextItem.style.transform.split("(")[1].split("px")[0])

              if (this.nextItemTransformNum == this.activeElementTransformNum - itemWidth) {
                if (this.nextItemTransformNum >= 0) {
                  this.found = true
                }
                break
              }
              this.maxWhile--
            }

            if (this.found) {
              var itemsPerRow = this.scroller.classList.contains('category') ? this.itemsPerRowCategory : this.itemsPerRowNormal
              var totalItems = (this.scroller.scrollWidth - this.scrollerPaddingLeft) / itemWidth
              if (totalItems - itemsPerRow > this.nextItem.firstChild.dataset.index) {
                this.scroller.scrollLeft -= itemWidth - activeElement.parentNode.getBoundingClientRect().left + this.scrollerPaddingLeft
              }
              this.nextItem.firstChild.focus()
            }
          }
        }
      }

      // Search screen handling
      if (activeElement.classList.contains('grid-item')) {
        if (event.keyCode == 40 || event.keyCode == 38) {
          event.preventDefault()
          this.scroller = activeElement.closest('.vue-recycle-scroller')
          this.activeElementTransformNum = parseInt(activeElement.parentNode.style.transform.split("(")[1].split("px")[0])
          var onSearchScreen = this.scroller.parentNode.parentNode.id == 'search-screen'
          var itemHeight = onSearchScreen ? 405 : 315
          if (event.keyCode == 40) {
            console.log('ya')
            if (this.activeElementTransformNum == this.scroller.scrollHeight - itemHeight - 60) return
            console.log('scroll!')
            this.scroller.scrollTop += itemHeight

            this.nextItem = null
            this.maxWhile = activeElement.parentNode.parentNode.children.length
            while (this.maxWhile > 0) {
              this.nextItem = this.nextItem || activeElement.parentNode
              this.nextItem = this.nextItem.nextElementSibling || this.nextItem.parentNode.firstElementChild

              this.nextItemTransformNum = parseInt(this.nextItem.style.transform.split("(")[1].split("px")[0])

              if (this.nextItemTransformNum == this.activeElementTransformNum + itemHeight) {
                if (this.nextItemTransformNum >= 0) {
                  var nextItemGridItems = this.nextItem.querySelectorAll('.grid-item')
                  var index = activeElement.dataset.index
                  nextItemGridItems[index >= nextItemGridItems.length ? nextItemGridItems.length - 1 : index].focus()
                }
                break
              }
              this.maxWhile--
            }
          } else {
            if (this.activeElementTransformNum == 0) {
              if (onSearchScreen) {
                document.getElementById('searchInput').focus()
              } else {
                document.getElementsByClassName('search')[0].focus()
              }
              return
            }

            this.found = false
            this.nextItem = null
            this.maxWhile = activeElement.parentNode.parentNode.children.length
            while (this.maxWhile > 0) {
              this.nextItem = this.nextItem || activeElement.parentNode
              this.nextItem = this.nextItem.previousElementSibling || this.nextItem.parentNode.lastChild

              this.nextItemTransformNum = parseInt(this.nextItem.style.transform.split("(")[1].split("px")[0])

              if (this.nextItemTransformNum == this.activeElementTransformNum - itemHeight) {
                if (this.nextItemTransformNum >= 0) {
                  this.found = true
                }
                break
              }
              this.maxWhile--
            }

            if (this.found) {
              this.scroller.scrollTop = this.scroller.scrollTop - this.scroller.offsetTop + this.nextItem.getBoundingClientRect().top - 15
              this.nextItem.children[activeElement.dataset.index].focus()
            }
          }
        } else if (event.keyCode == 39 || event.keyCode == 37) {
          event.preventDefault()
          this.nextItem = event.keyCode == 39 ? activeElement.nextElementSibling : activeElement.previousElementSibling
          if (this.nextItem && this.nextItem.classList.contains('grid-item')) {
            this.nextItem.focus()
          }
        }
      }

      // Other handling
      if (activeElement.classList.contains('button') && (event.keyCode == 40 || event.keyCode == 38)) {
        event.preventDefault()
        var nextButton = (event.keyCode == 40) ? activeElement.nextElementSibling : activeElement.previousElementSibling
        if (nextButton) {
          nextButton.focus()
        }
      }
      if (activeElement.classList.contains('search') && event.keyCode == 40) {
        event.preventDefault()
        // fastest method to find by data atrribute
        this.rowList = document.getElementById('rowlist')
        if (this.rowList.firstElementChild.classList.contains('singleCatGrid')) {
          this.rowList.querySelector('.grid-item.lastFocused').focus()
        } else {
          this.rowList.querySelector('.item.lastFocused').focus()
        }
      }
      if (activeElement.classList.contains('searchInput') && event.keyCode == 40) {
        event.preventDefault()
        document.querySelector('#search-screen .grid-item.lastFocused').focus()
      }
    },
    deepLink () {
      console.log('deepLink')
      if (this.$route.name != 'browselist') return
      var requestedAppControl = tizen.application.getCurrentApplication().getRequestedAppControl()
      if (requestedAppControl) {
        var appControlData = requestedAppControl.appControl.data

        for (var i = appControlData.length - 1; i >= 0; i--) {
          if (appControlData[i].key == 'PAYLOAD') {
            var actionData = JSON.parse(appControlData[i].value[0]).values
            actionData = JSON.parse(actionData)
            this.$router.push({
              name: 'movie',
              params: {
                movieId: actionData.uid,
                item: actionData
              }
            })
          }
        }
      }
    }
  },

  mounted () {
    document.addEventListener("keydown", this.focusNextItem)
    window.addEventListener('appcontrol', this.deepLink)
    this.$router.push('/')
  },

  created () {
    this.maxWhile = 0
    this.nextItemTransformNum = 0
    this.nextItem = null
    this.rowList = null
    this.activeElementTransformNum = null
    this.scroller = null
    this.found = null
    this.itemWidthCategory = 373
    this.itemWidthNormal = 224
    this.itemsPerRowCategory = 5
    this.itemsPerRowNormal = 8
    this.scrollerPaddingLeft = 60
  }
}
</script>

<style>

html, body, #app {
  height: 100%;
  min-height: 100%;
  margin: 0;
  color: #D7D7D7;
  overflow-y: hidden;
}

* {
  font-family: Ubuntu, Helvetica, Arial, sans-serif;
  font-weight: 400;
  box-sizing: border-box;
}

h1 {
  font-weight: 700;
  font-size: 46px;
}

h1, h2, h3, h4 {
  color: #ffffff;
  margin: 0;
}

#app {
  background: #000000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.focus { background-color: yellow;}

.modal {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, .8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
.content {
  width: 1000px;
  max-height: 940px;
  background: #333333;
  align-items: center;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
}
.buttons {
  margin: 0;
  padding: 0;
  margin-top: 20px;
  overflow-y: hidden;
  width: 100%;
  position: relative;
}
.buttons .more {
  display: inline-block;
  position: absolute;
  bottom: 15px;
  animation: bounce 2s infinite;
}
.buttons .more i {
  display: inline-block;
  border: solid #3ffda5;
  border-width: 0 3px 3px 0;
  padding: 12px;
  transform: rotate(45deg);
}
.button {
  padding: 14px 20px;
  margin: 5px 0;
  font-size: 20px;
  border-radius: 4px;
  background: #7d7d7d;
  color: #000000;
  text-align: left;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 24px;
  outline: none;
}
.button span {
  font-weight: normal;
}
.button:focus {
  background: #ececec;
}
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) scale(1);
  }
  40% {
    transform: translateY(-30px) scale(0.65);
  }
  60% {
    transform: translateY(-15px) scale(1);
  }
}
.modal .lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-ellipsis div {
  position: absolute;
  top: 17px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 12px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 12px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 52px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 90px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(38px, 0);
  }
}

#av-player {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  width: 1920px;
  height: 1080px;
  z-index: 10;
}
#logtest {
  position: absolute;
  color: red;
  z-index: 100;
}

@font-face {
  font-family: Ubuntu;
  font-style: normal;
  font-weight: 400;
  src: url('assets/Ubuntu-Regular.ttf');
}

@font-face {
  font-family: Ubuntu;
  font-style: normal;
  font-weight: 700;
  src: url('assets/Ubuntu-Bold.ttf');
}

@font-face {
  font-family: Lobster;
  font-style: normal;
  font-weight: 400;
  src: url('assets/Lobster-Regular.ttf');
}
</style>
