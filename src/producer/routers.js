const Router = require('koa-router')

const r = new Router()

r.get('/producer', async ctx => {
  await ctx.render('producer', { page: 'Producer' })
})

module.exports = r
