import environment from '~/platform/utilities/environment';
import { apiRequest } from '~/platform/utilities/api';

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

const v1BaseUrl = `${environment.API_URL}/my_health/v1`;

export const getFolderList = () => {
  return apiRequest(
    `${v1BaseUrl}/messaging/folders?page=1&per_page=999&useCache=false`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export const countUnreadMessages = folders => {
  if (Array.isArray(folders?.data)) {
    return folders.data.reduce((accumulator, currentFolder) => {
      return currentFolder.id >= 0
        ? accumulator + currentFolder.attributes?.unreadCount
        : accumulator;
    }, 0);
  }

  if (folders?.data?.attributes?.unreadCount > 0) {
    return folders.data.attributes.unreadCount;
  }

  return 0;
};

// returns the value rounded to the nearest interval
// ex: roundToNearest({interval: 5000, value: 13000}) => 15000
// ex: roundToNearest({interval: 5000, value: 6500}) => 5000
export function roundToNearest({ interval, value }) {
  return Math.round(value / interval) * interval;
}
