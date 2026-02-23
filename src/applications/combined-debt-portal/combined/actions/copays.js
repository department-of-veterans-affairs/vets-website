import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import environment from 'platform/utilities/environment';

export const MCP_COPAYS_FETCH_INIT = 'MCP_COPAYS_FETCH_INIT';
export const MCP_COPAYS_FETCH_SUCCESS = 'MCP_COPAYS_FETCH_SUCCESS';
export const MCP_COPAYS_FETCH_FAILURE = 'MCP_COPAYS_FETCH_FAILURE';
export const MCP_DETAIL_FETCH_SUCCESS = 'MCP_DETAIL_FETCH_SUCCESS';
export const MCP_DETAIL_FETCH_FAILURE = 'MCP_DETAIL_FETCH_FAILURE';
export const MCP_DETAIL_FETCH_INIT = 'MCP_DETAIL_FETCH_INIT';

export const mcpCopaysFetchInit = () => ({
  type: MCP_COPAYS_FETCH_INIT,
});

const titleCase = str => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getTransformedStation = station => {
  if (!station) return station;

  const facilityName = station.facilitYNum
    ? getMedicalCenterNameByID(station.facilitYNum)
    : null;
  const city = titleCase(station.city);

  return {
    ...station,
    facilityName,
    city,
  };
};

const transform = data => {
  return data.map(copay => {
    if (!copay.station) {
      return copay;
    }
    return {
      ...copay,
      station: getTransformedStation(copay.station),
    };
  });
};

export const getAllCopays = async dispatch => {
  dispatch({ type: MCP_COPAYS_FETCH_INIT });

  const dataUrl = `${environment.API_URL}/v0/medical_copays`;

  return apiRequest(dataUrl)
    .then(({ data }) => {
      return dispatch({
        type: MCP_COPAYS_FETCH_SUCCESS,
        response: transform(data),
      });
    })
    .catch(({ errors }) => {
      const [error] = errors;
      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        Sentry.captureMessage(`medical_copays failed: ${error.detail}`);
      });
      return dispatch({
        type: MCP_COPAYS_FETCH_FAILURE,
        error,
      });
    });
};

export const getCopaySummary = async dispatch => {
  dispatch({ type: MCP_COPAYS_FETCH_INIT });

  const dataUrl = `${environment.API_URL}/v1/medical_copays`;

  return apiRequest(dataUrl)
    .then(responseData => {
      return dispatch({
        type: MCP_COPAYS_FETCH_SUCCESS,
        response: responseData,
      });
    })
    .catch(({ errors }) => {
      const [error] = errors;
      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        Sentry.captureMessage(`medical_copays failed: ${error.detail}`);
      });
      return dispatch({
        type: MCP_COPAYS_FETCH_FAILURE,
        error,
      });
    });
};

export const getCopayDetail = copayId => async dispatch => {
  dispatch({ type: MCP_DETAIL_FETCH_INIT });

  const dataUrl = `${environment.API_URL}/v1/medical_copays/${copayId}`;

  return apiRequest(dataUrl)
    .then(responseData => {
      return dispatch({
        type: MCP_DETAIL_FETCH_SUCCESS,
        response: responseData,
      });
    })
    .catch(({ errors }) => {
      const [error] = errors;
      return dispatch({
        type: MCP_DETAIL_FETCH_FAILURE,
        error,
      });
    });
};
