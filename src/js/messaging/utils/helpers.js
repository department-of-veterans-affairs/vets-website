import _ from 'lodash';

export function createQueryString(query) {
  const segments = [];

  for (const key of Object.keys(query)) {
    // Linter only accepts camelCase keys, but API only
    // recognizes snake_case for query string parameters.
    const formattedKey = _.snakeCase(key);
    segments.push(`${formattedKey}=${query[key]}`);
  }

  return segments.join('&');
}

export function createUrlWithQuery(url, query) {
  const queryString = createQueryString(query);
  const fullUrl = queryString
                ? `${url}?${queryString}`
                : url;

  return fullUrl;
}

export function formatFileSize(bytes, decimalplaces = 2) {
  const kilo = 1000;
  const mega = 1000000;
  const multiplier = Math.pow(10, decimalplaces);
  let size;

  if (bytes < kilo) {
    size = `${bytes}B`;
  }

  if (bytes > kilo && bytes < mega) {
    const kbytes = Math.ceil(bytes / kilo);
    size = `${kbytes}K`;
  }

  if (bytes > mega) {
    const mbytes = Math.round((bytes / mega) * multiplier) / multiplier;
    size = `${mbytes}M`;
  }

  return size;
}

export function isJson(response) {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.indexOf('application/json') !== -1;
}
