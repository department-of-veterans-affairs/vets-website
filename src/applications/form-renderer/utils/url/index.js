export const getFormIdFromUrl = (url, rootUrl) => {
  return url.match(new RegExp(`${rootUrl}/([a-zA-Z0-9-_]+)/?`))?.[1];
};
