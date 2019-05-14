import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import SeriesDialog from '@/views/SeriesDialog.vue'
import SourceDialog from '@/views/SourceDialog.vue'
import Search from '@/views/Search.vue'

Vue.use(Router)

export default new Router({
  mode: 'abstract', // using abstract mode only because "Smart Hub Preview" only worked on root home page ("/") in other modes ("hash", "history")
  routes: [
    {
      path: '/browselist/:id?',
      name: 'browselist',
      component: Home,
      alias: '/',
      props: true,
      children: [
        {
          path: 'series/:seriesId',
          name: 'series',
          component: SeriesDialog,
          props: true,
          children: [
            {
              path: 'episode/:episodeNumber',
              name: 'seriesmovie',
              component: SourceDialog,
              props: true
            }
          ]
        },
        {
          path: 'movie/:movieId',
          name: 'movie',
          component: SourceDialog,
          props: true
        },
        {
          path: 'search',
          name: 'search',
          component: Search,
          children: [
            {
              path: 'movie/:movieId',
              name: 'searchmovie',
              component: SourceDialog,
              props: true
            }
          ]
        }
      ]
    },
    {
      path: '/movie/:movieId',
      name: 'rootmovie',
      component: SourceDialog,
      props: true
    }
  ]
})
