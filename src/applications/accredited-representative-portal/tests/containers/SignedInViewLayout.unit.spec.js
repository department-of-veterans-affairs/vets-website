import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SignedInViewLayout from '../../containers/SignedInViewLayout';

const mockStore = configureStore([]);

describe('SignedInViewLayout', () => {
  const getSignedInViewLayout = poaPermissions => {
    const store = mockStore({
      user: {
        isLoading: false,
        profile: {
          // TODO: Add profile properties
        },
      },
    });

    return render(
      <Provider store={store}>
        <MemoryRouter>
          <SignedInViewLayout poaPermissions={poaPermissions} />
        </MemoryRouter>
      </Provider>,
    );
  };

  it('renders alert when no POA Permissions', () => {
    const { getByTestId } = getSignedInViewLayout(false);
    expect(getByTestId('signed-in-view-layout-permissions-alert')).to.exist;
  });

  it('renders SideNav', () => {
    const { getByTestId } = getSignedInViewLayout();
    expect(getByTestId('sidenav-heading')).to.exist;
  });

  it('renders Breadcrumbs', () => {
    const { getByTestId } = getSignedInViewLayout();
    expect(getByTestId('breadcrumbs')).to.exist;
  });
});
