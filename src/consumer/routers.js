const Router = require('koa-router')

const r = new Router()

r.get('/consumer', async ctx => {
  await ctx.render('consumer', { page: 'Consumer' })
})

module.exports = r
