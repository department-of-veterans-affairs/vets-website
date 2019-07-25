const {map, assoc} = require("ramda")

module.exports = (links, filename) => {
  return map(assoc("filename", filename), links)
}
