import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import ConfirmationPage from '../../containers/ConfirmationPage';
import { getData } from '../fixtures/data/mock-form-data';

describe('Confirmation page', () => {
  it('should show email specific text', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { getByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage
          {...props}
          location={{
            state: {
              contactPreference: 'Email',
            },
          }}
        />
      </Provider>,
    );
    getByText('Your question was submitted successfully.');
    getByText('You should receive a reply by email', {
      exact: false,
    });
  });

  it('should show logged in specific wording', () => {
    const { props, mockStore } = getData({ loggedIn: true });
    const { getByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage
          {...props}
          location={{
            state: {
              contactPreference: 'Email',
            },
          }}
        />
      </Provider>,
    );
    getByText('you’ll need to sign in to VA.gov', {
      exact: false,
    });
  });

  it('should show mail specific text', () => {
    const { props, mockStore } = getData({ loggedIn: true });
    const { getByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage
          {...props}
          location={{
            state: {
              contactPreference: 'U.S. mail',
            },
          }}
        />
      </Provider>,
    );
    getByText('You should receive a letter in the mail', {
      exact: false,
    });
  });

  it('should show phone specific text', () => {
    const { props, mockStore } = getData({ loggedIn: true });
    const { getByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage
          {...props}
          location={{
            state: {
              contactPreference: 'Phone call',
            },
          }}
        />
      </Provider>,
    );
    getByText('You should receive a phone call', {
      exact: false,
    });
  });

  it('should show loading', () => {
    const { props, mockStore } = getData({ loading: true });
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage {...props} />
      </Provider>,
    );
    expect(container.querySelector('va-loading-indicator')).to.exist;
  });
});
