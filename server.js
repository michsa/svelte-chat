let express = require('express')
let path = require('path')
let app = express()
let http = require('http').createServer(app)
let io = require('socket.io')(http)
let Datastore = require('nedb')
let db = new Datastore()
let port = require('./config').port

console.log('server port', port)

if (process.env.NODE_ENV === 'production')
  app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', socket => {
  db.find({}).sort({ createdAt: 1 }).exec((err, docs) => {
    console.log(docs)
    io.emit('load messages', docs)
  })
  console.log('a user connected')
  socket.on('send message', (message, cb) => {
    let messageData = { message, createdAt: new Date(), createdBy: 'me' }
    console.log(`message: ${message}`)
    db.insert(messageData, (err, newDoc) => {
      console.log('new message:', newDoc)
      io.emit('receive message', newDoc)
    })
  })
  socket.on('disconnect', () => {
    console.log('a user disconnected')
  })
})

http.listen(port, () => {
  console.log(`App started and available at http://localhost:${port}`)
})
