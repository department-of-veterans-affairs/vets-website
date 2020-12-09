const SERVER_ERROR_REGEX = /^5\d{2}$/;
const CLIENT_ERROR_REGEX = /^4\d{2}$/;

export const isServerError = errCode => SERVER_ERROR_REGEX.test(errCode);
export const isClientError = errCode => CLIENT_ERROR_REGEX.test(errCode);
