function maybeLog(log, links) {
  links.forEach((link) => {
    if (link.broken) {
      log(`${link.filename} >>> ${link.description}`)
    }
  })
}

function maybeThrow(links) {
  const brokenLinks = links.filter(({broken}) => !!broken)

  if (brokenLinks.length) {
    let message = `You have ${brokenLinks.length} broken links:\n`
    brokenLinks.forEach(({filename, description}) => {
      message += `\n${filename} >>> ${description}`
    })
    throw new Error(message)
  }
}

module.exports = (options, log = console.log) => {
  return (links) => {
    if (options.warn) {
      maybeLog(log, links)
    } else {
      maybeThrow(links)
    }
  }
}
