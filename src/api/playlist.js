import axios from 'axios'
import base from './base'

const playlist = {
  getPlaylist (id) {
    return axios.get(`${base.api}/playlist/${id}`)
  },
  getSongSimpleInfo (idList) {
    return axios.get(`${base.api}/song/simple/${JSON.stringify(idList)}`)
  }
}

export default playlist
