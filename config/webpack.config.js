// Staging config. Also the default config that prod and dev are based off of.
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const ENVIRONMENTS = require('../src/site/constants/environments');
const BUCKETS = require('../src/site/constants/buckets');
const generateWebpackDevConfig = require('./webpack.dev.config.js');

const {
  getAppManifests,
  getWebpackEntryPoints,
} = require('./manifest-helpers');

require('@babel/polyfill');

const timestamp = new Date().getTime();

const getAbsolutePath = relativePath =>
  path.join(__dirname, '../', relativePath);

const globalEntryFiles = {
  polyfills: getAbsolutePath('src/platform/polyfills/preESModulesPolyfills.js'),
  style: getAbsolutePath('src/platform/site-wide/sass/style.scss'),
  styleConsolidated: getAbsolutePath(
    'src/applications/proxy-rewrite/sass/style-consolidated.scss',
  ),
  vendor: [
    getAbsolutePath('src/platform/polyfills'),
    'react',
    'react-dom',
    'react-redux',
    'redux',
    'redux-thunk',
    '@sentry/browser',
  ],
};

/**
 * Get a list of all the entry points.
 *
 * If the `entry` CLI argument is passed, only the specified
 * application entries are built.
 */
function getEntryPoints(entry) {
  const manifests = getAppManifests(path.join(__dirname, '../'));
  let manifestsToBuild = manifests;
  if (entry) {
    const entryNames = entry.split(',').map(name => name.trim());
    manifestsToBuild = manifests.filter(manifest =>
      entryNames.includes(manifest.entryName),
    );
  }

  return getWebpackEntryPoints(manifestsToBuild);
}

/**
 * The dev server requires settings.js for building the
 * redirects. This loads the settings for use in the watch commands.
 *
 * This does NOT recreate the full settings like
 * create-build-settings.js does. This is currently only meant to fill
 * out the URL rewrites for the webpack-dev-server.
 *
 * @return {Object} settings
 */
function getSettings() {
  const settings = {};
  const manifests = getAppManifests(path.join(__dirname, '../'));
  settings.applications = manifests
    .map(
      m =>
        // Some manifests don't have a rootUrl
        m.rootUrl && {
          contentProps: [
            {
              path: path.join('.', m.rootUrl),
            },
          ],
        },
    )
    // Filter out empty entries
    .filter(a => !!a);

  return settings;
}

module.exports = env => {
  const buildOptions = Object.assign(
    {},
    {
      api: '',
      buildtype: 'localhost',
      host: 'localhost',
      port: 3001,
      watch: false,
    },
    env,
  );
  // Assign additional defaults which reference other properties
  Object.assign(buildOptions, {
    destination: path.resolve(
      __dirname,
      '../',
      'build',
      buildOptions.buildtype,
    ),
  });
  buildOptions.settings = getSettings();

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

  const baseConfig = {
    mode: 'development',
    entry: entryFiles,
    output: {
      path: `${buildOptions.destination}/generated`,
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
  } else {
    // TODO: Only add these plugins when we're running watch

    // Add landing pages. Maybe check to see if the content is built first, and
    // only add these development landing pages if we don't have "real" landing
    // pages.
    baseConfig.plugins = baseConfig.plugins.concat(
      getAppManifests()
        .map(m => {
          // TODO: Only create the landing pages if they're not already there from
          // the content build
          if (m.rootUrl) {
            // TODO: Use rootUrl instead of entryName
            return new HtmlWebpackPlugin({
              // .. to back out of generated/, where the normal webpack output goes
              filename: `../${m.rootUrl}/index.html`,
              template:
                m.landingPageDevTemplate ||
                'src/platform/landing-page-dev-template.ejs',
              // Pass data to the tempates
              templateParameters: {
                // Everything from the manifest file
                ...m,
                // With some defaults
                loadingMessage:
                  m.loadingMessage ||
                  'Please wait while we load the application for you.',
                entryName: m.entryName || 'static-pages',
                // TODO: Get this placeholder data from another file
                headerFooterData: {
                  footerData: [
                    {
                      column: 1,
                      href: 'https://staging.va.gov/homeless/',
                      order: 1,
                      target: '',
                      title: 'Homeless Veterans',
                    },
                    {
                      column: 1,
                      href: 'https://staging.va.gov/womenvet/',
                      order: 2,
                      target: '',
                      title: 'Women Veterans',
                    },
                    {
                      column: 1,
                      href: 'https://staging.va.gov/centerforminorityveterans/',
                      order: 3,
                      target: '',
                      title: 'Minority Veterans',
                    },
                    {
                      column: 1,
                      href: 'https://www.ptsd.va.gov',
                      order: 4,
                      target: '',
                      title: 'PTSD',
                      rel: 'noopener noreferrer',
                    },
                    {
                      column: 1,
                      href: 'https://www.mentalhealth.va.gov',
                      order: 5,
                      target: '',
                      title: 'Mental health',
                      rel: 'noopener noreferrer',
                    },
                    {
                      column: 1,
                      href: 'https://staging.va.gov/adaptivesports/',
                      order: 6,
                      target: '',
                      title: 'Adaptive sports and special events',
                    },
                    {
                      column: 1,
                      href: 'https://www.nrd.gov',
                      order: 7,
                      target: '_blank',
                      title: 'National Resource Directory',
                      rel: 'noopener noreferrer',
                    },
                    {
                      column: 2,
                      href: 'https://staging.va.gov/vaforms/',
                      order: 1,
                      target: null,
                      title: 'Find a VA form',
                    },
                    {
                      column: 2,
                      href: 'https://www.mobile.va.gov/appstore/',
                      order: 2,
                      target: '_blank',
                      title: 'Get VA mobile apps',
                      rel: 'noopener noreferrer',
                    },
                    {
                      column: 2,
                      href: 'https://staging.va.gov/jobs/',
                      order: 3,
                      target: null,
                      title: 'Careers at VA',
                    },
                    {
                      column: 2,
                      href: 'https://staging.va.gov/landing2_business.htm',
                      order: 4,
                      target: null,
                      title: 'Doing business with VA',
                    },
                    {
                      column: 2,
                      href: 'https://staging.va.gov/ogc/accreditation.asp',
                      order: 5,
                      target: null,
                      title: 'VA claims accreditation',
                    },
                    {
                      column: 2,
                      href: 'https://www.accesstocare.va.gov/ourproviders/',
                      order: 6,
                      target: '_blank',
                      title: 'Find a VA health care provider',
                      rel: 'noopener noreferrer',
                    },
                    {
                      column: 2,
                      href: 'https://staging.va.gov/vso/',
                      order: 7,
                      target: null,
                      title: 'Veterans Service Organizations (VSOs)',
                    },
                    {
                      column: 2,
                      href: 'https://staging.va.gov/statedva.htm',
                      order: 8,
                      target: null,
                      title: 'State Veterans Affairs offices',
                    },
                    {
                      column: 2,
                      href: 'https://staging.va.gov/welcome-kit/',
                      order: 9,
                      target: null,
                      title: 'Print your VA welcome kit',
                    },
                    {
                      column: 3,
                      href: 'https://www.blogs.va.gov/VAntage/',
                      order: 1,
                      target: '_blank',
                      title: 'VAntage Point blog',
                      rel: 'noopener noreferrer',
                    },
                    {
                      column: 3,
                      href:
                        'https://public.govdelivery.com/accounts/USVA/subscriber/new/',
                      order: 2,
                      target: '_blank',
                      title: 'Email updates',
                      rel: 'noopener noreferrer',
                    },
                    {
                      column: 3,
                      href: 'https://www.facebook.com/VeteransAffairs',
                      order: 3,
                      target: '_blank',
                      title: 'Facebook',
                      rel: 'noopener noreferrer',
                    },
                    {
                      column: 3,
                      href: 'https://www.instagram.com/deptvetaffairs/',
                      order: 4,
                      target: '_blank',
                      title: 'Instagram',
                      rel: 'noopener noreferrer',
                    },
                    {
                      column: 3,
                      href: 'https://www.twitter.com/DeptVetAffairs/',
                      order: 5,
                      target: '_blank',
                      title: 'Twitter',
                      rel: 'noopener noreferrer',
                    },
                    {
                      column: 3,
                      href: 'https://www.flickr.com/photos/VeteransAffairs/',
                      order: 6,
                      target: '_blank',
                      title: 'Flickr',
                      rel: 'noopener noreferrer',
                    },
                    {
                      column: 3,
                      href: 'https://www.youtube.com/user/DeptVetAffairs',
                      order: 7,
                      target: '_blank',
                      title: 'YouTube',
                      rel: 'noopener noreferrer',
                    },
                    {
                      column: 3,
                      href: 'https://staging.va.gov/opa/socialmedia.asp',
                      order: 8,
                      target: null,
                      title: 'All VA social media',
                    },
                    {
                      column: 4,
                      href: 'https://staging.va.gov/find-locations/',
                      order: 1,
                      target: null,
                      title: 'Find a VA location',
                    },
                    {
                      column: 4,
                      href: 'https://iris.custhelp.va.gov/app/ask',
                      order: 2,
                      target: null,
                      title: 'Ask a question',
                      rel: 'noopener noreferrer',
                    },
                    {
                      column: 4,
                      label: 'Call MyVA311:',
                      href: 'tel:18446982311',
                      order: 3,
                      target: null,
                      title: '844-698-2311',
                    },
                    {
                      column: 4,
                      order: 4,
                      title: 'TTY: 711',
                    },
                    {
                      column: 'bottom_rail',
                      href: 'https://www.section508.va.gov',
                      order: 1,
                      target: null,
                      title: 'Accessibility',
                      rel: 'noopener noreferrer',
                    },
                    {
                      column: 'bottom_rail',
                      href: 'https://staging.va.gov/orm/NOFEAR_Select.asp',
                      order: 2,
                      target: null,
                      title: 'No FEAR Act Data',
                    },
                    {
                      column: 'bottom_rail',
                      href: 'https://staging.va.gov/oig/',
                      order: 3,
                      target: null,
                      title: 'Office of Inspector General',
                    },
                    {
                      column: 'bottom_rail',
                      href: 'https://staging.va.gov/opa/Plain_Language.asp',
                      order: 4,
                      target: null,
                      title: 'Plain language',
                    },
                    {
                      column: 'bottom_rail',
                      href: 'https://staging.va.gov/privacy-policy/',
                      order: 5,
                      target: null,
                      title: 'Privacy, policies, and legal information',
                    },
                    {
                      column: 'bottom_rail',
                      href: 'https://staging.va.gov/privacy/',
                      order: 6,
                      target: null,
                      title: 'VA Privacy Service',
                    },
                    {
                      column: 'bottom_rail',
                      href: 'https://staging.va.gov/foia/',
                      order: 7,
                      target: null,
                      title: 'Freedom of Information Act (FOIA)',
                    },
                    {
                      column: 'bottom_rail',
                      href: 'https://www.usa.gov/',
                      order: 8,
                      target: '_blank',
                      title: 'USA.gov',
                      rel: 'noopener noreferrer',
                    },
                    {
                      column: 'bottom_rail',
                      href: 'https://staging.va.gov/scorecard/',
                      order: 9,
                      target: null,
                      title: 'VA.gov scorecard',
                    },
                    {
                      column: 'bottom_rail',
                      href: 'https://staging.va.gov/veterans-portrait-project/',
                      order: 10,
                      target: null,
                      title: 'Veterans Portrait Project',
                    },
                  ],
                  megaMenuData: [
                    {
                      title: 'VA Benefits and Health Care',
                      menuSections: [
                        {
                          title: 'Health care',
                          links: {
                            seeAllLink: {
                              text: 'View all in health care',
                              href: 'https://staging.va.gov/health-care',
                            },
                            columnOne: {
                              title: 'Get health care benefits',
                              links: [
                                {
                                  text: 'About VA health benefits',
                                  href:
                                    'https://staging.va.gov/health-care/about-va-health-benefits',
                                },
                                {
                                  text: 'How to apply',
                                  href:
                                    'https://staging.va.gov/health-care/how-to-apply',
                                },
                                {
                                  text: 'Family and caregiver health benefits',
                                  href:
                                    'https://staging.va.gov/health-care/family-caregiver-benefits',
                                },
                                {
                                  text: 'Apply now for health care',
                                  href:
                                    'https://staging.va.gov/health-care/apply/application',
                                },
                              ],
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              },
              // Don't inject all the assets into all the landing pages
              // The assets we want are referenced in the template itself
              inject: false,
            });
          }

          // If there's no rootUrl, we can't create a landing page for it
          return undefined;
        })
        .filter(p => p),
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
