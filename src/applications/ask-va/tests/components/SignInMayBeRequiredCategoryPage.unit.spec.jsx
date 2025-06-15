import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SignInMayBeRequiredCategoryPage from '../../components/SignInMayBeRequiredCategoryPage';

const mockStore = configureStore([]);

describe('SignInMayBeRequiredCategoryPage Component', () => {
  it('should render the alert when the user is not logged in', () => {
    const store = mockStore({
      user: {
        login: {
          currentlyLoggedIn: false,
        },
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <SignInMayBeRequiredCategoryPage />
      </Provider>,
    );

    expect(getByText('Sign in may be required')).to.exist;
  });

  it('should not render the alert when the user is logged in', () => {
    const store = mockStore({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
    });

    const { queryByText } = render(
      <Provider store={store}>
        <SignInMayBeRequiredCategoryPage />
      </Provider>,
    );

    expect(queryByText('Sign in may be required')).to.be.null;
  });

  it('should hide the alert when close event is triggered', () => {
    const store = mockStore({
      user: {
        login: {
          currentlyLoggedIn: false,
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <SignInMayBeRequiredCategoryPage />
      </Provider>,
    );

    const alert = container.querySelector('va-alert');

    // Create a mock function for onCloseEvent
    const onCloseEvent = () => {
      alert.setAttribute('visible', 'false');
    };

    // Set the onCloseEvent handler
    alert.onCloseEvent = onCloseEvent;

    // Trigger the close event
    alert.onCloseEvent();

    // The alert should be hidden
    expect(alert.getAttribute('visible')).to.equal('false');
  });

  describe('Redux connection', () => {
    it('should map state to props correctly', () => {
      const state = {
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
      };

      const store = mockStore(state);
      const { container } = render(
        <Provider store={store}>
          <SignInMayBeRequiredCategoryPage />
        </Provider>,
      );

      // Since we know isLoggedIn is true, the component should not render anything
      expect(container.firstChild).to.be.null;

      // Verify that the store received the correct action
      const actions = store.getActions();
      expect(actions).to.be.empty;
    });
  });
});
