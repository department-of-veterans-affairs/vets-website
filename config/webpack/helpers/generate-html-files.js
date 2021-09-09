const path = require('path');

const { getScaffoldAssets } = require('../helpers/get-scaffold-assets');

const headerFooterData = require('../../../src/platform/landing-pages/header-footer-data.json');
const scaffoldRegistry = require('../../../src/applications/registry.scaffold.json');
const facilitySidebar = require('../../../src/platform/landing-pages/facility-sidebar.json');

const HtmlPlugin = require('html-webpack-plugin');

async function generateHtmlFiles(buildPath) {
  const scaffoldAssets = await getScaffoldAssets();
  const appRegistry = JSON.parse(scaffoldAssets['registry.json']);
  const loadInlineScript = filename => scaffoldAssets[filename];

  // Modifies the style tags output from HTML Webpack Plugin
  // to match the order and attributes of style tags from real content.
  const modifyStyleTags = pluginStyleTags =>
    pluginStyleTags
      .reduce(
        (tags, tag) =>
          // Puts style.css before the app-specific stylesheet.
          tag.attributes.href.match(/style/) ? [tag, ...tags] : [...tags, tag],
        [],
      )
      .join('');

  // Modifies the script tags output from HTML Webpack Plugin
  // to match the order and attributes of script tags from real content.
  const modifyScriptTags = pluginScriptTags =>
    pluginScriptTags
      .reduce((tags, tag) => {
        // Exclude style.entry.js, which gets included with the style chunk.
        if (tag.attributes.src.match(/style/)) return tags;

        // Force polyfills.entry.js to be first (and set `nomodules`), since
        // vendor.entry.js gets put first even with chunksSortMode: 'manual'.
        return tag.attributes.src.match(/polyfills/)
          ? [
              { ...tag, attributes: { ...tag.attributes, nomodule: true } },
              ...tags,
            ]
          : [...tags, tag];
      }, [])
      .join('');

  /* eslint-disable no-nested-ternary */
  const generateHtmlFile = ({
    appName,
    entryName = 'static-pages',
    rootUrl,
    template = {},
    widgetType,
    widgetTemplate,
  }) =>
    new HtmlPlugin({
      chunks: ['polyfills', 'web-components', 'vendor', 'style', entryName],
      filename: path.join(buildPath, rootUrl, 'index.html'),
      inject: false,
      scriptLoading: 'defer',
      template: 'src/platform/landing-pages/dev-template.ejs',
      templateParameters: {
        // Menu and navigation content
        headerFooterData,
        facilitySidebar,

        // Helper functions
        loadInlineScript,
        modifyScriptTags,
        modifyStyleTags,

        // Default template metadata.
        breadcrumbs_override: [], // eslint-disable-line camelcase
        includeBreadcrumbs: false,
        loadingMessage: 'Please wait while we load the application for you.',

        // App-specific config
        entryName,
        widgetType,
        widgetTemplate,
        rootUrl,
        ...template, // Unpack any template metadata from the registry entry.
      },
      title:
        typeof template !== 'undefined' && template.title
          ? `${template.title} | Veterans Affairs`
          : typeof appName !== 'undefined'
            ? appName
              ? `${appName} | Veterans Affairs`
              : null
            : 'VA.gov Home | Veterans Affairs',
    });
  /* eslint-enable no-nested-ternary */

  return [...appRegistry, ...scaffoldRegistry]
    .filter(({ rootUrl }) => rootUrl)
    .map(generateHtmlFile);
}

module.exports.generateHtmlFiles = generateHtmlFiles;
