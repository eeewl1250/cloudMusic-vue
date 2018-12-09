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
  artist: appData.artists,
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
      // 获取图片
      app.get('/api/images/:pic', (req, res) => {
        res.sendFile(path.resolve(__dirname) + '/mockData/' + req.params.pic)
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
      // 根据用户ID，获取其播放列表
      app.get('/api/user/playlist/:userid', (req, res) => {
        let userId = req.params.userid
        let creation = []
        data.playlist.forEach(list => {
          if (list.user.id === userId) {
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
                username: data.user.find(user => user.id === listDetail.user.id).username,
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
      // 根据歌单ID，获取歌单与创建用户信息
      app.get('/api/playlist/:listid', (req, res) => {
        let listId = req.params.listid
        let listInfo = data.playlist.find(item => item.id === listId)

        let userInfo = data.user.find(item => item.id === listInfo.user.id)
        listInfo.user = {
          id: userInfo.id,
          username: userInfo.username,
          avatar: userInfo.avatar
        }

        let songInfo = []
        for (let songId of listInfo.songs) {
          let songFullInfo = data.song.find(item => item.id === songId.id)

          let artistInfo = []
          for (let artistId of songFullInfo.artist) {
            let artFullInfo = data.artist.find(item => item.id === artistId.id)
            artistInfo.push({
              id: artFullInfo.id,
              name: artFullInfo.name
            })
          }

          let albumInfo = {
            id: songFullInfo.album.id,
            name: data.album.find(item => item.id === songFullInfo.album.id).name
          }

          songInfo.push({
            id: songFullInfo.id,
            name: songFullInfo.name,
            artist: artistInfo,
            album: albumInfo
          })
        }
        listInfo.songs = songInfo

        res.json({
          err_no: 0,
          data: listInfo
        })
      })
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
    },
    port: '8090'
  }
}