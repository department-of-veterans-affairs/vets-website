import React, { useEffect, useState } from 'react';
import { Router, useRouterHistory } from 'react-router';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { createHistory } from 'history';
import PropTypes from 'prop-types';
import Error from './Error';
import { getRoutesFromFormConfig } from '../routes';
import {
  formLoadingFailed,
  fetchAndBuildFormConfig,
} from '../actions/form-load';
import { getReducerFromFormConfig } from '../reducers/form-render';
import { wrapWithBreadcrumb } from '../utils/breadcrumbs';

const FormRenderer = ({ formId, rootUrl, trackingPrefix, breadcrumbs }) => {
  const dispatch = useDispatch();
  const store = useStore();
  const [routes, setRoutes] = useState(null);
  const formConfig = useSelector(state => state.formLoad?.formConfig);
  const formLoadingError = useSelector(state => state.formLoad?.error);
  const isFormLoading = useSelector(state => state.formLoad?.isLoading);
  const history = useRouterHistory(createHistory)({
    basename: rootUrl,
  });

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
      } else if (formId) {
        dispatch(
          fetchAndBuildFormConfig(formId, {
            rootUrl,
            trackingPrefix,
          }),
        );
      } else {
        dispatch(formLoadingFailed('No form id'));
      }
    },
    [formConfig, dispatch, store, formId, rootUrl, trackingPrefix],
  );

  if (formLoadingError) {
    return <Error error={formLoadingError} />;
  }

  if (routes) {
    return wrapWithBreadcrumb(
      <Router
        history={history}
        createElement={(Element, elementProps) => (
          <Element {...elementProps} formConfig={formConfig} />
        )}
      >
        {routes}
      </Router>,
      breadcrumbs,
    );
  }

  if (isFormLoading) {
    return <div>Loading Form: {formId}</div>;
  }

  return null;
};

FormRenderer.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, href: PropTypes.string }),
  ),
  formId: PropTypes.string,
  rootUrl: PropTypes.string,
  trackingPrefix: PropTypes.string,
};

export default FormRenderer;
