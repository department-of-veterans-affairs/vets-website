/**
 * @module index
 * @description Main barrel export file for VA Form 21-4192 application
 * Provides centralized exports for all major components and configurations
 */

/** @exports Constants - Application-wide constants */
export {
  TITLE,
  SUBTITLE,
} from '@bio-aquia/21-4192-employment-information/constants';

/** @exports Containers - React container components */
<<<<<<< HEAD
export {
  App,
  IntroductionPage,
  ConfirmationPage,
} from '@bio-aquia/21-4192-employment-information/containers';
=======
export {
  App,
  IntroductionPage,
  ConfirmationPage,
} from '@bio-aquia/21-4192-employment-information/containers';

/** @exports Pages - Form page configurations */
export {
  identificationInformation,
  mailingAddress,
  nameAndDateOfBirth,
  phoneAndEmailAddress,
} from '@bio-aquia/21-4192-employment-information/pages';
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)

/** @exports Config - Form configuration object */
export { formConfig } from '@bio-aquia/21-4192-employment-information/config';

/** @exports Routes - React Router configuration */
export {
  default as routes,
} from '@bio-aquia/21-4192-employment-information/routes';

/** @exports Reducers - Redux reducer configuration */
export {
  default as reducer,
} from '@bio-aquia/21-4192-employment-information/reducers';
