import React, { createContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router';
import fallbackForm from '../config/fallbackForm';
import { TaskTabs } from '../components/TaskTabs';
import { Portal } from '../components/Portal';
import { useMockedLogin } from '../../hooks/useMockedLogin';

export const PatternConfigContext = createContext();

export const PatternConfigProviderBase = ({ children, router }) => {
  const { useLoggedInQuery } = useMockedLogin();
  useLoggedInQuery(router?.location);

  const formConfig = router?.routes?.[1]?.formConfig || fallbackForm;
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
    <PatternConfigContext.Provider value={formConfig}>
      <Portal target={headerMinimal}>
        <TaskTabs location={router?.location} formConfig={formConfig} />
      </Portal>
      <Portal target={headerDefault}>
        <TaskTabs location={router?.location} formConfig={formConfig} />
      </Portal>
      {children}
    </PatternConfigContext.Provider>
  ) : null;
};

export const PatternConfigProvider = withRouter(PatternConfigProviderBase);

PatternConfigProviderBase.propTypes = {
  children: PropTypes.node.isRequired,
  router: PropTypes.shape({
    location: PropTypes.object,
    routes: PropTypes.array,
  }).isRequired,
};
