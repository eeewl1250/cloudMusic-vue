import axios from 'axios'
import base from './base'

const song = {
  getSongById (id) {
    return axios.get(`${base.api}/song/${id}`)
  }
}

export default song
