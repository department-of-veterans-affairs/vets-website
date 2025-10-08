import React from 'react';
import { expect } from 'chai';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import { waitFor } from '@testing-library/react';

import vapService from '@@vap-svc/reducers';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';

import {
  CSP_IDS,
  SERVICE_PROVIDERS,
} from '~/platform/user/authentication/constants';

import EmailInformationSection from '../../../components/contact-information/email-addresses/EmailInformationSection';

const baseState = {
  featureToggles: {
    loading: false,
    mhvEmailConfirmation: true,
  },
  user: {
    profile: {
      vapContactInfo: {
        email: {
          confirmationDate: '2025-09-30T12:00:00.000+00:00',
          emailAddress: 'myemail72585885@unattended.com',
          updatedAt: '2025-09-30T12:00:00.000+00:00',
        },
      },
    },
  },
};

const setSignInServiceName = (state, signInServiceName) => {
  return set(
    cloneDeep(state),
    'user.profile.signIn.serviceName',
    signInServiceName,
  );
};

describe('EmailInformationSection', () => {
  it('should render Contact email section', () => {
    const view = renderInReduxProvider(<EmailInformationSection />, {
      initialState: baseState,
      reducers: { vapService },
    });

    const baseEmailUsername = baseState.user.profile.vapContactInfo.email.emailAddress.split(
      '@',
    )[0];

    expect(view.getByTestId('email')).to.exist;
    expect(view.getByTestId('email')).to.contain.text(baseEmailUsername);
  });

  it('should render Sign In email section for ID.me', () => {
    const state = setSignInServiceName(baseState, CSP_IDS.ID_ME);
    const view = renderInReduxProvider(<EmailInformationSection />, {
      initialState: state,
      reducers: { vapService },
    });

    const { label } = SERVICE_PROVIDERS[CSP_IDS.ID_ME];

    expect(view.getByTestId('sign-in-email-link')).to.contain.text(label);
  });

  it('should render Sign In email section for LOGIN.GOV', () => {
    const state = setSignInServiceName(baseState, CSP_IDS.LOGIN_GOV);
    const view = renderInReduxProvider(<EmailInformationSection />, {
      initialState: state,
      reducers: { vapService },
    });

    const { label } = SERVICE_PROVIDERS[CSP_IDS.LOGIN_GOV];

    expect(view.getByTestId('sign-in-email-link')).to.contain.text(label);
  });

  it('should not render Sign In email section for MHV', () => {
    const state = setSignInServiceName(baseState, CSP_IDS.MHV);
    const view = renderInReduxProvider(<EmailInformationSection />, {
      initialState: state,
      reducers: { vapService },
    });

    expect(view.queryByTestId('sign-in-email-link')).not.to.exist;
  });

  it('should not render Sign In email section for DS LOGON', () => {
    const state = setSignInServiceName(baseState, CSP_IDS.DS_LOGON);
    const view = renderInReduxProvider(<EmailInformationSection />, {
      initialState: state,
      reducers: { vapService },
    });

    expect(view.queryByTestId('sign-in-email-link')).not.to.exist;
  });

  describe('AlertConfirmEmail', () => {
    it('renders <AlertConfirmContactEmail /> when email.updatedAt is before the threshold value', async () => {
      const state = set(
        cloneDeep(baseState),
        'user.profile.vapContactInfo.email.updatedAt',
        '2024-01-01T12:00:00.000+00:00',
      );
      const { getByTestId } = renderInReduxProvider(
        <EmailInformationSection />,
        {
          initialState: state,
          reducers: { vapService },
        },
      );
      await waitFor(() => {
        expect(getByTestId('alert-confirm-contact-email')).to.exist;
      });
    });

    it('renders <AlertAddContactEmail /> when !emailAddress', async () => {
      const state = set(
        cloneDeep(baseState),
        'user.profile.vapContactInfo.email.emailAddress',
        '',
      );
      const { getByTestId } = renderInReduxProvider(
        <EmailInformationSection />,
        {
          initialState: state,
          reducers: { vapService },
        },
      );
      await waitFor(() => {
        expect(getByTestId('alert-add-contact-email')).to.exist;
      });
    });

    it('suppresses <AlertContactEmail /> when email.updatedAt is after the threshold value', async () => {
      const { queryByTestId } = renderInReduxProvider(
        <EmailInformationSection />,
        {
          initialState: baseState,
          reducers: { vapService },
        },
      );
      await waitFor(() => {
        expect(queryByTestId('alert-confirm-contact-email')).to.not.exist;
        expect(queryByTestId('alert-add-contact-email')).to.not.exist;
      });
    });

    it('suppresses <AlertContactEmail /> when !featureToggles.mhvEmailConfirmation', async () => {
      const state = set(
        cloneDeep(baseState),
        'featureToggles.mhvEmailConfirmation',
        false,
      );
      const { queryByTestId } = renderInReduxProvider(
        <EmailInformationSection />,
        {
          initialState: state,
          reducers: { vapService },
        },
      );
      await waitFor(() => {
        expect(queryByTestId('alert-confirm-contact-email')).to.not.exist;
        expect(queryByTestId('alert-add-contact-email')).to.not.exist;
      });
    });
  });
});
