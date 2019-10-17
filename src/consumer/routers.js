const Router = require('koa-router')
const { Consumer, KafkaClient } = require('kafka-node')

const { TOPIC, KAFKA_HOST } = process.env
const client = new KafkaClient({ kafkaHost: KAFKA_HOST })
const consumer = new Consumer(client, [{ topic: TOPIC }])

consumer.on('message', function(message) {
  console.log(message)
})

const r = new Router()

r.get('/consumer', async ctx => {
  await ctx.render('consumer', { page: 'Consumer' })
})

module.exports = r
