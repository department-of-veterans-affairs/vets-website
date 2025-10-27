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
        getByRole('heading', { name: /^Confirm your contact email$/ });

        // getByRole('button', { name: /^Confirm$/ });
        const button = container.querySelector('va-button[text="Confirm"]');
        expect(button).to.exist;

        // getByRole('link', { name: /^Go to profile/ });
        const link = container.querySelector('va-link[text~="Go to profile"]');
        const href = '/profile/contact-information#contact-email-address';
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
      mockApiRequest();
      const props = { recordEvent: sinon.spy() };
      const initialState = stateFn({ confirmationDate: null });
      const { container, getByTestId, queryByTestId } = render(
        <MhvAlertConfirmEmail {...props} />,
        { initialState },
      );
      await waitFor(() => getByTestId('mhv-alert--confirm-contact-email'));
      fireEvent.click(container.querySelector('va-button[text="Confirm"]'));
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
      const { container, getByTestId } = render(
        <MhvAlertConfirmEmail {...props} />,
        {
          initialState,
        },
      );
      await waitFor(() => getByTestId('mhv-alert--confirm-contact-email'));
      fireEvent.click(container.querySelector('va-button[text="Confirm"]'));
      await waitFor(() => {
        getByTestId('mhv-alert--confirm-error');
        getByTestId('mhv-alert--confirm-contact-email');
        const headline = 'We couldn’t confirm your contact email';
        expect(props.recordEvent.calledWith(headline));
      });
    });

    it('should call putConfirmationDate with id and email_address in payload', async () => {
      mockApiRequest();
      const emailAddressId = 123;
      const emailAddress = 'test@example.com';
      const initialState = stateFn({
        emailAddress,
        emailAddressId,
        confirmationDate: null,
      });

      // const initialState = stateFn({ confirmationDate: null });
      const { container, getByTestId } = render(<MhvAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => getByTestId('mhv-alert--confirm-contact-email'));
      fireEvent.click(container.querySelector('va-button[text="Confirm"]'));

      await waitFor(() => {
        expect(global.fetch.calledOnce).to.be.true;
        const [, options] = global.fetch.firstCall.args;
        const payload = JSON.parse(options.body);
        expect(payload).to.have.property('id', emailAddressId);
        expect(payload).to.have.property('email_address', emailAddress);
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
        getByRole('heading', { name: /^Add a contact email$/ });

        // getByRole('link', { name: /^Go to profile/ });
        const linkSelector = 'va-link-action[text~="Go to profile"]';
        const link = container.querySelector(linkSelector);
        const href = '/profile/contact-information#contact-email-address';
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
