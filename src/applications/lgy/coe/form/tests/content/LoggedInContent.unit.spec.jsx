import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';

import { $$ } from 'platform/forms-system/src/js/utilities/ui';

import LoggedInContent from '../../content/LoggedInContent';

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

describe('LoggedInContent', () => {
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
        <LoggedInContent route={route} />
      </Provider>,
    );
    expect($$('h2', container).pop().textContent).to.contain(
      'Follow these steps to request a VA home loan COE',
    );
  });
});
