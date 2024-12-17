import { removeLeadingSlash, removeTrailingSlash } from './string';

export const getFormIdFromUrl = (url, rootUrl) => {
  const noSlashRootUrl = removeLeadingSlash(removeTrailingSlash(rootUrl));
  return url.match(new RegExp(`${noSlashRootUrl}/([a-zA-Z0-9-_]+)/?`))?.[1];
};
