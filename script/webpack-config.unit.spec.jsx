const { assert } = require('chai');

// Import the async webpack config factory directly via relative path
// eslint-disable-next-line import/no-dynamic-require, global-require
const getConfig = require('../config/webpack.config.js');

/**
 * Locate a plugin instance by its constructor name.
 * @param {object[]} plugins - The plugins array from the webpack config.
 * @param {string} name - Constructor name to find.
 * @returns {object|undefined}
 */
function findPlugin(plugins, name) {
  return plugins.find(
    plugin => plugin && plugin.constructor && plugin.constructor.name === name,
  );
}

describe('webpack.config.js hashing & manifest', () => {
  it('adds [contenthash] placeholders for optimized (prod) builds', async () => {
    const config = await getConfig({ buildtype: 'vagovprod' });

    // JS filenames should include [contenthash]
    assert.match(
      config.output.filename,
      /\[contenthash]/,
      'JS output filename should include [contenthash] placeholder',
    );

    // CSS filenames – MiniCssExtractPlugin options
    const cssPlugin = findPlugin(config.plugins, 'MiniCssExtractPlugin');
    assert.isOk(cssPlugin, 'MiniCssExtractPlugin should be present');
    assert.match(
      cssPlugin.options.filename,
      /\[contenthash]/,
      'CSS output filename should include [contenthash] placeholder',
    );

    // Manifest plugin should be enabled
    const manifestPlugin = findPlugin(config.plugins, 'WebpackManifestPlugin');
    assert.isOk(manifestPlugin, 'WebpackManifestPlugin should be included');
  });

  it('omits [contenthash] placeholders for localhost builds', async () => {
    const config = await getConfig({ buildtype: 'localhost' });
    assert.notMatch(
      config.output.filename,
      /\[contenthash]/,
      'JS output filename should NOT include [contenthash] placeholder',
    );
  });
});
