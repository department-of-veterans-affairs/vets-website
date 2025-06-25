import React, { createContext, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router';
import { TaskTabs } from './TaskTabs';
import { Portal } from './Portal';
import { useMockedLogin } from './hooks/useMockedLogin';

export const CodespaceContext = createContext();

export const CodespaceProviderBase = ({ children, router, tabsConfig }) => {
  const { useLoggedInQuery } = useMockedLogin();
  useLoggedInQuery(router?.location);

  const formConfig = useMemo(() => router?.routes?.[1]?.formConfig || {}, [
    router,
  ]);
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
    <CodespaceContext.Provider value={formConfig}>
      {headerMinimal && (
        <Portal target={headerMinimal}>
          <TaskTabs
            location={router?.location}
            formConfig={formConfig}
            tabsConfig={tabsConfig}
          />
        </Portal>
      )}
      {headerDefault && (
        <Portal target={headerDefault}>
          <TaskTabs
            location={router?.location}
            formConfig={formConfig}
            tabsConfig={tabsConfig}
          />
        </Portal>
      )}
      {children}
    </CodespaceContext.Provider>
  ) : null;
};

export const CodespaceProvider = withRouter(CodespaceProviderBase);

CodespaceProviderBase.propTypes = {
  children: PropTypes.node.isRequired,
  router: PropTypes.shape({
    location: PropTypes.object,
    routes: PropTypes.array,
  }).isRequired,
  tabsConfig: PropTypes.array.isRequired,
};
