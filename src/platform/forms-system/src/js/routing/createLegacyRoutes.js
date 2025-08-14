import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { createFormPageList, createPageList } from '../helpers';
import validateConfig from '../validate-config';
import FormPage from '../containers/FormPage';
import ReviewPage from '../review/ReviewPage';
import ConfirmationPageWrapper from '../containers/ConfirmationPageWrapper';

/*
 * Enhanced version of createLegacyRoutes with v5 compatibility
 * Converts onEnter hooks to useEffect patterns where needed
 */

// HOC to convert onEnter hooks to useEffect
function withOnEnterEffect(Component, onEnter) {
  return function OnEnterWrapper(props) {
    const history = useHistory();

    useEffect(
      () => {
        if (onEnter && typeof onEnter === 'function') {
          const nextState = { location: history.location };
          const replace = path => history.replace(path);
          onEnter(nextState, replace);
        }
      },
      [history],
    );

    return <Component {...props} />;
  };
}

export function createLegacyRoutes(formConfig) {
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

  return routes.concat([
    {
      path: 'review-and-submit',
      formConfig,
      component: ReviewPage,
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
      // Convert onEnter to component for v5 compatibility
      component: withOnEnterEffect(
        () => null,
        (nextState, replace) => replace(formConfig.urlPrefix || '/'),
      ),
    },
  ]);
}
