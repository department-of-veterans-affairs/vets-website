require('@babel/polyfill');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');

const headerFooterData = require('../src/platform/landing-pages/header-footer-data.json');
const BUCKETS = require('../src/site/constants/buckets');
const ENVIRONMENTS = require('../src/site/constants/environments');

const {
  getAppManifests,
  getWebpackEntryPoints,
} = require('./manifest-helpers');

const generateWebpackDevConfig = require('./webpack.dev.config.js');

const timestamp = new Date().getTime();

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
  styleConsolidated: getAbsolutePath(
    'src/applications/proxy-rewrite/sass/style-consolidated.scss',
  ),
  vendor: sharedModules,
  // This is to solve the issue of the vendor file being cached
  'shared-modules': sharedModules,
};

/**
 * Get a list of all the entry points.
 *
 * @param {String} entry - List of comma-delimited entries to build. Builds all
 *                         entries if no value is passed.
 * @return {Object} - The entry file paths mapped to the entry names
 */
function getEntryPoints(entry) {
  const manifests = getAppManifests();
  let manifestsToBuild = manifests;
  if (entry) {
    const entryNames = entry.split(',').map(name => name.trim());
    manifestsToBuild = manifests.filter(manifest =>
      entryNames.includes(manifest.entryName),
    );
  }

  return getWebpackEntryPoints(manifestsToBuild);
}

module.exports = env => {
  const buildOptions = {
    api: '',
    buildtype: 'localhost',
    host: 'localhost',
    port: 3001,
    scaffold: false,
    watch: false,
    ...env,
    // Using a getter so we can reference the buildtype
    get destination() {
      return path.resolve(__dirname, '../', 'build', this.buildtype);
    },
  };

  const apps = getEntryPoints(buildOptions.entry);
  const entryFiles = Object.assign({}, apps, globalEntryFiles);
  const isOptimizedBuild = [
    ENVIRONMENTS.VAGOVSTAGING,
    ENVIRONMENTS.VAGOVPROD,
  ].includes(buildOptions.buildtype);

  // enable css sourcemaps for all non-localhost builds
  // or if build options include local-css-sourcemaps or entry
  const enableCSSSourcemaps =
    buildOptions.buildtype !== ENVIRONMENTS.LOCALHOST ||
    buildOptions['local-css-sourcemaps'] ||
    !!buildOptions.entry;

  const outputPath = `${buildOptions.destination}/generated`;

  const baseConfig = {
    mode: 'development',
    entry: entryFiles,
    output: {
      path: outputPath,
      publicPath: '/generated/',
      filename: !isOptimizedBuild
        ? '[name].entry.js'
        : `[name].entry.[chunkhash]-${timestamp}.js`,
      chunkFilename: !isOptimizedBuild
        ? '[name].entry.js'
        : `[name].entry.[chunkhash]-${timestamp}.js`,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              // Speed up compilation.
              cacheDirectory: '.babelcache',
              // Also see .babelrc
            },
          },
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                minimize: isOptimizedBuild,
                sourceMap: enableCSSSourcemaps,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [require('autoprefixer')],
              },
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
            loader: 'svg-url-loader?limit=1024',
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
      ],
      noParse: [/mapbox\/vendor\/promise.js$/],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              beautify: false,
              comments: false,
            },
            warnings: false,
          },
          // cache: true,
          parallel: 3,
          sourceMap: true,
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
        __BUILDTYPE__: JSON.stringify(buildOptions.buildtype),
        __API__: JSON.stringify(buildOptions.api),
      }),

      new MiniCssExtractPlugin({
        filename: !isOptimizedBuild
          ? '[name].css'
          : `[name].[contenthash]-${timestamp}.css`,
      }),

      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    devServer: generateWebpackDevConfig(buildOptions),
  };

  if (!buildOptions.watch) {
    baseConfig.plugins.push(
      new ManifestPlugin({
        fileName: 'file-manifest.json',
      }),
    );
  }

  // Optionally generate landing pages in the absence of a content build.
  if (buildOptions.scaffold) {
    const landingPagePath = rootUrl =>
      path.join(outputPath, '../', rootUrl, 'index.html');

    const inlineScripts = [
      'incompatible-browser.js',
      'record-event.js',
      'static-page-widgets.js',
    ].reduce(
      (scripts, filename) => ({
        ...scripts,
        [filename]: fs.readFileSync(path.join('src/site/assets/js', filename)),
      }),
      {},
    );

    // Modifies the style tags output from HTML Webpack Plugin
    // to match the order and attributes of style tags from real content.
    const modifyStyleTags = pluginStyleTags =>
      pluginStyleTags
        .reduce(
          (tags, tag) =>
            // Puts style.css before the app-specific stylesheet.
            tag.attributes.href.match(/style/)
              ? [tag, ...tags]
              : [...tags, tag],
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

    const appRegistryPath = 'src/applications/registry.json';
    let appRegistry;

    if (fs.existsSync(appRegistryPath)) {
      appRegistry = JSON.parse(fs.readFileSync(appRegistryPath));
    }

    const generateLandingPage = ({
      appName,
      entryName = 'static-pages',
      rootUrl,
      template = {},
    }) =>
      new HtmlPlugin({
        chunks: ['polyfills', 'vendor', 'style', entryName],
        filename: landingPagePath(rootUrl),
        inject: false,
        scriptLoading: 'defer',
        template: 'src/platform/landing-pages/dev-template.ejs',
        templateParameters: {
          entryName,
          headerFooterData,
          inlineScripts,
          modifyScriptTags,
          modifyStyleTags,

          // Default template metadata.
          breadcrumbs_override: [], // eslint-disable-line camelcase
          includeBreadcrumbs: false,
          loadingMessage: 'Please wait while we load the application for you.',
          ...template, // Unpack any template metadata from the registry entry.
        },
        title: template.title || appName ? `${appName} | VA.gov` : 'VA.gov',
      });

    baseConfig.plugins = baseConfig.plugins.concat(
      // Fall back to using app manifests if app registry no longer exists.
      // The app registry is used primarily to get the template metadata
      // so the landing pages can resemble real content more closely.
      (appRegistry || getAppManifests())
        .filter(({ rootUrl }) => rootUrl)
        .map(generateLandingPage),
    );

    // Create a placeholder home page.
    baseConfig.plugins.push(
      new HtmlPlugin({
        filename: path.join(outputPath, '..', 'index.html'),
        inject: false,
        title: 'VA.gov',
      }),
    );

    // Copy over image assets to fill in the header and other content.
    baseConfig.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: 'src/site/assets/img',
            to: path.join(outputPath, '..', 'img'),
          },
        ],
      }),
    );
  }

  if (isOptimizedBuild) {
    const bucket = BUCKETS[buildOptions.buildtype];

    baseConfig.plugins.push(
      new webpack.SourceMapDevToolPlugin({
        append: `\n//# sourceMappingURL=${bucket}/generated/[url]`,
        filename: '[file].map',
      }),
    );

    baseConfig.plugins.push(new webpack.HashedModuleIdsPlugin());
    baseConfig.mode = 'production';
  } else {
    baseConfig.devtool = '#eval-source-map';

    // The eval-source-map devtool doesn't seem to work for CSS, so we
    // add a separate plugin for CSS source maps.
    baseConfig.plugins.push(
      new webpack.SourceMapDevToolPlugin({
        test: /\.css$/,
      }),
    );
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
