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
  it('should render breadcrumbs with correct navigation items', () => {
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
    const breadcrumbs = getByTestId('breadcrumbs');
    expect(breadcrumbs).to.exist;
  });

  it('should contain the correct breadcrumb items', () => {
    const initialState = {
      navigation: {
        route: {
          path: '/',
        },
      },
    };
    const store = mockStore(initialState);
    const { container } = render(
      <Provider store={store}>
        <Breadcrumbs />
      </Provider>,
    );
    const breadcrumbItems = container.querySelectorAll('va-breadcrumbs');
    expect(breadcrumbItems).to.have.length(1);
  });
});
