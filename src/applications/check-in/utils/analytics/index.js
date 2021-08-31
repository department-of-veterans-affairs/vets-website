const createAnalyticsSlug = slug => {
  return `check-in-${slug}`;
};

const createApiEvent = (name, status, time, token) => {
  const rv = {
    event: 'api_call',
    'api-name': name,
    'api-status': status,
  };
  if (time) {
    rv['api-latency-ms'] = time;
  }
  if (token) {
    rv['api-request-id'] = token;
  }
  return rv;
};
export { createAnalyticsSlug, createApiEvent };
