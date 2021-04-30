/* eslint-disable no-param-reassign, no-console, no-continue */

const path = require('path');
const fs = require('fs-extra');

const getBrokenLinks = require('./helpers/getBrokenLinks');
const applyIgnoredRoutes = require('./helpers/applyIgnoredRoutes');

/**
 * Metalsmith middleware for verifying HREF/SRC values in HTML files are valid file references.
 */

module.exports = {
  initialize(buildOptions, files) {
    this.isDisabled = (
      buildOptions.watch || buildOptions.isPreviewServer
    );

    if (this.isDisabled) {
      return;
    }

    const fileNames = Object.keys(files);
    this.allPaths = new Set(fileNames);
    this.brokenPages = [];
    this.logFile = path.join(
      __dirname,
      '../../../../../../../logs',
      `${buildOptions.buildtype}-broken-links.json`,
    );

    if (fs.existsSync(this.logFile)) {
      fs.removeSync(this.logFile);
    }
  },

  modifyFile(fileName, file, files, buildOptions) {
    if (this.isDisabled) {
      return;
    }

    const isHtml = path.extname(fileName) === '.html';
    if (!isHtml) return;

    const linkErrors = getBrokenLinks(file, this.allPaths);

    if (linkErrors.length > 0) {
      this.brokenPages.push({
        path: file.path,
        linkErrors,
      });
    }
  },

  deriveIsHomepageBroken(brokenPages) {
    return brokenPages.some(page => page.path === '/');
  },

  getCountOfBrokenLinks(brokenPages) {
    return brokenPages.reduce((sum, page) => sum + page.linkErrors.length, 0);
  },

  getMarkdownSummary(brokenPages) {
    const markdownMessage = brokenPages.map(page => {
      const brokenLinksForPage = page.linkErrors.map(linkError => {
        return `\`\`\`${linkError.html}\`\`\``;
      });

      return `*\`${page.path}\`* : \n${brokenLinksForPage.join('\n')}`;
    });

    return markdownMessage.join('\n');
  },

  conclude(buildOptions, files) {
    if (this.isDisabled) {
      return;
    }

    const brokenPages = applyIgnoredRoutes(this.brokenPages, files);

    if (brokenPages.length === 0) {
      console.log('No broken links found.');
      return;
    }

    const isHomepageBroken = this.deriveIsHomepageBroken(brokenPages);
    const brokenLinksCount = this.getCountOfBrokenLinks(brokenPages);
    const markdownSummary = this.getMarkdownSummary(brokenPages);

    const brokenLinksJson = {
      summary: markdownSummary,
      isHomepageBroken,
      brokenLinksCount,
    };

    fs.ensureFileSync(this.logFile);
    fs.writeJSONSync(this.logFile, brokenLinksJson);
    console.log(`Broken links found. See results in ${this.logFile}.`);

    if (buildOptions['drupal-fail-fast']) {
      throw new Error(brokenLinksJson);
    }
  },
};
