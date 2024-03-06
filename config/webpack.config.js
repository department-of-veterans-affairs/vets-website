/* eslint-disable no-console */

require('core-js/stable');
require('regenerator-runtime/runtime');
require('dotenv').config();
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const webpack = require('webpack');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const WebpackBar = require('webpackbar');
const StylelintPlugin = require('stylelint-webpack-plugin');

const headerFooterData = require('../src/platform/landing-pages/header-footer-data.json');
const BUCKETS = require('../src/site/constants/buckets');
const ENVIRONMENTS = require('../src/site/constants/environments');
const scaffoldRegistry = require('../src/applications/registry.scaffold.json');
const facilitySidebar = require('../src/platform/landing-pages/facility-sidebar.json');

const { VAGOVSTAGING, VAGOVPROD, LOCALHOST } = ENVIRONMENTS;

const {
  getAppManifests,
  getWebpackEntryPoints,
} = require('./manifest-helpers');

// TODO: refactor the other approach for creating files without the hash so that we're only doing that in the webpack config: https://github.com/department-of-veterans-affairs/vets-website/blob/a012bad17e5bf024b0ea7326a72ae6a737e349ec/src/site/stages/build/plugins/process-entry-names.js#L35
const vaMedalliaStylesFilename = 'va-medallia-styles';

const generateWebpackDevConfig = require('./webpack.dev.config.js');

const getAbsolutePath = relativePath =>
  path.join(__dirname, '../', relativePath);

const sharedModules = [
  getAbsolutePath('src/platform/polyfills'),
  'react',
  'react-dom',
  'react-redux',
  'redux',
  'redux-thunk',
  '@sentry/browser',
];

const globalEntryFiles = {
  polyfills: getAbsolutePath('src/platform/polyfills/preESModulesPolyfills.js'),
  style: getAbsolutePath('src/platform/site-wide/sass/style.scss'),
  [vaMedalliaStylesFilename]: getAbsolutePath(
    'src/platform/site-wide/sass/va-medallia-style.scss',
  ),
  styleConsolidated: getAbsolutePath(
    'src/applications/proxy-rewrite/sass/style-consolidated.scss',
  ),
  vendor: sharedModules,
  // This is to solve the issue of the vendor file being cached
  'shared-modules': sharedModules,
  'web-components': getAbsolutePath('src/platform/site-wide/wc-loader.js'),
};

function getEntryManifests(entry) {
  const allManifests = getAppManifests();
  let entryManifests = allManifests;
  if (entry) {
    const entryNames = entry.split(',').map(name => name.trim());
    entryManifests = allManifests.filter(manifest =>
      entryNames.includes(manifest.entryName),
    );
  }
  return entryManifests;
}

/**
 * Get a list of all the entry points.
 *
 * @param {String} entry - List of comma-delimited entries to build. Builds all
 *                         entries if no value is passed.
 * @return {Object} - The entry file paths mapped to the entry names
 */
function getEntryPoints(entry) {
  const manifestsToBuild = getEntryManifests(entry);

  return getWebpackEntryPoints(manifestsToBuild);
}

/**
 * Creates a mapping of scaffold asset filenames to file contents.
 * Tries first to read from a local content-build by default and
 * falls back to downloading from a remote content-build.
 *
 * @return {Object} - Map of scaffold asset filenames to file contents.
 */
async function getScaffoldAssets() {
  const LOCAL_CONTENT_BUILD_ROOT = '../content-build';

  const REMOTE_CONTENT_BUILD_ROOT =
    'https://raw.githubusercontent.com/department-of-veterans-affairs/content-build/main';

  const loadAsset = async contentBuildPath => {
    const filename = path.basename(contentBuildPath);
    const localPath = path.join(LOCAL_CONTENT_BUILD_ROOT, contentBuildPath);

    if (fs.existsSync(localPath)) {
      console.log(`Found local asset at ${localPath}.`);
      return [filename, fs.readFileSync(localPath)];
    }

    const fileUrl = new URL(
      path.join(REMOTE_CONTENT_BUILD_ROOT, contentBuildPath),
    );

    console.log(`Downloading asset from ${fileUrl.toString()}.`);
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${fileUrl}.\n\n${response.status}: ${
          response.statusText
        }`,
      );
    }

    const fileContents = await response.text();
    console.log(`Successfully downloaded ${filename}.`);
    return [filename, fileContents];
  };

  const inlineScripts = ['record-event.js', 'static-page-widgets.js'].map(
    filename => path.join('src/site/assets/js', filename),
  );

  const appRegistry = path.join('src/applications', 'registry.json');

  const loadedAssets = await Promise.all(
    [...inlineScripts, appRegistry].map(loadAsset),
  );

  return Object.fromEntries(loadedAssets);
}

/**
 * Generates HTML files for each app and widget.
 *
 * @param {String} buildPath - Path to the overall build destination.
 * @param {Object} scaffoldAssets - Map of scaffold asset filenames to file contents.
 *
 * @return {HtmlWebpackPlugin[]} - Array of HtmlWebpackPlugin instances,
 *   representing the HTML files to generate for each app and widget.
 */
function generateHtmlFiles(buildPath, scaffoldAssets) {
  const appRegistry = JSON.parse(scaffoldAssets['registry.json']);
  const loadInlineScript = filename => scaffoldAssets[filename];

  // Modify the script and style tags output from HTML Webpack Plugin
  // to match the order and attributes of tags from real content.
  const modifyScriptAndStyleTags = originalTags => {
    let scriptTags = [];
    let styleTags = [];

    originalTags.forEach(tag => {
      if (tag.attributes.src?.match(/style/)) {
        // Exclude style.entry.js, which gets included with the style chunk.
      } else if (tag.attributes.src?.match(/polyfills/)) {
        // Force polyfills.entry.js to be first since vendor.entry.js gets
        // put first even with chunksSortMode: 'manual'. Also set nomodule
        // so IE polyfills don't load in newer browsers
        const tagWithNoModule = {
          ...tag,
          attributes: { ...tag.attributes, nomodule: true },
        };
        scriptTags = [tagWithNoModule, ...scriptTags];
      } else if (tag.attributes.href?.match(/style/)) {
        // Put style.css before the app-specific stylesheet
        styleTags = [tag, ...styleTags];
      } else if (tag.attributes.src) {
        scriptTags.push(tag);
      } else if (tag.attributes.href) {
        styleTags.push(tag);
      } else {
        throw new Error('Unexpected tag in <head>:', tag);
      }
    });

    return [...styleTags, ...scriptTags].join('');
  };

  /* eslint-disable no-nested-ternary */
  const generateHtmlFile = ({
    appName,
    entryName = 'static-pages',
    rootUrl,
    template = {},
    widgetType,
    widgetTemplate,
    useLocalStylesAndComponents,
  }) =>
    new HtmlPlugin({
      chunks: [
        'polyfills',
        useLocalStylesAndComponents ? null : 'web-components',
        'vendor',
        useLocalStylesAndComponents ? null : 'style',
        entryName,
      ],
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
        modifyScriptAndStyleTags,

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

module.exports = async (env = {}) => {
  const { buildtype = LOCALHOST } = env;
  const buildOptions = {
    api: '',
    buildtype,
    host: LOCALHOST,
    port: 3001,
    scaffold: false,
    watch: false,
    destination: buildtype,
    ...env,
  };

  const apps = getEntryPoints(buildOptions.entry);
  const entryFiles = { ...apps, ...globalEntryFiles };
  const isOptimizedBuild = [VAGOVSTAGING, VAGOVPROD].includes(buildtype);
  const scaffoldAssets = await getScaffoldAssets();
  const appRegistry = JSON.parse(scaffoldAssets['registry.json']);
  const envBucketUrl = BUCKETS[buildtype];
  const sourceMapSlug = envBucketUrl || '';

  const buildPath = path.resolve(
    __dirname,
    '../',
    'build',
    buildOptions.destination,
  );

  const baseConfig = {
    mode: isOptimizedBuild ? 'production' : 'development',
    devtool: false,
    entry: entryFiles,
    output: {
      path: path.resolve(buildPath, 'generated'),
      publicPath: '/generated/',
      filename: '[name].entry.js',
      chunkFilename: '[name].entry.js',
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              // Speed up compilation.
              cacheDirectory: '.babelcache',
              cacheCompression: false,
              // Also see .babelrc
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        },
        {
          // if we want to minify these images, we could add img-loader
          // but it currently only would apply to three images from uswds
          test: /\.(jpe?g|png|gif)$/i,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        },
        {
          test: /\.svg/,
          use: {
            loader: 'svg-url-loader',
            options: {
              limit: 1024,
              publicPath: './',
            },
          },
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 7000,
              mimetype: 'application/font-woff',
              name: '[name].[ext]',
            },
          },
        },
        {
          test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        },
        {
          test: /react-jsonschema-form\/lib\/components\/(widgets|fields\/ObjectField|fields\/ArrayField)/,
          exclude: [/widgets\/index\.js/, /widgets\/TextareaWidget/],
          use: {
            loader: 'null-loader',
          },
        },
        { test: /\.afm$/, type: 'asset/source' },
        // convert to base64 and include inline file system binary files used by fontkit and linebreak
        {
          enforce: 'post',
          test: /fontkit[/\\]index.js$/,
          loader: 'transform-loader',
          options: {
            brfs: {},
          },
        },
        {
          enforce: 'post',
          test: /linebreak[/\\]src[/\\]linebreaker.js/,
          loader: 'transform-loader',
          options: {
            brfs: {},
          },
        },
      ],
      noParse: [/mapbox\/vendor\/promise.js$/],
    },
    resolve: {
      alias: {
        fs: 'pdfkit/js/virtual-fs.js',
        'iconv-lite': false,
      },
      extensions: ['.js', '.jsx'],
      fallback: {
        fs: false,
        assert: require.resolve('assert/'),
        buffer: require.resolve('buffer/'),
        crypto: false,
        path: require.resolve('path-browserify'),
        stream: require.resolve('readable-stream'),
        util: require.resolve('util/'),
        zlib: require.resolve('browserify-zlib'),
      },
      symlinks: false,
    },
    optimization: {
      // 'chunkIds' and 'moduleIds' are set to 'named' for preserving
      // consistency between full and single app builds
      chunkIds: 'named',
      moduleIds: 'named',
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              beautify: false,
              comments: false,
            },
            warnings: false,
          },
          parallel: true,
        }),
      ],
      splitChunks: {
        cacheGroups: {
          // this needs to be "vendors" to overwrite a default group
          vendors: {
            chunks: 'all',
            test: 'vendor',
            name: 'vendor',
            enforce: true,
          },
        },
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        __BUILDTYPE__: JSON.stringify(buildtype),
        __API__: JSON.stringify(buildOptions.api),
        __REGISTRY__: JSON.stringify(appRegistry),
        'process.env.MAPBOX_TOKEN': JSON.stringify(
          process.env.MAPBOX_TOKEN || '',
        ),
        'process.env.VIRTUAL_AGENT_BACKEND_URL': JSON.stringify(
          process.env.VIRTUAL_AGENT_BACKEND_URL || '',
        ),
        'process.env.USE_LOCAL_DIRECTLINE':
          process.env.USE_LOCAL_DIRECTLINE || false,
      }),

      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),

      new webpack.SourceMapDevToolPlugin({
        append: `\n//# sourceMappingURL=${sourceMapSlug}/generated/[url]`,
        filename: '[file].map',
      }),

      new StylelintPlugin({
        configFile: '.stylelintrc.json',
        exclude: ['node_modules', 'build', 'coverage', '.cache'],
        fix: true,
      }),

      new MiniCssExtractPlugin(),

      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),

      new CopyPlugin({
        patterns: [
          {
            from: 'src/site/assets',
            to: buildPath,
          },
        ],
      }),

      new WebpackBar(),
    ],
    devServer: generateWebpackDevConfig(buildOptions),
  };

  if (!buildOptions.watch) {
    baseConfig.plugins.push(
      new WebpackManifestPlugin({
        fileName: 'file-manifest.json',
        filter: ({ isChunk }) => isChunk,
      }),
    );
  }

  // Optionally generate mocked HTML pages for apps without running content build.
  if (buildOptions.scaffold) {
    const scaffoldedHtml = generateHtmlFiles(buildPath, scaffoldAssets);
    baseConfig.plugins.push(...scaffoldedHtml);
  }

  // Open homepage or specific app in browser
  if (buildOptions.open) {
    const target =
      buildOptions.openTo || buildOptions.entry
        ? // Assumes the first in the list has a rootUrl
          getEntryManifests(buildOptions.entry)[0].rootUrl
        : '';
    baseConfig.devServer.open = { target };
  }

  if (buildOptions.analyzer) {
    baseConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: true,
      }),
    );
  }

  return baseConfig;
};
