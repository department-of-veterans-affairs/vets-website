import React, { useEffect, useState } from 'react';
import { Router, useRouterHistory } from 'react-router';
import { connect, useStore } from 'react-redux';
import { createHistory } from 'history';
import PropTypes from 'prop-types';
import manifest from '../manifest.json';
import Error from './Error';
import { getRoutesFromFormConfig } from '../routes';
import {
  formLoadingFailed as formLoadingFailedAction,
  fetchFormConfig as fetchFormConfigAction,
} from '../actions/form-load';
import { getFormIdFromUrl } from '../utils/url';
import { getReducerFromFormConfig } from '../reducers/form-render';

// eslint-disable-next-line react-hooks/rules-of-hooks
const history = useRouterHistory(createHistory)({
  basename: manifest.rootUrl,
});

const Wrapper = ({
  formConfig,
  formId,
  formLoadingError,
  fetchFormConfig,
  setFormLoadingFailed,
}) => {
  const [routes, setRoutes] = useState(null);
  const store = useStore();

  useEffect(
    () => {
      if (formConfig) {
        // After successfully loading formConfig, update the reducer and calculate the routes
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
          fetchFormConfig(formIdFromUrl);
        } else {
          setFormLoadingFailed('Bad URL: no formId');
        }
      }
    },
    [formConfig],
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

  if (formId) {
    return <div>Loading Form: {formId}</div>;
  }

  return null;
};

const mapStateToProps = state => ({
  formId: state.formLoad.formId,
  formConfig: state.formLoad.formConfig,
  formLoadingError: state.formLoad.error,
});

const mapDispatchToProps = dispatch => ({
  fetchFormConfig: formId => dispatch(fetchFormConfigAction(formId)),
  setFormLoadingFailed: error => dispatch(formLoadingFailedAction(error)),
});

Wrapper.propTypes = {
  fetchFormConfig: PropTypes.func,
  formConfig: PropTypes.object,
  formId: PropTypes.string,
  formLoadingError: PropTypes.object,
  setFormLoadingFailed: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Wrapper);
