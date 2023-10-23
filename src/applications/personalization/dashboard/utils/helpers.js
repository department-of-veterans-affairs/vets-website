const SERVER_ERROR_REGEX = /^5\d{2}$/;
const CLIENT_ERROR_REGEX = /^4\d{2}$/;

export const isServerError = errCode => SERVER_ERROR_REGEX.test(errCode);
export const isClientError = errCode => CLIENT_ERROR_REGEX.test(errCode);

function createQueryString(query) {
  const segments = [];

  for (const key of Object.keys(query)) {
    segments.push(`${key}=${query[key]}`);
  }

  return segments.join('&');
}

export function createUrlWithQuery(url, query) {
  const queryString = createQueryString(query);
  return queryString ? `${url}?${queryString}` : url;
}

export const currency = amount => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return formatter.format(parseFloat(amount));
};
