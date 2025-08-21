import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import YourPersonalInformationAuthenticated from '../../components/YourPersonalInformationAuthenticated';
import { createMockStore, mockRouterProps } from '../common';

describe('YourPersonalInformationAuthenticated', () => {
  it('should render with SSN and correctly formatted date', () => {
    const store = createMockStore({
      formData: {
        aboutYourself: {
          first: 'Test',
          last: 'User',
          dateOfBirth: '1971-12-08',
          socialOrServiceNum: {
            ssn: '123-45-6789',
          },
        },
      },
    });
    const router = {
      ...mockRouterProps,
    };

    const { getByRole, getByText } = render(
      <Provider store={store}>
        <YourPersonalInformationAuthenticated
          router={router}
          goForward={() => {}}
          goBack={() => {}}
          isLoggedIn
        />
      </Provider>,
    );

    expect(getByRole('heading', { name: /Your personal information/i })).to
      .exist;
    expect(getByText(/Social Security number:/)).to.exist;
    expect(getByText(/Date of birth: December 8, 1971/)).to.exist;
  });

  it('should handle dates with timezone information correctly', () => {
    const store = createMockStore({
      formData: {
        aboutYourself: {
          first: 'Test',
          last: 'User',
          dateOfBirth: '1971-12-08T00:00:00Z',
          socialOrServiceNum: {
            ssn: '123-45-6789',
          },
        },
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <YourPersonalInformationAuthenticated
          router={mockRouterProps}
          goForward={() => {}}
          goBack={() => {}}
          isLoggedIn
        />
      </Provider>,
    );

    expect(getByText(/Date of birth: December 8, 1971/)).to.exist;
  });

  it('should render with service number', () => {
    const store = createMockStore({
      formData: {
        aboutYourself: {
          first: 'Test',
          last: 'User',
          dateOfBirth: '1971-12-08',
          socialOrServiceNum: {
            serviceNumber: '12345678',
          },
        },
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <YourPersonalInformationAuthenticated
          router={mockRouterProps}
          goForward={() => {}}
          goBack={() => {}}
          isLoggedIn
        />
      </Provider>,
    );

    expect(getByText(/Service number:/)).to.exist;
  });

  it('should render with missing date of birth', () => {
    const store = createMockStore({
      formData: {
        aboutYourself: {
          first: 'Test',
          last: 'User',
          socialOrServiceNum: {
            ssn: '123-45-6789',
          },
        },
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <YourPersonalInformationAuthenticated
          router={mockRouterProps}
          goForward={() => {}}
          goBack={() => {}}
          isLoggedIn
        />
      </Provider>,
    );

    expect(getByText('Date of birth: -')).to.exist;
  });

  it('should redirect if not logged in', () => {
    const goForwardSpy = sinon.spy();
    const store = createMockStore({
      formData: {
        aboutYourself: {
          first: 'Test',
          last: 'User',
        },
      },
    });

    render(
      <Provider store={store}>
        <YourPersonalInformationAuthenticated
          router={mockRouterProps}
          goForward={goForwardSpy}
          goBack={() => {}}
          isLoggedIn={false}
        />
      </Provider>,
    );

    expect(goForwardSpy.calledOnce).to.be.true;
  });
});
