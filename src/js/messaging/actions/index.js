import { RESET_REDIRECT } from '../utils/constants';

export * from './alert';
export * from './compose';
export * from './folders';
export * from './messages';
export * from './modals';
export * from './search';

export function resetRedirect() {
  return { type: RESET_REDIRECT };
};
