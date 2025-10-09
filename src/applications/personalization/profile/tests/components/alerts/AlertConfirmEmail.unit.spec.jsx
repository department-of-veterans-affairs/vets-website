import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderInReduxProvider as render } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import AlertConfirmEmail from '../../../components/alerts/AlertConfirmEmail';
import {
  dismissAlertViaCookie,
  resetDismissAlertViaCookie,
  DATE_THRESHOLD,
} from '../../../selectors';

const DATE_STRING = new Date(DATE_THRESHOLD).toLocaleDateString('en-US');

// default state for specs is feature enabled, email confirmed -- not alerting
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
    dismissAlertViaCookie();
    const initialState = stateFn({ emailAddress: null });
    const { container } = render(<AlertConfirmEmail />, { initialState });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
    resetDismissAlertViaCookie();
  });

  it('renders nothing when state.featureToggles.loading', async () => {
    const initialState = stateFn({
      emailAddress: null,
      featureTogglesLoading: true,
    });
    const { container } = render(<AlertConfirmEmail />, { initialState });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  it('renders nothing when !state.featureToggles.mhvEmailConfirmation', async () => {
    const initialState = stateFn({
      emailAddress: null,
      mhvEmailConfirmation: false,
    });
    const { container } = render(<AlertConfirmEmail />, { initialState });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  it('renders nothing when state.user.profile.loading', async () => {
    const initialState = stateFn({
      emailAddress: null,
      userProfileLoading: true,
    });
    const { container } = render(<AlertConfirmEmail />, { initialState });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  describe('<AlertConfirmContactEmail />', () => {
    it('renders', async () => {
      const initialState = stateFn({ confirmationDate: null });
      const { container, getByRole, getByTestId } = render(
        <AlertConfirmEmail />,
        { initialState },
      );
      await waitFor(() => {
        getByTestId('alert-confirm-contact-email');
        getByRole('heading', { name: /^Confirm your contact email$/ });

        // getByRole('button', { name: /^Confirm contact email$/ });
        const buttonSelector = 'va-button[text="Confirm contact email"]';
        const button = container.querySelector(buttonSelector);
        expect(button).to.exist;
      });
    });

    it('renders when !confirmationDate', async () => {
      const initialState = stateFn({ confirmationDate: null });
      const { getByTestId } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        getByTestId('alert-confirm-contact-email');
      });
    });

    it(`renders when confirmationDate is before ${DATE_STRING}`, async () => {
      const confirmationDate = '2025-01-01T12:00:00.000+00:00';
      const initialState = stateFn({ confirmationDate });
      const { getByTestId } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        getByTestId('alert-confirm-contact-email');
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
        getByTestId('alert-confirm-contact-email');
      });
    });

    it(`renders when updatedAt is before ${DATE_STRING}`, async () => {
      const updatedAt = '2025-01-01T12:00:00.000+00:00';
      const initialState = stateFn({ updatedAt });
      const { getByTestId } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        getByTestId('alert-confirm-contact-email');
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

    it(`is removed from DOM when 'Confirm contact email' button clicked`, async () => {
      mockApiRequest();
      const initialState = stateFn({ confirmationDate: null });
      const { container } = render(<AlertConfirmEmail />, {
        initialState,
      });
      const button = 'va-button[text="Confirm contact email"]';
      fireEvent.click(container.querySelector(button));
      await waitFor(() => {
        expect(container).to.be.empty;
      });
    });
  });

  describe('<AlertAddContactEmail />', () => {
    it('renders', async () => {
      const initialState = stateFn({ emailAddress: null });
      const { container, getByRole, getByTestId } = render(
        <AlertConfirmEmail />,
        { initialState },
      );
      await waitFor(() => {
        getByTestId('alert-add-contact-email');
        getByRole('heading', { name: /^Add a contact email$/ });

        // getByRole('button', { name: /^Skip adding an email$/ });
        const buttonSelector = 'va-button[text="Skip adding an email"]';
        const button = container.querySelector(buttonSelector);
        expect(button).to.exist;
      });
    });

    it(`renders when !emailAddress`, async () => {
      const initialState = stateFn({ emailAddress: null });
      const { getByTestId } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        getByTestId('alert-add-contact-email');
      });
    });

    it(`renders when emailAddress === ''`, async () => {
      const initialState = stateFn({ emailAddress: '' });
      const { getByTestId } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        getByTestId('alert-add-contact-email');
      });
    });

    it('renders nothing when !emailAddress and alert has been dismissed', async () => {
      dismissAlertViaCookie();
      const initialState = stateFn({ emailAddress: null });
      const { container } = render(<AlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(container).to.be.empty;
      });
      resetDismissAlertViaCookie();
    });

    it(`is removed from DOM when 'Skip adding an email' button clicked`, async () => {
      const initialState = stateFn({ emailAddress: null });
      const { container } = render(<AlertConfirmEmail />, {
        initialState,
      });
      const button = 'va-button[text="Skip adding an email"]';
      fireEvent.click(container.querySelector(button));
      await waitFor(() => {
        expect(container).to.be.empty;
      });
    });
  });
});
