const {assoc, filter, mapObjIndexed, map, values, flatten, pipe} = require("ramda")
const addFilenameToLinks = require("./add-filename-to-links")
const getFileContents = require("./get-file-contents")
const pickHtmlFiles = require("./pick-html-files")
const shouldCheckLink = require("./should-check-link")
const handleLinks = require("./handle-links")
const isLinkBroken = require("./is-link-broken")
const extractLinks = require("./extract-links")
const extractAnchorTargets = require("./extract-anchor-targets")
const path = require("path")

function fileExists(files, filename) {
  // Remove leading slash before checking to match the Metalsmith files format
  if (filename.charAt(0) === "/") {
    filename = filename.slice(1)
  }

  // True if it exists in the files object
  if (filename in files) {
    return true
  }

  // Fallback for Windows paths
  const winPath = filename.split("/").join(path.sep)
  return winPath in files
}

function fileHasTarget(filesToTargets, filename, target) {
  // Remove leading slash before checking to match the Metalsmith files format
  if (filename.charAt(0) === "/") {
    filename = filename.slice(1)
  }

  if (!(filename in filesToTargets)) {
    filename = filename.split("/").join(path.sep)
  }

  // If we request no fragment, then it's available.
  if (!target) {
    return true
  }

  return filesToTargets[filename] && filesToTargets[filename].indexOf(target) >= 0
}

module.exports = (options) => {

  if (options == null) { options = {} }
  if (options === true) { options = {} } // Allow CLI to specify true
  if (options.warn == null) { options.warn = false }
  if (options.checkLinks == null) { options.checkLinks = true }
  if (options.checkImages == null) { options.checkImages = true }
  if (options.checkAnchors == null) { options.checkAnchors = false }
  if (options.allowRegex == null) { options.allowRegex = null }
  if (options.allowAnchors == null) { options.allowAnchors = true }
  if (options.baseURL == null) { options.baseURL = null }

  return (files) => {
    const normalized = files

    // Skip calculations if not needed
    let filesToTargets = null
    if (options.checkAnchors) {
      filesToTargets = pipe(
        pickHtmlFiles,
        map(getFileContents),
        map(extractAnchorTargets)
      )(normalized)
    }

    pipe(
      pickHtmlFiles,
      map(getFileContents),
      map(extractLinks),
      mapObjIndexed(addFilenameToLinks),
      values,
      flatten,
      filter(shouldCheckLink(options)),
      map(addBrokenStatus(files, filesToTargets, fileExists, fileHasTarget, options)),
      handleLinks(options)
    )(normalized)
  }
}

function addBrokenStatus(files, filesToTargets, fileExists, fileHasTarget, options) {
  return (link) => {
    const broken = isLinkBroken({
      files,
      filesToTargets,
      fileExists,
      fileHasTarget,
      link,
      options,
    })

    return assoc("broken", broken, link)
  }
}
