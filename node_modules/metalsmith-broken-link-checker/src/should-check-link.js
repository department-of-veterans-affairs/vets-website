module.exports = (options) => {
  return (link) => {
    switch (link.type) {
    case "link":
      return !!options.checkLinks
    case "anchor":
      return !options.allowAnchors
    case "image":
      return !!options.checkImages
    default:
      return false
    }
  }
}
