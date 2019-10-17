require('dotenv').config()
const Koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const m = require('./middlewares')
const consumerRouter = require('./consumer/routers')
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
producerApp.use(producerRouter.routes())

const { CONSUMER_API_PORT, PRODUCER_API_PORT } = process.env

consumerApp.listen(CONSUMER_API_PORT)
producerApp.listen(PRODUCER_API_PORT)
console.log(`CONSUMER listening on port ${CONSUMER_API_PORT}`)
console.log(`PRODUCER listening on port ${PRODUCER_API_PORT}`)
