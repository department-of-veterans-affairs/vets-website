import React from 'react';
import { waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { CSP_IDS } from '~/platform/user/authentication/constants';

import formConfig from '../../config/form';
import reducers from '../../reducers';
import IntroductionPage from '../../containers/IntroductionPage';
import { MDOT_ERROR_CODES } from '../../constants';

const stateFn = ({
  currentlyLoggedIn = true,
  loa = 3,
  loading = false,
  formData = {},
  errorCode = undefined,
  serviceName = CSP_IDS.LOGIN_GOV,
  vaPatient = true,
} = {}) => ({
  user: {
    login: {
      currentlyLoggedIn,
    },
    profile: {
      loading,
      savedForms: [],
      prefillsAvailable: [],
      loa: {
        current: loa,
        highest: 3,
      },
      verified: true,
      dob: '2000-01-01',
      claims: {
        appeals: false,
      },
      signIn: { serviceName },
      vaPatient,
    },
  },
  form: {
    formId: formConfig.formId,
    loadedStatus: 'success',
    savedStatus: '',
    loadedData: {
      metadata: {},
    },
    data: formData,
  },
  scheduledDowntime: {
    globalDowntime: null,
    isReady: true,
    isPending: false,
    serviceMap: { get() {} },
    dismissedDowntimeWarnings: [],
  },
  mdotInProgressForm: {
    formData,
    error: {
      code: errorCode,
    },
    loading,
  },
});

const props = {
  route: {
    formConfig,
    pageList: [],
    path: 'introduction',
  },
};

const setup = (nextState = {}) => {
  const initialState = stateFn(nextState);
  const options = { initialState, reducers };
  return renderInReduxProvider(<IntroductionPage {...props} />, options);
};

describe('IntroductionPage', () => {
  it('renders', async () => {
    const { container, getByRole } = setup();
    expect(container).not.to.be.empty;
    await waitFor(() => {
      getByRole('link', { name: 'Start a new order' });
    });
  });

  it('suppresses the "Start order" link when alerts are present', () => {
    const { queryByRole } = setup({ errorCode: MDOT_ERROR_CODES.DECEASED });
    expect(queryByRole('link', { name: 'Start a new order' })).to.be.null;
  });
});
