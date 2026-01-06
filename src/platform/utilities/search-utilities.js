import * as Sentry from '@sentry/browser';
import { apiRequest } from '~/platform/utilities/api';

export const isSearchTermValid = term => {
  if (!term) {
    return false;
  }

  return term.trim().length <= 255;
};
