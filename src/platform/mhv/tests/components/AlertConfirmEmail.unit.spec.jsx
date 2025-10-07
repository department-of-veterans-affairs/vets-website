import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderInReduxProvider as render } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';

import AlertConfirmEmail, {
  dismissAlert,
  resetDismissAlert,
  DATE_THRESHOLD,
} from '../../components/AlertConfirmEmail';

const DATE_STRING = new Date(DATE_THRESHOLD).toLocaleDateString('en-US');

const stateFn = ({
  confirmationDate = '2025-09-30T12:00:00.000+00:00',
  emailAddress = 'vet@va.gov',
  featureTogglesLoading = false,
  mhvEmailConfirmation = true,
  updatedAt = '2025-09-30T12:00:00.000+00:00',
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
          confirmationDate,
          emailAddress,
          updatedAt,
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
    it('renders when !confirmationDate', async () => {
      const initialState = stateFn({ confirmationDate: null });
      const { getByTestId } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(getByTestId('alert-confirm-contact-email')).to.exist;
      });
    });

    it(`renders when confirmationDate is before ${DATE_STRING}`, async () => {
      const confirmationDate = '2025-01-01T12:00:00.000+00:00';
      const initialState = stateFn({ confirmationDate });
      const { getByTestId } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(getByTestId('alert-confirm-contact-email')).to.exist;
      });
    });

    it(`renders nothing when confirmationDate is after ${DATE_STRING}`, async () => {
      const confirmationDate = '2025-09-30T12:00:00.000+00:00';
      const initialState = stateFn({ confirmationDate });
      const { container } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(container).to.be.empty;
      });
    });

    it('renders when !updatedAt', async () => {
      const initialState = stateFn({ updatedAt: null });
      const { getByTestId } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(getByTestId('alert-confirm-contact-email')).to.exist;
      });
    });

    it(`renders when updatedAt is before ${DATE_STRING}`, async () => {
      const updatedAt = '2025-01-01T12:00:00.000+00:00';
      const initialState = stateFn({ updatedAt });
      const { getByTestId } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(getByTestId('alert-confirm-contact-email')).to.exist;
      });
    });

    it(`renders nothing when updatedAt is after ${DATE_STRING}`, async () => {
      const updatedAt = '2025-09-30T12:00:00.000+00:00';
      const initialState = stateFn({ updatedAt });
      const { container } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(container).to.be.empty;
      });
    });

    it.skip('is removed from DOM when dismissed', async () => {
      // Error: Unable to find role="button"
      mockApiRequest();
      const initialState = stateFn({ confirmationDate: null });
      const { container, getByRole } = render(<AlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        getByRole('button', { name: 'Confirm' }).click();
        expect(container).to.be.empty;
      });
    });
  });

  describe('<AlertAddContactEmail />', () => {
    it(`renders when !emailAddress`, async () => {
      const initialState = stateFn({ emailAddress: null });
      const { getByTestId } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(getByTestId('alert-add-contact-email')).to.exist;
      });
    });

    it(`renders when emailAddress === ''`, async () => {
      const initialState = stateFn({ emailAddress: '' });
      const { getByTestId } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(getByTestId('alert-add-contact-email')).to.exist;
      });
    });

    it('renders nothing when !emailAddress and alert has been dismissed', async () => {
      dismissAlert();
      const initialState = stateFn({ emailAddress: null });
      const { container } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(container).to.be.empty;
      });
      resetDismissAlert();
    });
  });
});
