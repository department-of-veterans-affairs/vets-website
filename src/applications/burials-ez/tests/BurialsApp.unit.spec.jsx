import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import BurialsApp from '../BurialsApp';

const burialsLocation = {
  pathname: '/introduction',
  search: '',
  hash: '',
  action: 'POP',
  key: null,
  basename:
    '/burials-memorials/veterans-burial-allowance/apply-for-allowance-form-21p-530ez',
  query: '{}',
};

const store = ({
  burialFormEnabled = true,
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
    const location = window.location.pathname || window.location.href;
    expect(location).to.eq('/burials-memorials/veterans-burial-allowance/');
  });
});
