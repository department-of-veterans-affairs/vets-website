/**
 * @module index
 * @description Main barrel export file for VA Form 21-0779 application
 */

export {
  TITLE,
  SUBTITLE,
} from '@bio-aquia/21-0779-nursing-home-information/constants';
export { formConfig } from '@bio-aquia/21-0779-nursing-home-information/config';
export {
  default as routes,
} from '@bio-aquia/21-0779-nursing-home-information/routes';
export {
  default as reducer,
} from '@bio-aquia/21-0779-nursing-home-information/reducers';
export {
  App,
  IntroductionPage,
  ConfirmationPage,
} from '@bio-aquia/21-0779-nursing-home-information/containers';
export {
  GetHelp,
} from '@bio-aquia/21-0779-nursing-home-information/components';
