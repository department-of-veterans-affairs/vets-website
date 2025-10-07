import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderInReduxProvider as render } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import AlertConfirmEmail, {
  dismissAlert,
  resetDismissAlert,
  EMAIL_CONFIRMATION_DATE_THRESHOLD,
} from '../../components/AlertConfirmEmail';

const stateFn = ({
  confirmationDate = '2025-09-31T12:00:00.000+00:00',
  emailAddress = 'vet@va.gov',
  featureTogglesLoading = false,
  mhvEmailConfirmation = true,
  userProfileLoading = false,
} = {}) => ({
  featureToggles: {
    loading: featureTogglesLoading,
    mhvEmailConfirmation,
  },
  user: {
    profile: {
      loading: userProfileLoading,
      vapContactInfo: {
        email: {
          emailAddress,
          confirmationDate,
        },
      },
    },
  },
});

describe('<AlertConfirmEmail />', () => {
  it('renders nothing when alert has been dismissed', async () => {
    dismissAlert();
    const initialState = stateFn();
    const { container } = render(<AlertConfirmEmail />, { initialState });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
    resetDismissAlert();
  });

  it('renders nothing when state.featureToggles.loading', async () => {
    const initialState = stateFn({ featureTogglesLoading: true });
    const { container } = render(<AlertConfirmEmail />, { initialState });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  it('renders nothing when !state.featureToggles.mhvEmailConfirmation', async () => {
    const initialState = stateFn({ mhvEmailConfirmation: false });
    const { container } = render(<AlertConfirmEmail />, { initialState });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  it('renders nothing when state.user.profile.loading', async () => {
    const initialState = stateFn({ userProfileLoading: true });
    const { container } = render(<AlertConfirmEmail />, { initialState });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  describe('<AlertConfirmContactEmail />', () => {
    it('renders when !state.user.profile.vapContactInfo.email.confirmationDate', async () => {
      const initialState = stateFn({ confirmationDate: null });
      const { getByTestId } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(getByTestId('alert-confirm-contact-email')).to.exist;
      });
    });

    it(`renders when state.user.profile.vapContactInfo.email.confirmationDate < ${EMAIL_CONFIRMATION_DATE_THRESHOLD}`, async () => {
      const confirmationDate = '2025-01-01T12:00:00.000+00:00';
      const initialState = stateFn({ confirmationDate });
      const { getByTestId } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(getByTestId('alert-confirm-contact-email')).to.exist;
      });
    });
  });

  describe('<AlertAddContactEmail />', () => {
    it('renders when !state.user.profile.vapContactInfo.email.emailAddress', async () => {
      const initialState = stateFn({ emailAddress: null });
      const { getByTestId } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(getByTestId('alert-add-contact-email')).to.exist;
      });
    });
  });
});
