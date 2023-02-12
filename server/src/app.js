const path = require('path')
const Koa = require('koa')
const cors = require('@koa/cors')
const { koaBody } = require('koa-body')

const addRoutes = require('./router/index')

const app = new Koa()
// 跨域
app.use(cors())

app.use(koaBody({
    multipart: true,
    // formidable: {
    //     // uploadDir: path.resolve(__dirname, '../public/uploads/'),
    //     keepExtensions: true,
    //     maxFieldsSize: 2 * 1024 * 1024
    // }
}))

// 路由注册
app.addRoutes = addRoutes
app.addRoutes()

module.exports = app