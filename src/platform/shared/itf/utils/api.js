import PropTypes from 'prop-types';

import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import readableList from 'platform/forms-system/src/js/utilities/data/readableList';

import {
  ITF_SUPPORTED_BENEFIT_TYPES,
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
 * @param {String} accountUuid
 * @param {Boolean} includeTypeInFetchApi - Include the itfType in the API URL;
 * added because 526 fetch API doesn't include the type, but Lighthouse API does
 * @param {String} inProgressFormId
 * @param {String} itfApi - API endpoint
 * @param {String} itfType - ITF type (e.g., "compensation")
 * @returns {FetchItReturns}
 */
export const fetchItf = async ({
  accountUuid,
  includeTypeInFetchApi = false,
  inProgressFormId,
  itfApi = ITF_API,
  itfType,
}) => {
  const apiUrl = `${environment.API_URL}${itfApi}${
    includeTypeInFetchApi ? `/${itfType}` : ''
  }`;
  let type = ITF_FETCH_FAILED;
  let data = [];

  try {
    const response = await apiRequest(apiUrl);
    if (response?.data) {
      type = ITF_FETCH_SUCCEEDED;
      data = response.data.attributes?.intentToFile || [];
    }
  } catch (error) {
    window.DD_LOGS?.logger.error('ITF fetch failed', {
      name: 'itf_fetch_failed',
      accountUuid,
      inProgressFormId,
    });
  }
  return { type, data };
};

fetchItf.propTypes = {
  itfType: PropTypes.string.isRequired,
  accountUuid: PropTypes.string,
  inProgressFormId: PropTypes.string,
  includeTypeInFetchApi: PropTypes.bool,
  itfApi: PropTypes.string,
};

/**
 * @typedef CreateItReturns
 * @type {Object}
 * @property {String} type - Create status
 * @property {Object} currentITF - (or all, depending on API) ITF
 */
/**
 * Create Intent to File from given API
 * @param {String} accountUuid
 * @param {Boolean} includeTypeInFetchApi - Include the itfType in the API URL;
 * added because 526 create API includes the type, but Lighthouse API does not
 * @param {String} inProgressFormId
 * @param {String} itfApi - API endpoint
 * @param {String} itfType - ITF type (e.g., "compensation")
 * @returns {CreateItReturns}
 */
export const createItf = async ({
  accountUuid,
  includeTypeInFetchApi = true,
  inProgressFormId,
  itfApi = ITF_API,
  itfType,
}) => {
  if (!itfType) {
    throw new Error('itfType is required');
  }

  const apiUrl = `${environment.API_URL}${itfApi}${
    includeTypeInFetchApi ? `/${itfType}` : ''
  }`;
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
    window.DD_LOGS?.logger.error('ITF creation failed', {
      name: 'itf_creation_failed',
      accountUuid,
      inProgressFormId,
    });
  }
  return { type, currentITF };
};

createItf.propTypes = {
  itfType: PropTypes.string.isRequired,
  accountUuid: PropTypes.string,
  inProgressFormId: PropTypes.string,
  itfApi: PropTypes.string,
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
 * @param {String} accountUuid
 * @param {Boolean} includeTypeInFetchApi - Include the itfType in the API URL;
 * added because 526 fetch API doesn't include the type, but Lighthouse API does
 * @param {String} inProgressFormId
 * @param {String} itfApi - API endpoint
 * @param {String} itfType - ITF type (e.g., "compensation")
 * @returns {GetAndProcessItReturns}
 */
export const getAndProcessItf = async (props = {}) => {
  const { itfType } = props;
  if (!itfType || !ITF_SUPPORTED_BENEFIT_TYPES.includes(itfType)) {
    throw new Error(
      `Intent to File type (itfType) is required and can only include ${readableList(
        ITF_SUPPORTED_BENEFIT_TYPES,
        'or',
      )}`,
    );
  }

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
  itfType: PropTypes.string.isRequired,
  accountUuid: PropTypes.string,
  inProgressFormId: PropTypes.string,
  includeTypeInFetchApi: PropTypes.bool,
  itfApi: PropTypes.string,
};
