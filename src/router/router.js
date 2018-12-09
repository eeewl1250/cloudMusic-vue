import Vue from 'vue'
import VueRouter from 'vue-router'

import User from '@/views/User'
import UserPlaylist from '@/views/UserPlaylist'
import UserStatusUpdates from '@/views/UserStatusUpdates'
import UserAboutMe from '@/views/UserAboutMe'
import Playlist from '@/views/Playlist'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/user'
  },
  {
    path: '/user',
    component: User,
    children: [
      {
        path: '',
        redirect: '/user/playlist'
      },
      {
        path: 'playlist',
        component: UserPlaylist
      },
      {
        path: 'status',
        component: UserStatusUpdates
      },
      {
        path: 'about',
        component: UserAboutMe
      }
    ]
  },
  {
    path: '/playlist',
    component: Playlist
  }
]

export default new VueRouter({
  routes,
  linkActiveClass: 'active'
})