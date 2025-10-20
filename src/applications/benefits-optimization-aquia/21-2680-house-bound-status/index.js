/**
 * @module index
 * @description Main barrel export file for VA Form 21-2680 application
 * Provides centralized exports for all major components and configurations
 */

/** @exports Constants - Application-wide constants */
export {
  SUBTITLE,
  TITLE,
} from '@bio-aquia/21-2680-house-bound-status/constants';

/** @exports Containers - React container components */
export {
  App,
  ConfirmationPage,
  IntroductionPage,
} from '@bio-aquia/21-2680-house-bound-status/containers';

/** @exports Pages - Form page configurations */
export {
  identificationInformation,
  mailingAddress,
  nameAndDateOfBirth,
  phoneAndEmailAddress,
} from '@bio-aquia/21-2680-house-bound-status/pages';

/** @exports Config - Form configuration object */
export { formConfig } from '@bio-aquia/21-2680-house-bound-status/config';

/** @exports Routes - React Router configuration */
export {
  default as routes,
} from '@bio-aquia/21-2680-house-bound-status/routes';

/** @exports Reducers - Redux reducer configuration */
export {
  default as reducer,
} from '@bio-aquia/21-2680-house-bound-status/reducers';
