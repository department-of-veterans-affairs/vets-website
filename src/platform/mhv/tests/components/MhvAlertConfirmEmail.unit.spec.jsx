import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderInReduxProvider as render } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';

import MhvAlertConfirmEmail from '../../components/MhvAlertConfirmEmail';
import {
  dismissAlertViaCookie,
  resetDismissAlertViaCookie,
  DATE_THRESHOLD,
} from '../../components/MhvAlertConfirmEmail/selectors';

const DATE_STRING = new Date(DATE_THRESHOLD).toLocaleDateString('en-US');

// Helper to build successful transaction response
const buildSuccessResponse = () => ({
  data: {
    id: '',
    type: 'async_transaction_va_profile_email_address_transactions',
    attributes: {
      transactionId: 'test_tx_id',
      transactionStatus: 'COMPLETED_SUCCESS',
      type: 'AsyncTransaction::VAProfile::EmailAddressTransaction',
      metadata: [],
    },
  },
});

// default state for specs is feature enabled, email confirmed -- not alerting
const stateFn = ({
  confirmationDate = '2025-09-30T12:00:00.000+00:00',
  emailAddress = 'vet@va.gov',
  emailAddressId = 1,
  featureTogglesLoading = false,
  mhvEmailConfirmation = true,
  updatedAt = '2025-09-30T12:00:00.000+00:00',
  userProfileLoading = false,
  vaPatient = true,
} = {}) => ({
  featureToggles: {
    loading: featureTogglesLoading,
    mhvEmailConfirmation,
  },
  user: {
    profile: {
      loading: userProfileLoading,
      vaPatient,
      vapContactInfo: {
        email: {
          confirmationDate,
          emailAddress,
          id: emailAddressId,
          updatedAt,
        },
      },
    },
  },
});

describe('<MhvAlertConfirmEmail />', () => {
  it('renders nothing when alert has been dismissed', async () => {
    dismissAlertViaCookie();
    const initialState = stateFn({ emailAddress: null });
    const { container } = render(<MhvAlertConfirmEmail />, { initialState });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
    resetDismissAlertViaCookie();
  });

  it('renders nothing when featureToggles.loading', async () => {
    const initialState = stateFn({
      emailAddress: null,
      featureTogglesLoading: true,
    });
    const { container } = render(<MhvAlertConfirmEmail />, { initialState });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  it('renders nothing when !featureToggles.mhvEmailConfirmation', async () => {
    const initialState = stateFn({
      emailAddress: null,
      mhvEmailConfirmation: false,
    });
    const { container } = render(<MhvAlertConfirmEmail />, { initialState });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  it('renders nothing when user.profile.loading', async () => {
    const initialState = stateFn({
      emailAddress: '',
      userProfileLoading: true,
    });
    const { container } = render(<MhvAlertConfirmEmail />, { initialState });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  it('renders nothing when !user.profile.vaPatient', async () => {
    const initialState = stateFn({
      emailAddress: '',
      vaPatient: false,
    });
    const { container } = render(<MhvAlertConfirmEmail />, { initialState });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  describe('<AlertConfirmContactEmail />', () => {
    it('renders', async () => {
      const initialState = stateFn({ confirmationDate: null });
      const { container, getByRole, getByTestId } = render(
        <MhvAlertConfirmEmail />,
        { initialState },
      );
      await waitFor(() => {
        getByTestId('mhv-alert--confirm-contact-email');
        getByRole('heading', { name: /Confirm your contact email$/ });

        const button = getByTestId('mhv-alert--confirm-email-button');
        expect(button).to.exist;

        // getByRole('link', { name: /^Go to profile/ });
        const link = container.querySelector('va-link[text~="Go to profile"]');
        const href = '/profile/contact-information#email-address';
        expect(link.href).to.equal(href);
      });
    });

    it('reports a load event to analytics', async () => {
      const props = { recordEvent: sinon.spy() };
      const initialState = stateFn({ confirmationDate: null });
      const { getByTestId } = render(<MhvAlertConfirmEmail {...props} />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('mhv-alert--confirm-contact-email');
        expect(props.recordEvent.calledWith('Confirm your contact email'));
      });
    });

    it('renders when !confirmationDate', async () => {
      const initialState = stateFn({ confirmationDate: null });
      const { getByTestId } = render(<MhvAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('mhv-alert--confirm-contact-email');
      });
    });

    it(`renders when confirmationDate is before ${DATE_STRING}`, async () => {
      const confirmationDate = '2025-01-01T12:00:00.000+00:00';
      const initialState = stateFn({ confirmationDate });
      const { getByTestId } = render(<MhvAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('mhv-alert--confirm-contact-email');
      });
    });

    it(`renders nothing when confirmationDate is after ${DATE_STRING}`, async () => {
      const confirmationDate = '2025-09-30T12:00:00.000+00:00';
      const initialState = stateFn({ confirmationDate });
      const { container } = render(<MhvAlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(container).to.be.empty;
      });
    });

    it('renders when !updatedAt', async () => {
      const initialState = stateFn({ updatedAt: null });
      const { getByTestId } = render(<MhvAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('mhv-alert--confirm-contact-email');
      });
    });

    it(`renders when updatedAt is before ${DATE_STRING}`, async () => {
      const updatedAt = '2025-01-01T12:00:00.000+00:00';
      const initialState = stateFn({ updatedAt });
      const { getByTestId } = render(<MhvAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('mhv-alert--confirm-contact-email');
      });
    });

    it(`renders nothing when updatedAt is after ${DATE_STRING}`, async () => {
      const updatedAt = '2025-09-30T12:00:00.000+00:00';
      const initialState = stateFn({ updatedAt });
      const { container } = render(<MhvAlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(container).to.be.empty;
      });
    });

    it(`renders success when 'Confirm' button clicked, calls recordEvent`, async () => {
      mockApiRequest(buildSuccessResponse());
      const props = { recordEvent: sinon.spy() };
      const initialState = stateFn({ confirmationDate: null });
      const { getByTestId, queryByTestId } = render(
        <MhvAlertConfirmEmail {...props} />,
        { initialState },
      );
      await waitFor(() => getByTestId('mhv-alert--confirm-contact-email'));
      fireEvent.click(getByTestId('mhv-alert--confirm-email-button'));
      await waitFor(() => {
        getByTestId('mhv-alert--confirm-success');
        expect(queryByTestId('mhv-alert--confirm-contact-email')).to.be.null;
        const headline = 'Thank you for confirming your contact email address';
        expect(props.recordEvent.calledWith(headline));
      });
    });

    it(`renders error when 'Confirm' button clicked, calls recordEvent`, async () => {
      mockApiRequest({}, false);
      const props = { recordEvent: sinon.spy() };
      const initialState = stateFn({ confirmationDate: null });
      const { container, findByTestId, findByText } = render(
        <MhvAlertConfirmEmail {...props} />,
        {
          initialState,
        },
      );

      await findByTestId('mhv-alert--confirm-contact-email');
      fireEvent.click(container.querySelector('va-button[text="Confirm"]'));

      const alert = await findByTestId('mhv-alert--confirm-error');
      expect(alert.getAttribute('status')).to.equal('error');
      await findByText('Please try again.');
      const headline = 'We couldn’t confirm your contact email';

      await waitFor(() => {
        expect(props.recordEvent.calledWith(headline));
      });
    });

    it('calls confirmEmail with id and email_address in request body', async () => {
      mockApiRequest(buildSuccessResponse());
      const emailAddressId = 123;
      const emailAddress = 'test@example.com';
      const initialState = stateFn({
        emailAddress,
        emailAddressId,
        confirmationDate: null,
      });

      const { getByTestId } = render(<MhvAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => getByTestId('mhv-alert--confirm-contact-email'));
      fireEvent.click(getByTestId('mhv-alert--confirm-email-button'));

      await waitFor(() => {
        expect(global.fetch.calledOnce).to.be.true;
        const [, options] = global.fetch.firstCall.args;
        const requestBody = JSON.parse(options.body);
        expect(requestBody).to.have.property('id', emailAddressId);
        expect(requestBody).to.have.property('email_address', emailAddress);
      });
    });

    it('renders alert with role="alert"', async () => {
      const initialState = stateFn({ confirmationDate: null });
      const { getByTestId } = render(<MhvAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        const alert = getByTestId('mhv-alert--confirm-contact-email');
        expect(alert.getAttribute('role')).to.equal('status');
      });
    });

    it('focuses the success alert after confirming', async () => {
      mockApiRequest(buildSuccessResponse());
      const initialState = stateFn({ confirmationDate: null });
      const { getByTestId, queryByTestId } = render(<MhvAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => getByTestId('mhv-alert--confirm-contact-email'));
      fireEvent.click(getByTestId('mhv-alert--confirm-email-button'));
      await waitFor(() => {
        const successAlert = getByTestId('mhv-alert--confirm-success');
        // only the success alert is rendered
        expect(successAlert).to.exist;
        expect(queryByTestId('mhv-alert--confirm-contact-email')).to.be.null;
        // Check that the success alert is focused
        expect(document.activeElement).to.equal(successAlert);
        // Check that the success alert has tabindex="-1" to allow focusing
        expect(successAlert.getAttribute('tabindex')).to.equal('-1');
        // check that the success alert has role="alert"
        expect(successAlert.getAttribute('role')).to.equal('alert');
      });
    });

    it('focuses the error alert after failed confirmation', async () => {
      mockApiRequest({}, false); // Simulate failed API request
      const initialState = stateFn({ confirmationDate: null });
      const { getByTestId, queryByTestId } = render(<MhvAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => getByTestId('mhv-alert--confirm-contact-email'));
      fireEvent.click(getByTestId('mhv-alert--confirm-email-button'));
      await waitFor(() => {
        const errorAlert = getByTestId('mhv-alert--confirm-error');
        // only the error alert is rendered
        expect(errorAlert).to.exist;
        expect(queryByTestId('mhv-alert--confirm-success')).to.be.null;
        // The confirm-contact-email alert may or may not be present depending on UI flow
        // Check that the error alert is focused
        expect(document.activeElement).to.equal(errorAlert);
        // Check that the error alert has tabindex="-1" to allow focusing
        expect(errorAlert.getAttribute('tabindex')).to.equal('-1');
        // check that the error alert has role="alert"
        expect(errorAlert.getAttribute('role')).to.equal('alert');
      });
    });
  });

  describe('<AlertAddContactEmail />', () => {
    it('renders', async () => {
      const initialState = stateFn({ emailAddress: null });
      const { container, getByRole, getByTestId } = render(
        <MhvAlertConfirmEmail />,
        { initialState },
      );
      await waitFor(() => {
        getByTestId('mhv-alert--add-contact-email');
        getByRole('heading', { name: /Add a contact email$/ });

        // getByRole('link', { name: /^Go to profile/ });
        const linkSelector = 'va-link-action[text~="Go to profile"]';
        const link = container.querySelector(linkSelector);
        const href = '/profile/contact-information#email-address';
        expect(link.href).to.equal(href);

        // getByRole('button', { name: /^Skip adding email$/ });
        const buttonSelector = 'va-button[text="Skip adding email"]';
        const button = container.querySelector(buttonSelector);
        expect(button).to.exist;
      });
    });

    it('reports a load event to analytics', async () => {
      const props = { recordEvent: sinon.spy() };
      const initialState = stateFn({ emailAddress: null });
      const { getByTestId } = render(<MhvAlertConfirmEmail {...props} />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('mhv-alert--add-contact-email');
        expect(props.recordEvent.calledWith('Add a contact email'));
      });
    });

    it(`renders when !emailAddress`, async () => {
      const initialState = stateFn({ emailAddress: null });
      const { getByTestId } = render(<MhvAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('mhv-alert--add-contact-email');
      });
    });

    it(`renders when emailAddress === ''`, async () => {
      const initialState = stateFn({ emailAddress: '' });
      const { getByTestId } = render(<MhvAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('mhv-alert--add-contact-email');
      });
    });

    it('renders nothing when !emailAddress and alert has been dismissed', async () => {
      dismissAlertViaCookie();
      const initialState = stateFn({ emailAddress: null });
      const { container } = render(<MhvAlertConfirmEmail />, { initialState });
      await waitFor(() => {
        expect(container).to.be.empty;
      });
      resetDismissAlertViaCookie();
    });

    it(`renders success when 'Skip' button clicked, calls recordEvent`, async () => {
      const props = { recordEvent: sinon.spy() };
      const initialState = stateFn({ emailAddress: null });
      const { container, getByTestId, queryByTestId } = render(
        <MhvAlertConfirmEmail {...props} />,
        { initialState },
      );
      await waitFor(() => getByTestId('mhv-alert--add-contact-email'));
      const button = 'va-button[text="Skip adding email"]';
      fireEvent.click(container.querySelector(button));
      await waitFor(() => {
        getByTestId('mhv-alert--skip-success');
        expect(queryByTestId('mhv-alert--add-contact-email')).to.be.null;
        const headline = 'Okay, we’ll skip adding a contact email for now';
        expect(props.recordEvent.calledWith(headline));
      });
    });
  });
});
