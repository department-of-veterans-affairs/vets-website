/**
 * @module 21p-530a-interment-allowance/index
 * @description Main barrel export file for VA Form 21P-530A Application for Interment Allowance
 */

/** @exports {Object} Constants - Form constants */
export {
  TITLE,
  SUBTITLE,
  TRACKING_PREFIX,
} from '@bio-aquia/21p-530a-interment-allowance/constants';

/** @exports {Object} Config - Form configuration */
export { formConfig } from '@bio-aquia/21p-530a-interment-allowance/config';

/** @exports {Object} Pages - Form page configurations */
export * from '@bio-aquia/21p-530a-interment-allowance/pages';

/** @exports {Object} Routes - Application routes */
export {
  default as routes,
} from '@bio-aquia/21p-530a-interment-allowance/routes';

/** @exports {Object} Reducer - Application reducer */
export {
  default as reducer,
} from '@bio-aquia/21p-530a-interment-allowance/reducers';
