const { Consumer, KafkaClient } = require('kafka-node')

const { TOPIC, KAFKA_HOST } = process.env
const client = new KafkaClient({ kafkaHost: KAFKA_HOST })
const consumer = new Consumer(client, [{ topic: TOPIC, offset: 0 }], {
  fromOffset: true,
  autoCommit: false,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
})

module.exports = io => {
  io.on('connection', function(socket) {
    console.log('a user connected')
    socket.on('disconnect', function() {
      console.log('user disconnected')
    })
  })
  consumer.on('message', function(message) {
    console.log(message)
    io.emit('booking', message)
  })
}
