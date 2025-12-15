/**
 * @module index
 * @description Main barrel export file for VA Form 21-2680 application
 */

export { TITLE, SUBTITLE } from './constants';
export { formConfig } from './config';
export { default as routes } from './routes';
export { default as reducer } from './reducers';
export { App, IntroductionPage, ConfirmationPage } from './containers';
export { GetHelp } from './components';
