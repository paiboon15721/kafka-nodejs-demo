require('dotenv').config()
const Koa = require('koa')
const http = require('http')
const socket = require('socket.io')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const m = require('./middlewares')
const consumerRouter = require('./consumer/routers')
const consumerSocket = require('./consumer/socket')

const consumerApp = new Koa()

consumerApp.use(m.hbs)
consumerApp.use(logger())
consumerApp.use(bodyParser())
consumerApp.use(m.formatOutput)
consumerApp.use(consumerRouter.routes())
const consumerServer = http.createServer(consumerApp.callback())
const io = socket(consumerServer)
consumerSocket(io)

const { CONSUMER_API_PORT } = process.env
consumerServer.listen(CONSUMER_API_PORT)
console.log(`CONSUMER listening on port ${CONSUMER_API_PORT}`)
