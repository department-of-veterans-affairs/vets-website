import React, { useEffect, useState } from 'react';
import { Router, useRouterHistory } from 'react-router';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { createHistory } from 'history';
import manifest from '../manifest.json';
import Error from './Error';
import { getRoutesFromFormConfig } from '../routes';
import { formLoadingFailed, fetchFormConfig } from '../actions/form-load';
import { getFormIdFromUrl } from '../utils/url';
import { getReducerFromFormConfig } from '../reducers/form-render';

// eslint-disable-next-line react-hooks/rules-of-hooks
const history = useRouterHistory(createHistory)({
  basename: manifest.rootUrl,
});

export default () => {
  const dispatch = useDispatch();
  const store = useStore();
  const [routes, setRoutes] = useState(null);
  const formId = useSelector(state => state.formLoad?.formId);
  const formConfig = useSelector(state => state.formLoad?.formConfig);
  const formLoadingError = useSelector(state => state.formLoad?.error);
  const isFormLoading = useSelector(state => state.formLoad?.isLoading);

  useEffect(
    () => {
      if (formConfig) {
        // We can't create a reducer or know the routes until we have the formConfig loaded.
        // After successfully loading formConfig, update the reducer and then calculate the routes.
        const formReducer = getReducerFromFormConfig(formConfig);
        store.injectReducer('form', formReducer.form);

        // The routes cannot be set until after the reducer has been injected
        const route = getRoutesFromFormConfig(formConfig);
        setRoutes(route);
      } else {
        // On initial load, parse url for formId and attempt to fetch formConfig
        const formIdFromUrl = getFormIdFromUrl(
          window.location.pathname,
          manifest.rootUrl,
        );
        if (formIdFromUrl) {
          dispatch(fetchFormConfig(formIdFromUrl));
        } else {
          dispatch(formLoadingFailed('Bad URL - No form id'));
        }
      }
    },
    [formConfig, dispatch, store],
  );

  if (formLoadingError) {
    return <Error error={formLoadingError} />;
  }

  if (routes) {
    return (
      <Router
        history={history}
        createElement={(Element, elementProps) => (
          <Element {...elementProps} formConfig={formConfig} />
        )}
      >
        {routes}
      </Router>
    );
  }

  if (isFormLoading) {
    return <div>Loading Form: {formId}</div>;
  }

  return null;
};
