// mock data
const express = require('express')
const path = require('path')
const app = express()
let appData = require('./mockData/mockData.json')
let data = {
  user: appData.users,
  song: appData.songs,
  playlist: appData.playlists,
  album: appData.albums,
  comment: appData.comments
}
const apiRouters = express.Router()
app.use('/api', apiRouters)
app.use(express.static('public'))

module.exports = {
  baseUrl: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: true,
  chainWebpack: () => {
  },
  configureWebpack: () => {
  },
  devServer: {
    before (app) {
      // 根据数据项ID，获取该项数据
      app.get('/api/data/:type/:id', (req, res) => {
        let dataType = req.params.type
        let itemId = req.params.id
        if (['user', 'song', 'playlist', 'album', 'comment'].includes(dataType)) {
          res.json({
            err_no: 0,
            data: data[dataType].find((item) => {
              return item.id === itemId
            })
          })
        }
      })
      // 根据用户ID，获取其播放列表
      app.get('/api/playlist/:userid', (req, res) => {
        let userId = req.params.userid
        let creation = []
        data.playlist.forEach(list => {
          if (list.userId === userId) {
            creation.push({
              id: list.id,
              cover: list.cover,
              name: list.name,
              countSong: list.songs.length,
              countPlay: list.countPlay,
              countCollection: list.countCollection
            })
          }
        })
        let collection = []
        data.user.find(user => user.id === userId).list.collection
            .forEach(listId => {
              let listDetail = data.playlist.find(item => item.id === listId.id)
              collection.push({
                id: listDetail.id,
                cover: listDetail.cover,
                username: data.user.find(user => user.id === listDetail.userId).username,
                name: listDetail.name,
                countSong: listDetail.songs.length,
                countPlay: listDetail.countPlay
              })
            })
        res.json({
          err_no: 0,
          data: {
            creation: {
              type: 'creation',
              data: creation
            },
            collection: {
              type: 'collection',
              data: collection
            }
          }
        })
      })
      // 根据用户名，获取用户信息
      app.get('/api/user/:username', (req, res) => {
        res.json({
          err_no: 0,
          data: data.user.find((user) => {
            return user.username === req.params.username
          })
        })
      })
      // 获取图片
      app.get('/api/images/:pic', (req, res) => {
        res.sendFile(path.resolve(__dirname) + '/mockData/' + req.params.pic)
      })
    },
    port: '8090'
  }
}