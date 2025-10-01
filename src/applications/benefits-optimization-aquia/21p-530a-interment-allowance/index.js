/**
 * @module 21p-530a-interment-allowance/index
 * @description Main barrel export file for VA Form 21P-530A Application for Interment Allowance
 */

/** @exports {Object} Constants - Form constants */
export { TITLE, SUBTITLE } from './constants';

/** @exports {Object} Config - Form configuration */
export { formConfig } from './config';

/** @exports {Object} Containers - Container components */
export * from './containers';

/** @exports {Object} Pages - Form page configurations */
export * from './pages';

/** @exports {Object} Routes - Application routes */
export { default as routes } from './routes';

/** @exports {Object} Reducer - Application reducer */
export { default as reducer } from './reducers';
