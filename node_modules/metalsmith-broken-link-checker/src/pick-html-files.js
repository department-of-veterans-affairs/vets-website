const {pickBy} = require("ramda")

function isHtml(file, filename) {
  return /\.html$/.test(filename)
}

module.exports = (files) => {
  return pickBy(isHtml, files)
}
