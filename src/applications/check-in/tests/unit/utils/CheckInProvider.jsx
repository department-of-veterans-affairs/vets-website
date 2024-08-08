import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { createStore } from './initState';
import { createMockRouter } from '../mocks/router';

const CheckInProvider = ({ i18n, children, store = {}, router = {} }) => {
  const initStore = createStore(store);
  const defaultRouter = {
    params: {
      token: 'token-123',
    },
    currentPage: '/test-page',
  };
  const mockRouter = { ...defaultRouter, ...router };
  const initRouter = createMockRouter(mockRouter);
  return (
    <Provider store={initStore}>
      <I18nextProvider i18n={i18n}>
        {React.cloneElement(children, { router: initRouter })}
      </I18nextProvider>
    </Provider>
  );
};

CheckInProvider.propTypes = {
  i18n: PropTypes.object.isRequired,
  children: PropTypes.node,
  router: PropTypes.object,
  store: PropTypes.object,
};

export default CheckInProvider;
