/**
 * @module index
 * @description Main barrel export file for VA Form 21-0779 application
 * Provides centralized exports for all major components and configurations
 */

/** @exports Constants - Application-wide constants */
export { TITLE, SUBTITLE } from './constants';

/** @exports Containers - React container components */
export { App, IntroductionPage, ConfirmationPage } from './containers';

/** @exports Pages - Form page configurations */
export {
  identificationInformation,
  mailingAddress,
  nameAndDateOfBirth,
  phoneAndEmailAddress,
  nursingHomeDetails,
  nursingCareInformation,
} from './pages';

/** @exports Config - Form configuration object */
export { formConfig } from './config';

/** @exports Routes - React Router configuration */
export { default as routes } from './routes';

/** @exports Reducers - Redux reducer configuration */
export { default as reducer } from './reducers';
