const fs = require('fs')

const existDir = (dir) => {
    return fs.existsSync(dir)
}

module.exports = existDir