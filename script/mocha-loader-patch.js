const Module = require('module');

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

  const cheerioUtilsPath = safeResolve('cheerio/lib/utils.js');
  const entitiesDecodePath = safeResolve('entities/lib/decode.js');
  const entitiesEscapePath = safeResolve('entities/lib/escape.js');

  Module._load = function patchedLoad(request, parent, isMain) {
    if (typeof request === 'string') {
      if (request.startsWith('node:')) {
        return origLoad(request.slice(5), parent, isMain);
      }

      if (request === 'cheerio/lib/utils' && cheerioUtilsPath) {
        return origLoad(cheerioUtilsPath, parent, isMain);
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
}
