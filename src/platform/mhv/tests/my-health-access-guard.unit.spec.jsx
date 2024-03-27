import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { MyHealthAccessGuard } from '../util/route-guard';

describe('MyHealthAccessGuard', () => {
  const mockStore = configureStore([]);

  it('should render children when user has a valid MHV account (OK)', () => {
    const store = mockStore({
      user: {
        profile: {
          mhvAccountState: 'OK',
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MyHealthAccessGuard>
            <div>Protected Content</div>
          </MyHealthAccessGuard>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Protected Content')).to.exist;
  });

  it('should render children when user has a valid MHV account (MULTIPLE)', () => {
    const store = mockStore({
      user: {
        profile: {
          mhvAccountState: 'MULTIPLE',
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MyHealthAccessGuard>
            <div>Protected Content</div>
          </MyHealthAccessGuard>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Protected Content')).to.exist;
  });

  it('should redirect to "/my-health" when user does not have an MHV account (NONE)', () => {
    const store = mockStore({
      user: {
        profile: {
          mhvAccountState: 'NONE',
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MyHealthAccessGuard>
            <div>Protected Content</div>
          </MyHealthAccessGuard>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.queryByText('Protected Content')).to.not.exist;
    expect(screen.getByRole('link')).to.have.attr('href', '/my-health');
  });

  it('should redirect to "/my-health" when user profile is missing', () => {
    const store = mockStore({
      user: {},
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MyHealthAccessGuard>
            <div>Protected Content</div>
          </MyHealthAccessGuard>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.queryByText('Protected Content')).to.not.exist;
    expect(screen.getByRole('link')).to.have.attr('href', '/my-health');
  });
});
