import React from 'react';
import { expect } from 'chai';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import { waitFor } from '@testing-library/react';

import vapService from '@@vap-svc/reducers';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import {
  CSP_IDS,
  SERVICE_PROVIDERS,
} from '~/platform/user/authentication/constants';

// 'import as alias' to clear the following Node 22 CI failure
// Exception during run: SyntaxError: src/applications/.../EmailInformationSection.unit.spec.jsx:
//   Identifier 'EmailInformationSection' has already been declared.
// https://github.com/department-of-veterans-affairs/vets-website/actions/runs/18567037132/job/52931122599?pr=39261#step:11:33
import { EmailInformationSection as ComponentUnderTest } from '../../../components/contact-information/email-addresses';

const baseState = {
  featureToggles: {
    loading: false,
    mhvEmailConfirmation: true,
  },
  user: {
    profile: {
      vaPatient: true,
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
    const view = renderWithStoreAndRouter(<ComponentUnderTest />, {
      initialState: baseState,
      reducers: { vapService },
    });

    const baseEmailUsername =
      baseState.user.profile.vapContactInfo.email.emailAddress.split('@')[0];

    expect(view.getByTestId('email')).to.exist;
    expect(view.getByTestId('email')).to.contain.text(baseEmailUsername);
  });

  it('should render Sign In email section for ID.me', () => {
    const state = setSignInServiceName(baseState, CSP_IDS.ID_ME);
    const view = renderWithStoreAndRouter(<ComponentUnderTest />, {
      initialState: state,
      reducers: { vapService },
    });

    const { label } = SERVICE_PROVIDERS[CSP_IDS.ID_ME];

    expect(view.getByTestId('sign-in-email-link')).to.contain.text(label);
  });

  it('should render Sign In email section for LOGIN.GOV', () => {
    const state = setSignInServiceName(baseState, CSP_IDS.LOGIN_GOV);
    const view = renderWithStoreAndRouter(<ComponentUnderTest />, {
      initialState: state,
      reducers: { vapService },
    });

    const { label } = SERVICE_PROVIDERS[CSP_IDS.LOGIN_GOV];

    expect(view.getByTestId('sign-in-email-link')).to.contain.text(label);
  });

  it('should not render Sign In email section for MHV', () => {
    const state = setSignInServiceName(baseState, CSP_IDS.MHV);
    const view = renderWithStoreAndRouter(<ComponentUnderTest />, {
      initialState: state,
      reducers: { vapService },
    });

    expect(view.queryByTestId('sign-in-email-link')).not.to.exist;
  });

  describe('ProfileAlertConfirmEmail component', () => {
    it('renders <AlertConfirmContactEmail /> when email.updatedAt is before the threshold value', async () => {
      const state = set(
        cloneDeep(baseState),
        'user.profile.vapContactInfo.email.updatedAt',
        '2024-01-01T12:00:00.000+00:00',
      );
      const { getByTestId } = renderWithStoreAndRouter(<ComponentUnderTest />, {
        initialState: state,
        reducers: { vapService },
      });
      await waitFor(() => {
        expect(getByTestId('profile-alert--confirm-contact-email')).to.exist;
      });
    });

    it('renders <AlertAddContactEmail /> when !emailAddress', async () => {
      const state = set(
        cloneDeep(baseState),
        'user.profile.vapContactInfo.email.emailAddress',
        '',
      );
      const { getByTestId } = renderWithStoreAndRouter(<ComponentUnderTest />, {
        initialState: state,
        reducers: { vapService },
      });
      await waitFor(() => {
        expect(getByTestId('profile-alert--add-contact-email')).to.exist;
      });
    });

    it('suppresses <ProfileAlertContactEmail /> when email.updatedAt is after the threshold value', async () => {
      const { queryByTestId } = renderWithStoreAndRouter(
        <ComponentUnderTest />,
        {
          initialState: baseState,
          reducers: { vapService },
        },
      );
      await waitFor(() => {
        expect(queryByTestId('profile-alert--confirm-contact-email')).to.not
          .exist;
        expect(queryByTestId('profile-alert--add-contact-email')).to.not.exist;
      });
    });

    it('suppresses <ProfileAlertContactEmail /> when !featureToggles.mhvEmailConfirmation', async () => {
      const state = set(
        cloneDeep(baseState),
        'featureToggles.mhvEmailConfirmation',
        false,
      );
      const { queryByTestId } = renderWithStoreAndRouter(
        <ComponentUnderTest />,
        {
          initialState: state,
          reducers: { vapService },
        },
      );
      await waitFor(() => {
        expect(queryByTestId('profile-alert--confirm-contact-email')).to.not
          .exist;
        expect(queryByTestId('profile-alert--add-contact-email')).to.not.exist;
      });
    });
  });
});
