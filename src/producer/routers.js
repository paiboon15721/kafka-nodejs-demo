const Router = require('koa-router')
const { Producer, KafkaClient } = require('kafka-node')

const { TOPIC, KAFKA_HOST } = process.env
const client = new KafkaClient({ kafkaHost: KAFKA_HOST })
const producer = new Producer(client)

producer.on('ready', function() {
  console.log('PRODUCER ready')
})

const send = messages =>
  new Promise((resolve, reject) => {
    producer.send([{ topic: TOPIC, messages }], function(err, result) {
      if (err) {
        return reject(err)
      }
      return resolve(result)
    })
  })

const r = new Router()

r.get('/producer', async ctx => {
  await ctx.render('producer', { page: 'Producer' })
})

r.post('/producer', async ctx => {
  const { body } = ctx.request
  const result = await send(body)
  ctx.body = result
})

module.exports = r
