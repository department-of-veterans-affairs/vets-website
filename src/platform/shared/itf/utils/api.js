import PropTypes from 'prop-types';

import { apiRequest } from 'platform/utilities/api';

import {
  ITF_STATUSES,
  ITF_API,
  ITF_FETCH_SUCCEEDED,
  ITF_FETCH_FAILED,
  ITF_CREATION_SUCCEEDED,
  ITF_CREATION_FAILED,
} from '../constants';

import { isNotExpired, findLastItf } from './index';

/**
 * @typedef FetchItReturns
 * @type {Object}
 * @property {String} type - Fetch status
 * @property {Array} data - Array of typed (or all, depending on API) ITF
 */
/**
 * Fetch Intent to File from given API
 * @param {String} apiUrl - API endpoint
 * @returns {FetchItReturns}
 */
export const fetchItf = async ({ apiUrl = ITF_API }) => {
  let type = ITF_FETCH_FAILED;
  let data = [];
  try {
    const response = await apiRequest(apiUrl);
    if (response?.data) {
      type = ITF_FETCH_SUCCEEDED;
      data = response.data.attributes?.intentToFile || [];
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  return { type, data };
};

fetchItf.propTypes = {
  apiUrl: PropTypes.string,
};

/**
 * @typedef CreateItReturns
 * @type {Object}
 * @property {String} type - Create status
 * @property {Object} currentITF - (or all, depending on API) ITF
 */
/**
 * Create Intent to File from given API
 * @param {String} apiUrl - API endpoint
 * @returns {CreateItReturns}
 */
export const createItf = async ({ apiUrl = ITF_API }) => {
  let type = ITF_CREATION_FAILED;
  let currentITF = {};

  try {
    const response = await apiRequest(apiUrl, { method: 'POST' });
    if (response?.data) {
      type = ITF_CREATION_SUCCEEDED;
      // in local environment, the intentToFile is an array
      currentITF = Array.isArray(response.data.attributes?.intentToFile)
        ? response.data.attributes?.intentToFile[0] || {}
        : response.data.attributes?.intentToFile || {};
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  return { type, currentITF };
};

createItf.propTypes = {
  apiUrl: PropTypes.string,
};

/**
 * @typedef GetAndProcessItReturns
 * @type {Object}
 * @property {String} type - Fetch status
 * @property {Object} currentITF - (or all, depending on API) ITF
 * @property {Object} previousITF - empty object
 */
/**
 * Fetch Intent to File from given API
 * @param {String} apiUrl - API endpoint
 * @returns {GetAndProcessItReturns}
 */
export const getAndProcessItf = async (props = {}) => {
  const { itfType } = props;
  const { type, data } = await fetchItf(props);
  if (type === ITF_FETCH_SUCCEEDED && data.length > 0) {
    const processedItfList = (data || []).filter(itf => itf.type === itfType);
    const currentITF =
      processedItfList.find(itf => itf.status === ITF_STATUSES.active) || {};
    const previousITF = findLastItf(processedItfList) || {};

    // Pulled the active ITF out like this in case it's not technically the
    // latest (not sure that's possible, though)
    if (currentITF?.expirationDate && isNotExpired(currentITF.expirationDate)) {
      return { type, previousITF, currentITF };
    }
    if (
      previousITF?.expirationDate &&
      isNotExpired(previousITF.expirationDate)
    ) {
      return { type, previousITF: {}, currentITF: previousITF };
    }
  }
  return { type };
};

getAndProcessItf.propTypes = {
  apiUrl: PropTypes.string,
};
