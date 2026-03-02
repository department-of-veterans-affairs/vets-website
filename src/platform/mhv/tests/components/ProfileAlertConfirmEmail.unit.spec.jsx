import React from 'react';
import * as redux from 'react-redux';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderInReduxProvider as render } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';

import { ProfileAlertConfirmEmail } from '../../components/MhvAlertConfirmEmail';
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
  emailAddressId = 42,
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
          id: emailAddressId,
          confirmationDate,
          emailAddress,
          updatedAt,
        },
      },
    },
  },
});

describe('<ProfileAlertConfirmEmail />', () => {
  let useDispatchStub;
  let dispatchSpy;

  beforeEach(() => {
    useDispatchStub = sinon.stub(redux, 'useDispatch');
    dispatchSpy = sinon.spy();
    useDispatchStub.returns(dispatchSpy);
  });

  afterEach(() => {
    useDispatchStub.restore();
  });

  // Helper for clicking VaButtonPair buttons (used in AlertAddContactEmail)
  const clickButtonPair = (container, clickSecondary = false) => {
    fireEvent(
      container.querySelector('va-button-pair'),
      new CustomEvent(clickSecondary ? 'secondaryClick' : 'primaryClick', {
        bubbles: true,
      }),
    );
  };

  it('renders nothing when alert has been dismissed', async () => {
    dismissAlertViaCookie();
    const initialState = stateFn({ emailAddress: null });
    const { container } = render(<ProfileAlertConfirmEmail />, {
      initialState,
    });
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
    const { container } = render(<ProfileAlertConfirmEmail />, {
      initialState,
    });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  it('renders nothing when !featureToggles.mhvEmailConfirmation', async () => {
    const initialState = stateFn({
      emailAddress: null,
      mhvEmailConfirmation: false,
    });
    const { container } = render(<ProfileAlertConfirmEmail />, {
      initialState,
    });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  it('renders nothing when user.profile.loading', async () => {
    const initialState = stateFn({
      emailAddress: null,
      userProfileLoading: true,
    });
    const { container } = render(<ProfileAlertConfirmEmail />, {
      initialState,
    });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  it('renders nothing when !user.profile.vaPatient', async () => {
    const initialState = stateFn({
      emailAddress: null,
      vaPatient: false,
    });
    const { container } = render(<ProfileAlertConfirmEmail />, {
      initialState,
    });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  describe('<AlertConfirmContactEmail />', () => {
    it('renders', async () => {
      const initialState = stateFn({ confirmationDate: null });
      const { container, getByRole, getByTestId, getByText } = render(
        <ProfileAlertConfirmEmail />,
        { initialState },
      );
      await waitFor(() => {
        getByTestId('profile-alert--confirm-contact-email');
        getByRole('heading', { name: /Confirm your contact email$/ });

        const confirmButton = getByTestId('mhv-alert--confirm-email-button');
        expect(confirmButton).to.exist;

        const editButton = container.querySelector(
          'va-button[text="Edit contact email"]',
        );
        expect(editButton).to.exist;

        expect(getByText('vet@va.gov')).to.exist;
      });
    });

    it('reports a load event to analytics', async () => {
      const props = { recordEvent: sinon.spy() };
      const initialState = stateFn({ confirmationDate: null });
      const { getByTestId } = render(<ProfileAlertConfirmEmail {...props} />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('profile-alert--confirm-contact-email');
        expect(props.recordEvent.calledWith('Confirm contact email'));
      });
    });

    it('renders when !confirmationDate', async () => {
      const initialState = stateFn({ confirmationDate: null });
      const { getByTestId } = render(<ProfileAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('profile-alert--confirm-contact-email');
      });
    });

    it(`renders when confirmationDate is before ${DATE_STRING}`, async () => {
      const confirmationDate = '2025-01-01T12:00:00.000+00:00';
      const initialState = stateFn({ confirmationDate });
      const { getByTestId } = render(<ProfileAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('profile-alert--confirm-contact-email');
      });
    });

    it(`renders nothing when confirmationDate is after ${DATE_STRING}`, async () => {
      const confirmationDate = '2025-09-30T12:00:00.000+00:00';
      const initialState = stateFn({ confirmationDate });
      const { container } = render(<ProfileAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        expect(container).to.be.empty;
      });
    });

    it('renders when !updatedAt', async () => {
      const initialState = stateFn({ updatedAt: null });
      const { getByTestId } = render(<ProfileAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('profile-alert--confirm-contact-email');
      });
    });

    it(`renders when updatedAt is before ${DATE_STRING}`, async () => {
      const updatedAt = '2025-01-01T12:00:00.000+00:00';
      const initialState = stateFn({ updatedAt });
      const { getByTestId } = render(<ProfileAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('profile-alert--confirm-contact-email');
      });
    });

    it(`renders nothing when updatedAt is after ${DATE_STRING}`, async () => {
      const updatedAt = '2025-09-30T12:00:00.000+00:00';
      const initialState = stateFn({ updatedAt });
      const { container } = render(<ProfileAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        expect(container).to.be.empty;
      });
    });

    it(`renders success when 'Confirm...' button clicked, calls recordEvent`, async () => {
      const headline = 'Thank you for confirming your contact email address';
      mockApiRequest(buildSuccessResponse());
      const props = { recordEvent: sinon.spy() };
      const initialState = stateFn({ confirmationDate: null });
      const { getByRole, getByTestId, queryByTestId } = render(
        <ProfileAlertConfirmEmail {...props} />,
        {
          initialState,
        },
      );
      await waitFor(() => getByTestId('profile-alert--confirm-contact-email'));
      fireEvent.click(getByTestId('mhv-alert--confirm-email-button'));

      await waitFor(() => {
        getByTestId('mhv-alert--confirm-success');
        getByRole('heading', {
          level: 3,
          name: new RegExp(headline),
        });
        expect(queryByTestId('profile-alert--confirm-contact-email')).to.be
          .null;
        expect(props.recordEvent.calledWith(headline));
      });
    });

    it(`renders error when 'Confirm...' button clicked, calls recordEvent`, async () => {
      mockApiRequest({}, false);
      const props = { recordEvent: sinon.spy() };
      const initialState = stateFn({ confirmationDate: null });
      const { getByTestId, getByText } = render(
        <ProfileAlertConfirmEmail {...props} />,
        {
          initialState,
        },
      );
      await waitFor(() => getByTestId('profile-alert--confirm-contact-email'));
      fireEvent.click(getByTestId('mhv-alert--confirm-email-button'));

      await waitFor(() => {
        getByTestId('mhv-alert--confirm-error');
        getByText('Please try again.');
        const headline = 'We couldn’t confirm your contact email';
        expect(props.recordEvent.calledWith(headline));
      });
    });

    it('calls confirmEmail with id and email_address in request body', async () => {
      mockApiRequest(buildSuccessResponse());
      const initialState = stateFn({
        emailAddress: 'veteran1729@example.com',
        emailAddressId: 1729,
        confirmationDate: null,
      });

      const { getByTestId } = render(<ProfileAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => getByTestId('profile-alert--confirm-contact-email'));
      fireEvent.click(getByTestId('mhv-alert--confirm-email-button'));

      await waitFor(() => {
        expect(global.fetch.calledOnce).to.be.true;
        const [, options] = global.fetch.firstCall.args;
        const requestBody = JSON.parse(options.body);
        expect(requestBody).to.have.property('id', 1729);
        expect(requestBody).to.have.property(
          'email_address',
          'veteran1729@example.com',
        );
      });
    });

    it(`navigates to the email address field when 'Edit contact email' button clicked`, async () => {
      useDispatchStub.returns(dispatchSpy);

      const props = { recordEvent: sinon.spy() };
      const initialState = stateFn({ confirmationDate: null });
      const { container, getByTestId } = render(
        <ProfileAlertConfirmEmail {...props} />,
        {
          initialState,
        },
      );

      await waitFor(() => getByTestId('profile-alert--confirm-contact-email'));
      const editButton = container.querySelector(
        'va-button[text="Edit contact email"]',
      );
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(
          dispatchSpy.calledWithMatch(
            sinon.match({ type: 'OPEN_MODAL', modal: 'email' }),
          ),
        ).to.be.true;

        useDispatchStub.restore();
      });
    });
  });

  describe('<AlertAddContactEmail />', () => {
    it('renders', async () => {
      const initialState = stateFn({ emailAddress: null });
      const { container, getByRole, getByTestId, getByText } = render(
        <ProfileAlertConfirmEmail />,
        { initialState },
      );
      await waitFor(() => {
        getByTestId('profile-alert--add-contact-email');
        getByRole('heading', { name: /Add a contact email$/ });

        const buttonPair = container.querySelector('va-button-pair');
        expect(buttonPair).to.exist;
        expect(buttonPair.getAttribute('left-button-text')).to.equal(
          'Add a contact email',
        );
        expect(buttonPair.getAttribute('right-button-text')).to.equal(
          'Skip adding an email',
        );

        expect(getByText('No contact email provided')).to.exist;
      });
    });

    it('reports a load event to analytics', async () => {
      const props = { recordEvent: sinon.spy() };
      const initialState = stateFn({ emailAddress: null });
      const { getByTestId } = render(<ProfileAlertConfirmEmail {...props} />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('profile-alert--add-contact-email');
        expect(props.recordEvent.calledWith('Add a contact email'));
      });
    });

    it(`renders when !emailAddress`, async () => {
      const initialState = stateFn({ emailAddress: null });
      const { getByTestId } = render(<ProfileAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('profile-alert--add-contact-email');
      });
    });

    it(`renders when emailAddress === ''`, async () => {
      const initialState = stateFn({ emailAddress: '' });
      const { getByTestId } = render(<ProfileAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('profile-alert--add-contact-email');
      });
    });

    it('renders nothing when !emailAddress and alert has been dismissed', async () => {
      dismissAlertViaCookie();
      const initialState = stateFn({ emailAddress: null });
      const { container } = render(<ProfileAlertConfirmEmail />, {
        initialState,
      });
      await waitFor(() => {
        expect(container).to.be.empty;
      });
      resetDismissAlertViaCookie();
    });

    it(`renders success when 'Skip...' button clicked, calls recordEvent`, async () => {
      const headline = 'Okay, we’ll skip adding a contact email for now';
      const props = { recordEvent: sinon.spy() };
      const initialState = stateFn({ emailAddress: null });
      const { container, getByRole, getByTestId, queryByTestId } = render(
        <ProfileAlertConfirmEmail {...props} />,
        {
          initialState,
        },
      );
      await waitFor(() => getByTestId('profile-alert--add-contact-email'));
      clickButtonPair(container, true);

      await waitFor(() => {
        getByTestId('mhv-alert--skip-success');
        getByRole('heading', {
          level: 3,
          name: new RegExp(headline),
        });
        expect(queryByTestId('profile-alert--add-contact-email')).to.be.null;
        expect(props.recordEvent.calledWith(headline));
      });
    });

    it(`navigates to the email address field when 'Add a contact email' button clicked`, async () => {
      const props = { recordEvent: sinon.spy() };
      const initialState = stateFn({ emailAddress: null });
      const { container, getByTestId } = render(
        <ProfileAlertConfirmEmail {...props} />,
        {
          initialState,
        },
      );
      await waitFor(() => getByTestId('profile-alert--add-contact-email'));
      clickButtonPair(container);

      await waitFor(() => {
        expect(
          dispatchSpy.calledWithMatch(
            sinon.match({ type: 'OPEN_MODAL', modal: 'email' }),
          ),
        ).to.be.true;
      });
    });
  });
});
