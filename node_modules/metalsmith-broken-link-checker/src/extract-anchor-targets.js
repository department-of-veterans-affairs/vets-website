const cheerio = require("cheerio")

const SELECTOR = "[id], [name]"

module.exports = (html) => {
  const results = []

  const $ = cheerio.load(html)

  $(SELECTOR).each((index, element) => {
    const $target = $(element)
    const nameOrId = $target.attr("id") || $target.attr("name")

    if (nameOrId) {
      results.push(nameOrId)
    }
  })

  return results
}
