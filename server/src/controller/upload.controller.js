const fse = require('fs-extra')
const path = require('path')
const { UPLOAD_DIR } = require('../constants')

// 合并切片
async function mergeFileChunk(filepath, filename, size) {
    const chunkDir = path.resolve(UPLOAD_DIR, `${filename}-chunks`)
    let chunkPaths = await fse.readdir(chunkDir)
    chunkPaths.sort((a, b) => a.split('-')[1] - b.split('-')[1])

    const arr = chunkPaths.map((chunkPath, index) => {
        return pipeStream(
            path.resolve(chunkDir, chunkPath),
            // 在指定位置创建可写流
            fse.createWriteStream(filepath, {
                start: index * size,
                end: (index + 1) * size
            })
        )
    })
    // 保证该文件对应的所有切片都被读取到了
    await Promise.all(arr)
}

// 将切片转为流后，再合并
function pipeStream(path, writeStream) {
    return new Promise((resolve) => {
        const readStream = fse.createReadStream(path)
        readStream.on('end', () => {
            // 读取完毕后，删除已经读取过的切片路径
            fse.unlinkSync(path)
            resolve()
        })
        // 读取完所有切片后，将可读流通过pipe流入可写流
        readStream.pipe(writeStream)
    })
}

class UploadController {
    async sliceHandler(ctx, next) {
        console.log('slice handler')
        const file = ctx.request.files.file
        const { fileName, chunkName } = ctx.request.body

        // 创建存放切片的文件夹
        const chunkDir = path.resolve(UPLOAD_DIR, `${fileName}-chunks`)
        if (!fse.existsSync(chunkDir)) {
            await fse.mkdirs(chunkDir)
        }

        // 将切片移动到chunkDir
        await fse.move(file.filepath, `${chunkDir}/${chunkName}`)
        
        ctx.body = {
            code: 200,
            message: '切片上传成功'
        }
    }

    async mergeHandler(ctx, next) {
        console.log('merge handler')
        const { size, filename } = ctx.request.body
        // 找到文件对应切片的路径
        const filepath = path.resolve(UPLOAD_DIR, filename)

        await mergeFileChunk(filepath, filename, size)

        ctx.body = {
            code: 200,
            message: '切片合并成功'
        }
    }
}

module.exports = new UploadController()