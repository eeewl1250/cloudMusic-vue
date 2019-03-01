import axios from 'axios'
import base from './base'

const comment = {
  getComment (userId) {
    return axios.get(`${base.api}/user/comment/${userId}`)
  }
}

export default comment
