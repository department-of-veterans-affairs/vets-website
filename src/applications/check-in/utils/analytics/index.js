const createAnalyticsSlug = slug => {
  return `check-in-${slug}`;
};

const createApiEvent = (event, name, status, time, token) => {
  const rv = {
    event,
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
