import { apiRequest } from 'platform/utilities/api';

const SERVER_ERROR_REGEX = /^5\d{2}$/;
const SERVICE_ERROR_REGEX = /^4\d{2}$/;

export async function getData(apiRoute, options) {
  try {
    const response = await apiRequest(apiRoute, options);
    return response.data.attributes;
  } catch (error) {
    return error;
  }
}

export const isServerError = errCode => SERVER_ERROR_REGEX.test(errCode);

export const isServiceError = errCode => SERVICE_ERROR_REGEX.test(errCode);
