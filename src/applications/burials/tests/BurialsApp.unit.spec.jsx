import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { VA_FORM_IDS } from 'platform/forms/constants';
import BurialsApp from '../BurialsApp';

const burialsLocation = {
  pathname: '/introduction',
  search: '',
  hash: '',
  action: 'POP',
  key: null,
  basename: '/burials/application/530',
  query: '{}',
};

const store = ({
  burialFormEnabled = true,
  burialFormV2 = false,
  featuresLoading = true,
  profileLoading = false,
  savedForms = [],
} = {}) => ({
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        loading: profileLoading,
        savedForms,
      },
    },
    featureToggles: {
      loading: featuresLoading,
      burialFormEnabled,
      burialFormV2,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('BurialsApp', () => {
  it('should show VA loading indicator', () => {
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <BurialsApp location={burialsLocation} />
      </Provider>,
    );
    expect($('va-loading-indicator', container)).to.exist;
  });

  it('should show VA loading indicator with loading profile', () => {
    const mockStore = store({ featuresLoading: false, profileLoading: true });
    const { container } = render(
      <Provider store={mockStore}>
        <BurialsApp location={burialsLocation} />
      </Provider>,
    );
    expect($('va-loading-indicator', container)).to.exist;
  });

  it('should show NoFormPage', async () => {
    const mockStore = store({
      featuresLoading: false,
      burialFormEnabled: false,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <BurialsApp location={burialsLocation} />
      </Provider>,
    );
    await waitFor(() => {
      expect($('va-loading-indicator', container)).to.not.exist;
      expect($('va-alert', container)).to.exist;
    });
  });

  it('should redirect to burial allowance', async () => {
    const mockStore = store({
      featuresLoading: false,
      burialFormEnabled: false,
    });
    global.window.location = {
      href: 'test',
    };
    render(
      <Provider store={mockStore}>
        <BurialsApp location={{ ...burialsLocation, pathname: 'test' }} />
      </Provider>,
    );
    await waitFor(() => {
      expect(window.location.href).to.eq(
        '/burials-memorials/veterans-burial-allowance/',
      );
    });
  });

  it('should redirect to v2', async () => {
    const mockStore = store({
      burialFormEnabled: true,
      burialFormV2: true,
      featuresLoading: false,
      profileLoading: false,
      savedForms: [],
    });
    const originalHref = window.location.href;
    global.window.location = {
      href: originalHref,
    };
    render(
      <Provider store={mockStore}>
        <BurialsApp location={burialsLocation} />
      </Provider>,
    );
    expect(window.location.href).to.eq(
      '/burials-and-memorials-v2/application/530/',
    );
  });

  it('should redirect to v2 with in progress form', async () => {
    const mockStore = store({
      burialFormEnabled: true,
      burialFormV2: false, // intentionally false.
      featuresLoading: false,
      profileLoading: false,
      savedForms: [
        {
          form: VA_FORM_IDS.FORM_21P_530V2,
        },
      ],
    });
    const originalHref = window.location.href;
    global.window.location = {
      href: originalHref,
    };
    render(
      <Provider store={mockStore}>
        <BurialsApp location={burialsLocation} />
      </Provider>,
    );
    expect(window.location.href).to.eq(
      '/burials-and-memorials-v2/application/530/',
    );
  });
});
