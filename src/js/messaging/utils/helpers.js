import _ from 'lodash';

const createQueryString = (query) => {
  const segments = [];

  for (const key of Object.keys(query)) {
    // Linter only accepts camelCase keys, but API only
    // recognizes snake_case for query string parameters.
    const formattedKey = _.snakeCase(key);
    segments.push(`${formattedKey}=${query[key]}`);
  }

  return segments.join('&');
};

export const createUrlWithQuery = (url, query) => {
  const queryString = createQueryString(query);
  const fullUrl = queryString
                ? `${url}?${queryString}`
                : url;

  return fullUrl;
};
