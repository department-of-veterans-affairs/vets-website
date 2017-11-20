export * from './form';
export * from './modal';
export * from './refresh';

import { getEligibleClasses } from './form';
import { initialAppRefresh } from './refresh';

// TODO: Remove this hack to avoid parallel requests
// due to account creation race condition when MHVAC APIs are no longer invoked
// automatically on all actions.
export function initializeResources() {
  return dispatch => {
    return dispatch(getEligibleClasses()).then(() => {
      return dispatch(initialAppRefresh());
    });
  };
}
