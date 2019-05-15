import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faPlay, faHistory, faPause } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'intersection-observer'

library.add(faSearch, faPlay, faHistory, faPause)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueVirtualScroller)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
