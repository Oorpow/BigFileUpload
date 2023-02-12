const Router = require('@koa/router')

const { sliceHandler, mergeHandler } = require('../controller/upload.controller')

const router = new Router()

// 处理切片
router.post('/upload', sliceHandler)
router.post('/merge', mergeHandler)

module.exports = router