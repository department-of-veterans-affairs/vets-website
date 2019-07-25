const cheerio = require("cheerio")

// TODO consider adding script tags and stylesheet links
const SELECTOR = "a, img"

module.exports = (html) => {
  const results = []

  const $ = cheerio.load(html)

  $(SELECTOR).each((index, element) => {
    const $link = $(element)

    if ($link.is("a")) {
      const isAnchor = ($link.attr("name") || $link.attr("id")) && ($link.attr("href") == null)

      if (isAnchor) {
        const nameOrId = $link.attr("name") || $link.attr("id")

        results.push({
          type: "anchor",
          description: `Anchor tag with name/id: "${nameOrId}", text: "${$link.text()}"`,
        })
      } else {
        results.push({
          target: $link.attr("href"),
          type: isAnchor ? "anchor" : "link",
          description: `href: "${$link.attr("href")}", text: "${$link.text()}"`,
        })
      }

    } else if ($link.is("img")) {
      results.push({
        target: $link.attr("src"),
        type: "image",
        description: `href: "${$link.attr("src")}", text: "${$link.attr("alt")}"`,
      })
    }
  })

  return results
}
