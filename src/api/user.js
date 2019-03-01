import axios from 'axios'
import base from './base'

const user = {
  getUser (id) {
    return axios.get(`${base.api}/user/${id}`)
  },
  getPlaylist (userId) {
    return axios.get(`${base.api}/user/playlist/${userId}`)
  }
}

export default user
