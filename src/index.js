require('dotenv').config()
const Koa = require('koa')
const http = require('http')
const socket = require('socket.io')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const m = require('./middlewares')
const consumerRouter = require('./consumer/routers')
const consumerSocket = require('./consumer/socket')
const producerRouter = require('./producer/routers')

const consumerApp = new Koa()

const producerApp = new Koa()

const setupMiddlewares = app => {
  app.use(m.hbs)
  app.use(logger())
  app.use(bodyParser())
  app.use(m.formatOutput)
}

setupMiddlewares(consumerApp)
setupMiddlewares(producerApp)

consumerApp.use(consumerRouter.routes())
const consumerServer = http.createServer(consumerApp.callback())
const io = socket(consumerServer)
consumerSocket(io)

producerApp.use(producerRouter.routes())

const { CONSUMER_API_PORT, PRODUCER_API_PORT } = process.env

consumerServer.listen(CONSUMER_API_PORT)
producerApp.listen(PRODUCER_API_PORT)
console.log(`CONSUMER listening on port ${CONSUMER_API_PORT}`)
console.log(`PRODUCER listening on port ${PRODUCER_API_PORT}`)
