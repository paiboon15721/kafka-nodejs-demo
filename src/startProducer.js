require('dotenv').config()
const Koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const m = require('./middlewares')
const producerRouter = require('./producer/routers')

const producerApp = new Koa()

producerApp.use(m.hbs)
producerApp.use(logger())
producerApp.use(bodyParser())
producerApp.use(m.formatOutput)
producerApp.use(producerRouter.routes())

const { PRODUCER_API_PORT } = process.env

producerApp.listen(PRODUCER_API_PORT)
console.log(`PRODUCER listening on port ${PRODUCER_API_PORT}`)
