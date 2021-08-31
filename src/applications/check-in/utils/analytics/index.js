const createAnalyticsSlug = slug => {
  return `check-in-${slug}`;
};

const createApiEvent = (name, status, time, token, error) => {
  const rv = {
    event: 'api_call',
    'api-name': name,
    'api-status': status,
  };
  if (time) {
    // eslint-disable-next-line camelcase
    rv.api_latency_ms = time;
  }
  if (token) {
    rv['api-request-id'] = token;
  }
  if (error) {
    rv['error-key'] = error;
  }
  return rv;
};
export { createAnalyticsSlug, createApiEvent };
