import { expect } from 'chai';
import React from 'react';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import App from '../../containers/App';

const getStore = (loading = false, currentlyLoggedIn = false) => ({
  user: {
    login: {
      currentlyLoggedIn,
    },
    profile: {
      loading,
      loa: {
        current: 1,
      },
      userFullName: {
        first: null,
      },
    },
  },
});

describe('App', () => {
  it('renders the shared page content', () => {
    const dhpContainer = renderInReduxProvider(<App />);
    const title = 'Connect your health devices to share data';
    const faq = 'Frequently Asked Questions';

    expect(dhpContainer.getByText(title)).to.exist;
    expect(dhpContainer.getByText(faq)).to.exist;
  });

  it('renders the the loading indicator when page is loading', () => {
    const { container } = renderInReduxProvider(<App />, {
      initialState: getStore(true, true),
    });

    expect($('va-loading-indicator', container)).to.exist;
  });

  it('renders the authenticated page content when a user is logged in', () => {
    const wrapper = renderInReduxProvider(<App />, {
      initialState: getStore(false, true),
    });

    expect(wrapper.getByText('Your connected deices')).to.exist;
  });

  it('renders the un-authenticated page content when a user is logged out', () => {
    const { container } = renderInReduxProvider(<App />, {
      initialState: getStore(false, false),
    });

    expect($('va-loading-indicator', container)).to.exist;
    expect($('va-button', container).getAttribute('text')).to.eql(
      'Sign in or create an account',
    );
  });
});
