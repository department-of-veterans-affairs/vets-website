import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { MyHealthAccessGuard } from '../util/route-guard';

describe('MyHealthAccessGuard', () => {
  const mockStore = configureStore([]);

  it('should render children when user is verified and has health data', () => {
    const store = mockStore({
      user: {
        profile: {
          loa: {
            current: 3,
          },
          facilities: ['123'],
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

  it('should redirect to "/my-health" when user is unverified', () => {
    const store = mockStore({
      user: {
        profile: {
          loa: {
            current: 1,
          },
          facilities: ['123'],
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

  it('should redirect to "/my-health" when user does not have health data', () => {
    const store = mockStore({
      user: {
        profile: {
          loa: {
            current: 3,
          },
          facilities: [],
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
});
