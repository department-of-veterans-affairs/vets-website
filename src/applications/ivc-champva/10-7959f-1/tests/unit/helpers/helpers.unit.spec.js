import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import formConfig from '../../../config/form';
import PrefillCopy from '../../../helpers/PrefillCopy';
import PrefilledAddress from '../../../helpers/prefilledAddress';

const props = {
  route: {
    path: 'prefillcopy',
    pageList: [],
    formConfig,
  },
};

const mockStore = {
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: [],
        verified: false,
        dob: '2000-01-01',
        claims: {
          appeals: false,
        },
      },
    },
    form: {
      formId: formConfig.formId,
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: {},
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('Prefill', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <PrefillCopy {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });
});

describe('PrefilledAddress', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <PrefilledAddress {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });
});
