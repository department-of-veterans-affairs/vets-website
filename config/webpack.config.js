/* eslint-disable no-console */

require('core-js/stable');
require('regenerator-runtime/runtime');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const path = require('path');
const webpack = require('webpack');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackBar = require('webpackbar');

const headerFooterData = require('../src/platform/landing-pages/header-footer-data.json');
const BUCKETS = require('../src/site/constants/buckets');
const ENVIRONMENTS = require('../src/site/constants/environments');
const scaffoldRegistry = require('../src/applications/registry.scaffold.json');
const facilitySidebar = require('../src/site/layouts/tests/vamc/fixtures/health_care_region_page.json')
  .facilitySidebar;

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

async function scaffoldBuild(baseConfig) {
  const TMP_SCAFFOLD_PATH = 'tmp/scaffold';
  fs.ensureDirSync(TMP_SCAFFOLD_PATH);

  const CONTENT_BUILD_ROOT =
    'https://raw.githubusercontent.com/department-of-veterans-affairs/content-build/master';

  const APP_REGISTRY_PATH = path.join(TMP_SCAFFOLD_PATH, 'registry.json');

  const INLINE_SCRIPTS = [
    'incompatible-browser.js',
    'record-event.js',
    'static-page-widgets.js',
  ];

  // Map local scaffold asset paths to their content-build paths.
  const scaffoldAssets = INLINE_SCRIPTS.reduce(
    (assetsMap, filename) => ({
      ...assetsMap,
      [path.join(TMP_SCAFFOLD_PATH, filename)]: path.join(
        'src/site/assets/js',
        filename,
      ),
    }),
    {
      [APP_REGISTRY_PATH]: 'src/applications/registry.json',
    },
  );

  // Download any missing assets used for the scaffold.
  await Promise.all(
    Object.entries(scaffoldAssets).map(async ([tmpPath, contentBuildPath]) => {
      // Skip download for existing assets.
      if (fs.existsSync(tmpPath)) return;
      console.log(`Missing scaffold asset at ${tmpPath.toString()}`);

      const fileUrl = new URL(path.join(CONTENT_BUILD_ROOT, contentBuildPath));
      console.log(`Downloading asset from ${fileUrl.toString()}`);

      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${fileUrl}.\n\n${response.status}: ${
            response.statusText
          }`,
        );
      }

      // Cache downloaded asset for later reuse.
      try {
        const fileContents = await response.buffer();
        fs.writeFileSync(tmpPath, fileContents);
        console.log(`Saved asset to ${tmpPath}`);
      } catch (error) {
        throw new Error(`Failed to write ${tmpPath}.\n\n${error}`);
      }
    }),
  );

  const landingPagePath = rootUrl =>
    path.join(baseConfig.output.path, '..', rootUrl, 'index.html');

  const loadInlineScript = filename =>
    fs.readFileSync(path.join(TMP_SCAFFOLD_PATH, filename));

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
  const generateLandingPage = ({
    appName,
    entryName = 'static-pages',
    rootUrl,
    template = {},
    widgetType,
    widgetTemplate,
  }) =>
    new HtmlPlugin({
      chunks: ['polyfills', 'web-components', 'vendor', 'style', entryName],
      filename: landingPagePath(rootUrl),
      inject: false,
      scriptLoading: 'defer',
      template: 'src/platform/landing-pages/dev-template.ejs',
      templateParameters: {
        entryName,
        headerFooterData,
        loadInlineScript,
        modifyScriptTags,
        modifyStyleTags,
        widgetType,
        widgetTemplate,
        facilitySidebar,
        rootUrl,
        // Default template metadata.
        breadcrumbs_override: [], // eslint-disable-line camelcase
        includeBreadcrumbs: false,
        loadingMessage: 'Please wait while we load the application for you.',
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

  const appRegistry = fs.readJsonSync(APP_REGISTRY_PATH);

  return [...appRegistry, ...scaffoldRegistry]
    .filter(({ rootUrl }) => rootUrl)
    .map(generateLandingPage);
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
  const entryFiles = Object.assign({}, apps, globalEntryFiles);
  const isOptimizedBuild = [VAGOVSTAGING, VAGOVPROD].includes(buildtype);

  // enable css sourcemaps for all non-localhost builds
  // or if build options include local-css-sourcemaps or entry
  const enableCSSSourcemaps =
    buildtype !== LOCALHOST ||
    buildOptions['local-css-sourcemaps'] ||
    !!buildOptions.entry;

  const outputPath = path.resolve(
    __dirname,
    '../',
    'build',
    buildOptions.destination,
    'generated',
  );

  const baseConfig = {
    mode: 'development',
    entry: entryFiles,
    output: {
      path: outputPath,
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
              // Also see .babelrc
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: enableCSSSourcemaps,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                // use cssnano to minimize css only on optimized builds
                plugins: isOptimizedBuild
                  ? () => [require('autoprefixer'), require('cssnano')]
                  : () => [require('autoprefixer')],
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
        __BUILDTYPE__: JSON.stringify(buildtype),
        __API__: JSON.stringify(buildOptions.api),
      }),

      new MiniCssExtractPlugin({
        moduleFilename: chunk => {
          const { name } = chunk;

          const isMedalliaStyleFile = name === vaMedalliaStylesFilename;
          if (isMedalliaStyleFile) return `[name].css`;

          return `[name].css`;
        },
      }),

      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      new WebpackBar(),
    ],
    devServer: generateWebpackDevConfig(buildOptions),
  };

  if (!buildOptions.watch) {
    baseConfig.plugins.push(
      new ManifestPlugin({
        fileName: 'file-manifest.json',
        filter: ({ path: filePath }) => !filePath.includes('/generated/..'),
      }),
    );
  }

  // Copy over image assets for when metalsmith is removed
  baseConfig.plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: 'src/site/assets',
          to: path.join(outputPath, '..', ''),
        },
      ],
    }),
  );

  // Optionally generate landing pages in the absence of a content build.
  if (buildOptions.scaffold) {
    const scaffoldedPages = await scaffoldBuild(baseConfig);
    baseConfig.plugins.push(...scaffoldedPages);

    // Open the browser to either --env.openTo or one of the root URLs of the
    // apps we're scaffolding
    baseConfig.devServer.open = true;
    baseConfig.devServer.openPage =
      buildOptions.openTo || buildOptions.entry
        ? // Assumes the first in the list has a rootUrl
          getEntryManifests(buildOptions.entry)[0].rootUrl
        : '';
  }

  if (isOptimizedBuild) {
    const bucket = BUCKETS[buildtype];

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
