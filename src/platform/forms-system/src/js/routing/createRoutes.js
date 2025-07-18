import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { createFormPageList, createPageList } from '../helpers';
import validateConfig from '../validate-config';
import FormPage from '../containers/FormPage';
import ReviewPage from '../review/ReviewPage';
import ConfirmationPageWrapper from '../containers/ConfirmationPageWrapper';

// Export legacy version for backward compatibility
export { createLegacyRoutes } from './createLegacyRoutes';

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

  const pageRoutes = formPages.map(page => (
    <Route
      key={page.path}
      path={page.path}
      render={props => {
        const PageComponent = page.component || FormPage;
        return (
          <PageComponent
            {...props}
            pageConfig={page}
            pageList={pageList}
            urlPrefix={formConfig.urlPrefix}
          />
        );
      }}
    />
  ));

  const additionalRoutes = formConfig.additionalRoutes
    ? formConfig.additionalRoutes.map(route => (
        <Route
          key={route.path}
          path={route.path}
          render={props => (
            <route.component
              {...props}
              formConfig={formConfig}
              pageList={pageList}
            />
          )}
        />
      ))
    : [];

  const introductionRoute = formConfig.introduction ? (
    <Route
      key="introduction"
      path="introduction"
      render={props => (
        <formConfig.introduction
          {...props}
          formConfig={formConfig}
          pageList={pageList}
        />
      )}
    />
  ) : null;

  return (
    <Switch>
      {introductionRoute}
      {additionalRoutes}
      {pageRoutes}
      <Route
        key="review-and-submit"
        path="review-and-submit"
        render={props => (
          <ReviewPage {...props} formConfig={formConfig} pageList={pageList} />
        )}
      />
      <Route
        key="confirmation"
        path="confirmation"
        render={props => (
          <ConfirmationPageWrapper
            {...props}
            formConfig={formConfig}
            pageList={pageList}
          />
        )}
      />
      <Route render={() => <Redirect to={formConfig.urlPrefix || '/'} />} />
    </Switch>
  );
}
