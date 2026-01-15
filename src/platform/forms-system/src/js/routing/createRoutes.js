import { createFormPageList, createPageList } from '../helpers';
import validateConfig from '../validate-config';
import FormPage from '../containers/FormPage';
import ReviewPage from '../review/ReviewPage';
import ReviewPageExperimental from '../review/ReviewPageExperimental';
import ConfirmationPageWrapper from '../containers/ConfirmationPageWrapper';

/*
 * Create the routes based on a form config. This goes through each chapter in a form
 * config, pulls out the config for each page, then generates a list of Route components with the
 * config as props
 */
export function createRoutes(formConfig) {
  // Validate the config while creating the routes because this is really the
  // entry point for applications to use the forms library.
  // TODO: Tree shake this config validation in prod
  validateConfig(formConfig);

  const formPages = createFormPageList(formConfig);
  const pageList = createPageList(formConfig, formPages);

  let routes = formPages.map(page => ({
    path: page.path,
    component: page.component || FormPage,
    pageConfig: page,
    pageList,
    urlPrefix: formConfig.urlPrefix,
  }));

  if (formConfig.additionalRoutes) {
    routes = formConfig.additionalRoutes
      .map(route => ({
        ...route,
        formConfig,
        pageList,
      }))
      .concat(routes);
  }

  if (formConfig.introduction) {
    routes = [
      {
        path: 'introduction',
        component: formConfig.introduction,
        formConfig,
        pageList,
      },
    ].concat(routes);
  }

  const ReviewPageComponent = formConfig.editByPage
    ? ReviewPageExperimental
    : ReviewPage;

  return routes.concat([
    {
      path: 'review-and-submit',
      formConfig,
      component: ReviewPageComponent,
      pageList,
    },
    {
      path: 'confirmation',
      formConfig,
      component: ConfirmationPageWrapper,
      pageList,
    },
    {
      path: '*',
      onEnter: (nextState, replace) => replace(formConfig.urlPrefix || '/'),
    },
  ]);
}
