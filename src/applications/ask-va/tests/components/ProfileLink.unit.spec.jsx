import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ProfileLink from '../../components/ProfileLink';

const mockStore = configureStore([]);

describe('ProfileLink Component', () => {
  it('should render the profile link and message when logged in', () => {
    const store = mockStore({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <ProfileLink />
      </Provider>,
    );

    expect(
      getByText(
        'Updates you make here will only apply to this form. To update your contact information for all your VA accounts, sign in to your profile.',
      ),
    ).to.exist;
  });

  it('should not render the profile link and message when logged out', () => {
    const store = mockStore({
      user: {
        login: {
          currentlyLoggedIn: false,
        },
      },
    });

    const { queryByText } = render(
      <Provider store={store}>
        <ProfileLink />
      </Provider>,
    );

    expect(
      queryByText(
        'Updates you make here will only apply to this form. To update your contact information for all your VA accounts, sign in to your profile.',
      ),
    ).to.be.null;
    expect(queryByText('Update your contact information online')).to.be.null;
  });
});
