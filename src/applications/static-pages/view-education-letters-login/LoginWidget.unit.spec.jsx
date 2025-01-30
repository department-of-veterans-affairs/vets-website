import React from 'react';
import { expect } from 'chai';
import { fireEvent, cleanup } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import App from './LoginWidget';

const createFakeStore = ({ isLoading = false, isLoggedIn = false } = {}) => ({
  user: {
    profile: { loading: isLoading },
    login: { currentlyLoggedIn: isLoggedIn },
  },
});

describe('App component', () => {
  afterEach(cleanup);

  it('should render va-loading-indicator', () => {
    const { container } = renderInReduxProvider(<App />, {
      initialState: createFakeStore({ isLoading: true }),
    });
    expect(container.querySelector('va-loading-indicator')).to.exist;
  });

  context('authenticated', () => {
    it('should render an anchor tag', () => {
      const { container } = renderInReduxProvider(<App />, {
        initialState: createFakeStore({ isLoggedIn: true }),
      });
      const anchorTag = container.querySelector('a');
      expect(anchorTag).to.exist;
      expect(anchorTag.href).to.contain('/education/download-letters/letters');
    });
  });

  context('unauthenticated', () => {
    it('should render va-alert-sign-in', () => {
      const { container } = renderInReduxProvider(<App />, {
        initialState: createFakeStore({ isLoggedIn: false }),
      });
      expect(container.querySelector('va-alert-sign-in')).to.exist;
    });

    it('should open sign-in modal when button is clicked', () => {
      const { container } = renderInReduxProvider(<App />, {
        initialState: createFakeStore({ isLoggedIn: false }),
      });
      const signInButton = container.querySelector('va-button');
      fireEvent.click(signInButton);
      expect(signInButton).to.exist;
    });
  });
});
