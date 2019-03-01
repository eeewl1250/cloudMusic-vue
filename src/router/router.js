import Vue from 'vue'
import VueRouter from 'vue-router'

import User from '@/views/User'
import UserPlaylist from '@/views/UserPlaylist'
import UserStatusUpdates from '@/views/UserStatusUpdates'
import UserAboutMe from '@/views/UserAboutMe'
import Playlist from '@/views/Playlist'
import Song from '@/views/Song'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/user'
  },
  {
    path: '/user',
    component: User,
    meta: {
      keepAlive: true
    },
    children: [
      {
        path: '',
        redirect: '/user/playlist'
      },
      {
        path: 'playlist',
        component: UserPlaylist,
        meta: {
          keepAlive: true
        }
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
    component: Playlist,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/song',
    component: Song,
    name: 'song'
  }
]

export default new VueRouter({
  routes,
  linkActiveClass: 'active'
})