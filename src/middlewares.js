const Boom = require('boom')
const hbs = require('koa-hbs')

hbs.registerHelper('ifEq', function(arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this)
})

exports.hbs = hbs.middleware({
  viewPath: `${__dirname}/views`,
  partialsPath: `${__dirname}/views/partials`,
  layoutsPath: `${__dirname}/views/layouts`,
  defaultLayout: `${__dirname}/views/layouts/default.hbs`,
})

exports.bodyLogger = async (ctx, next) => {
  console.log('\x1b[36m%s\x1b[0m', '   --- Request ---')
  console.log(ctx.request.body)
  console.log('\x1b[36m%s\x1b[0m', '   --- Request ---')
  await next()
  console.log('\x1b[35m%s\x1b[0m', '\n   --- Response ---')
  console.log(ctx.body)
  console.log('\x1b[35m%s\x1b[0m', '   --- Response ---')
}

exports.formatOutput = async (ctx, next) => {
  try {
    await next()
    const contentType = ctx.response.header['content-type']
    if (
      contentType === 'application/pdf' ||
      contentType === 'text/html; charset=utf-8' ||
      contentType === 'text/html'
    ) {
      return
    }
    if (ctx.status === 404 || ctx.body === undefined) {
      throw Boom.notFound()
    } else if (ctx.status === 204) {
      ctx.status = 200
    }
    ctx.body = {
      statusCode: ctx.status,
      data: typeof ctx.body === 'string' ? { message: ctx.body } : ctx.body,
    }
  } catch (err) {
    if (err.isBoom) {
      ctx.status = err.output.statusCode
      ctx.body = err.output.payload
    } else if (err.isJoi) {
      const badRequest = Boom.badRequest(err)
      ctx.status = badRequest.output.statusCode
      ctx.body = { ...badRequest.output.payload, details: err.details }
    } else if (err.headers && err.headers['WWW-Authenticate']) {
      throw err
    } else {
      const internalServerError = Boom.badImplementation(err)
      ctx.status = internalServerError.output.statusCode
      ctx.body = { ...internalServerError.output.payload, details: err.stack }
    }
  }
}
