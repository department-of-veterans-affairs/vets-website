import React, { createContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router';

import { TaskTabs } from '../components/TaskTabs';
import { Portal } from '../components/Portal';
import { useMockedLogin } from '../../hooks/useMockedLogin';

export const ConfigContext = createContext();

export const ConfigProviderBase = ({ children, router }) => {
  const { useLoggedInQuery } = useMockedLogin();
  useLoggedInQuery(router?.location);

  const formConfig = router?.routes?.[1]?.formConfig;
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch({ type: 'SET_NEW_FORM_CONFIG', formConfig });
    },
    [dispatch, formConfig],
  );

  // we need to get the header element to append the tabs to it
  const headerMinimal = document.getElementById('header-minimal');
  const headerDefault = document.getElementById('header-default');
  return formConfig ? (
    <ConfigContext.Provider value={formConfig}>
      <Portal target={headerMinimal || headerDefault}>
        <TaskTabs location={router?.location} formConfig={formConfig} />
      </Portal>
      {children}
    </ConfigContext.Provider>
  ) : null;
};

export const ConfigProvider = withRouter(ConfigProviderBase);

ConfigProviderBase.propTypes = {
  children: PropTypes.node.isRequired,
  router: PropTypes.shape({
    location: PropTypes.object,
    routes: PropTypes.array,
  }).isRequired,
};
