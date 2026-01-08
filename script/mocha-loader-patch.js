/* eslint-disable import/no-dynamic-require */
const Module = require('module');
const path = require('path');

/**
 * Safely resolve a module specifier, returning null instead of throwing on failure.
 */
function safeResolve(specifier) {
  try {
    return require.resolve(specifier);
  } catch (error) {
    // Defer resolution errors to the normal loader path
    return null;
  }
}

// Normalize problematic requires for Node 22 test runs:
// - Strip the `node:` prefix for built-ins when older tooling can't handle it
// - Redirect Enzyme/parse5 deep imports blocked by package.exports
if (!Module._load.__vaNodeCompatPatched) {
  const origLoad = Module._load;
  // eslint-disable-next-line no-unused-vars
  const origResolveFilename = Module._resolveFilename;

  const rootCheerioEntryPath = safeResolve('cheerio');
  const cheerioUtilsPath = safeResolve('cheerio/lib/utils');

  const entitiesDecodePath = safeResolve('entities/lib/decode.js');
  const entitiesEscapePath = safeResolve('entities/lib/escape.js');
  const parse5MainPath = safeResolve('parse5');
  let parse5OpenElementStackExport = null;

  if (parse5MainPath) {
    try {
      const openElementStackModule = require(path.join(
        path.dirname(parse5MainPath),
        'parser/open-element-stack.js',
      ));
      parse5OpenElementStackExport =
        openElementStackModule.OpenElementStack ||
        openElementStackModule.default ||
        openElementStackModule;
    } catch (error) {
      // Defer to the normal loader if the internal parser stack cannot be resolved
      parse5OpenElementStackExport = null;
    }
  }

  Module._load = function patchedLoad(request, parent, isMain) {
    if (typeof request === 'string') {
      if (request.startsWith('node:')) {
        return origLoad(request.slice(5), parent, isMain);
      }

      if (
        request === 'cheerio' &&
        rootCheerioEntryPath &&
        parent &&
        typeof parent.filename === 'string' &&
        parent.filename.includes(
          `${path.sep}node_modules${path.sep}enzyme${path.sep}`,
        )
      ) {
        return origLoad(rootCheerioEntryPath, parent, isMain);
      }

      if (
        request === 'cheerio/lib/utils' &&
        cheerioUtilsPath &&
        parent &&
        typeof parent.filename === 'string' &&
        parent.filename.includes(
          `${path.sep}node_modules${path.sep}enzyme${path.sep}`,
        )
      ) {
        return origLoad(cheerioUtilsPath, parent, isMain);
      }

      if (
        request === 'parse5/lib/parser/open-element-stack' &&
        parse5OpenElementStackExport
      ) {
        return parse5OpenElementStackExport;
      }

      if (
        (request === 'entities/decode' ||
          request === 'entities/lib/decode.js') &&
        entitiesDecodePath
      ) {
        return origLoad(entitiesDecodePath, parent, isMain);
      }

      if (
        (request === 'entities/escape' ||
          request === 'entities/lib/escape.js') &&
        entitiesEscapePath
      ) {
        return origLoad(entitiesEscapePath, parent, isMain);
      }
    }

    return origLoad(request, parent, isMain);
  };

  Module._load.__vaNodeCompatPatched = true;

  // ---------------------------------------------------------------------------
  // JSDOM + modern parse5: jsdom's JSDOMParse5Adapter assumes that its
  // OpenElementStack monkey-patch always maintains _currentElement, and uses
  // _currentElement._ownerDocument in createDocumentFragment. With newer
  // parse5 this can be undefined for some fragment parses (e.g. axe-core
  // injecting <style>), causing "_ownerDocument of undefined" errors.
  //
  // To keep jsdom working under Node 22 without forking it, patch the adapter
  // to fall back to its underlying document implementation when
  // _currentElement is not set.
  // ---------------------------------------------------------------------------
  try {
    const jsdomHtmlPath = path.resolve(
      __dirname,
      '../src/platform/testing/node_modules/jsdom/lib/jsdom/browser/parser/html.js',
    );
    // eslint-disable-next-line global-require
    const jsdomHtml = require(jsdomHtmlPath);
    const { JSDOMParse5Adapter } = jsdomHtml || {};

    if (
      JSDOMParse5Adapter &&
      JSDOMParse5Adapter.prototype &&
      !JSDOMParse5Adapter.prototype.__vaOwnerDocumentPatched
    ) {
      const originalCreateDocumentFragment =
        JSDOMParse5Adapter.prototype.createDocumentFragment;

      JSDOMParse5Adapter.prototype.createDocumentFragment = function patchedCreateDocumentFragment() {
        // If jsdom has a current element with an ownerDocument, keep the
        // original behavior.
        if (this._currentElement && this._currentElement._ownerDocument) {
          return originalCreateDocumentFragment.call(this);
        }

        // Fallback: rely on jsdom's document implementation when there is
        // no current element context (e.g. style fragments created by axe).
        if (this._documentImpl && this._documentImpl.createDocumentFragment) {
          return this._documentImpl.createDocumentFragment();
        }

        // As a last resort, defer to the original implementation.
        return originalCreateDocumentFragment.call(this);
      };

      JSDOMParse5Adapter.prototype.__vaOwnerDocumentPatched = true;
    }
  } catch (error) {
    // If jsdom internals move, fail soft and keep default behavior.
  }
}
