import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PrefillAlertAndTitle from '../../components/PrefillAlertAndTitle';

const mockStore = configureStore([]);

describe('PrefillAlertAndTitle Component', () => {
  it('should render the prefill alert and title when logged in', () => {
    const store = mockStore({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <PrefillAlertAndTitle />
      </Provider>,
    );

    expect(
      getByText(
        'We’ve prefilled some of your information from your account. If you need to correct anything, you can edit the form fields below. Any updates you make here will only apply to this form.',
      ),
    ).to.exist;

    expect(getByText('Your contact information')).to.exist;
  });

  it('should render the prefill alert with a custom title', () => {
    const store = mockStore({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <PrefillAlertAndTitle title="Your postal code" />
      </Provider>,
    );

    expect(
      getByText(
        'We’ve prefilled some of your information from your account. If you need to correct anything, you can edit the form fields below. Any updates you make here will only apply to this form.',
      ),
    ).to.exist;

    expect(getByText('Your postal code')).to.exist;
  });

  it('should only render the title when not logged in', () => {
    const store = mockStore({
      user: {
        login: {
          currentlyLoggedIn: false,
        },
      },
    });

    const { queryByRole, getByText } = render(
      <Provider store={store}>
        <PrefillAlertAndTitle />
      </Provider>,
    );

    expect(queryByRole('alert')).to.be.null;

    expect(getByText('Your contact information')).to.exist;
  });
});
