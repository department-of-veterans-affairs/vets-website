import appendQuery from 'append-query';

/**
 * Uses the append-query lib (https://github.com/lakenen/node-append-query) to
 * assemble and append a valid query string to URLs.
 *
 * basePath {String} - Will often be '/' for React app base
 * searchQuery {Object || String} - Search parameters in key/value pairs
 */
export default function buildQueryString(basePath, searchQuery) {
  const searchQueryUrl = appendQuery(basePath, searchQuery);
  return searchQueryUrl;
}
