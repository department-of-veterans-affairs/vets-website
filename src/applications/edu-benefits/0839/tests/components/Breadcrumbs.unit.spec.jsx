import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import Breadcrumbs from '../../components/Breadcrumbs';

const middleware = [thunk];
const mockStore = configureStore(middleware);

describe('<Breadcrumbs>', () => {
  it('should render home breadcrumb', () => {
    const initialState = {
      navigation: {
        route: {
          path: '/',
        },
      },
    };
    const store = mockStore(initialState);
    const { getByTestId } = render(
      <Provider store={store}>
        <Breadcrumbs />
      </Provider>,
    );
    expect(getByTestId('breadcrumbs')).to.exist;
  });
});
