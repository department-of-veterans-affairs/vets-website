import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { App } from '.';

const store = ({ burialFormV2 = false } = {}) => ({
  getState: () => ({
    user: {
      profile: {
        loading: false,
        savedForms: [],
      },
      login: {
        currentlyLoggedIn: true,
      },
    },
    featureToggles: {
      loading: false,
      // eslint-disable-next-line camelcase
      burial_form_v2: burialFormV2,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('Burials v2', () => {
  it('renders v1 apply link with feature flag disabled', () => {
    const mockStore = store({ burialFormV2: false });
    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
    expect(
      container.querySelector(
        'a[href="/burials-and-memorials/application/530/introduction"]',
      ),
    ).to.exist;
    expect(
      container.querySelector(
        'a[href="/burials-and-memorials-v2/application/530/introduction"]',
      ),
    ).to.not.exist;
  });

  it('renders v2 apply link with feature enabled', () => {
    const mockStore = store({ burialFormV2: true });
    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
    expect(
      container.querySelector(
        'a[href="/burials-and-memorials-v2/application/530/introduction"]',
      ),
    ).to.exist;
    expect(
      container.querySelector(
        'a[href="/burials-and-memorials/application/530/introduction"]',
      ),
    ).to.not.exist;
  });
});
