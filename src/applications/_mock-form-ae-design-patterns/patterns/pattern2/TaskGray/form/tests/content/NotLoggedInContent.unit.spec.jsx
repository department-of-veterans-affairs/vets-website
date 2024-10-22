import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import NotLoggedInContent from '../../content/NotLoggedInContent';

const mockStore = (data = {}) => ({
  getState: () => ({
    form: {
      formId: '26-1880',
      data,
      loadedData: {
        metadata: {},
      },
    },
    user: {
      profile: {
        savedForms: [{ metadata: {} }],
        prefillsAvailable: [],
      },
      login: {},
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: {
        get() {},
      },
      dismissedDowntimeWarnings: [],
    },
  }),
  subscribe: () => {},
  dispatch: () => ({
    setFormData: () => {},
  }),
});

describe('notLoggedInContent', () => {
  const route = {
    formConfig: {
      formId: '26-1880',
      downtime: {},
      saveFormMessages: [],
      prefillEnabled: true,
    },
    pageList: [],
  };

  it('should render logged in content', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <NotLoggedInContent route={route} />
      </Provider>,
    );
    expect($('h2', container).textContent).to.contain(
      'Sign in to request a COE',
    );
  });
});
