import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderInReduxProvider as render } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import AlertConfirmContactEmail from '../../../components/alerts/AlertConfirmContactEmail';

const stateFn = ({
  loading = false,
  updatedAt = '2022-01-31T12:00:00.000+00:00',
} = {}) => ({
  user: {
    profile: {
      loading,
      vapContactInfo: {
        email: {
          updatedAt,
        },
      },
    },
  },
});

const testId = 'va-profile--alert-confirm-contact-email';

describe('<AlertConfirmContactEmail />', () => {
  it('renders "Confirm you contact email" h2', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    const { getByTestId, getByText } = render(
      <AlertConfirmContactEmail {...props} />,
      {
        initialState: stateFn(),
      },
    );
    const h2Content = /Confirm your contact email/;
    const pContent = /We’ll send notifications about your VA health care/;
    await waitFor(() => {
      expect(getByTestId(testId)).to.exist;
      expect(getByText(h2Content)).to.exist;
      expect(getByText(pContent)).to.exist;
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });

  it('renders "Add a contact email" h2', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    const { getByTestId, getByText } = render(
      <AlertConfirmContactEmail {...props} />,
      {
        initialState: stateFn({ updatedAt: null }),
      },
    );
    const h2Content = /Add a contact email/;
    const pContent = /We’ll send notifications about your VA health care/;
    await waitFor(() => {
      expect(getByTestId(testId)).to.exist;
      expect(getByText(h2Content)).to.exist;
      expect(getByText(pContent)).to.exist;
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });

  it('renders nothing when user.profile.loading', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    const initialState = stateFn({ loading: true });
    const { getByTestId } = render(<AlertConfirmContactEmail {...props} />, {
      initialState,
    });
    await waitFor(() => {
      const component = getByTestId(testId);
      expect(component.getAttribute('visible')).to.equal('false');
      expect(recordEvent.calledOnce).to.be.false;
    });
  });

  it('renders nothing when user.profile.vapContactInfo.email.updatedAt is after EMAIL_UPDATED_AT_THRESHOLD', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    const initialState = stateFn({
      updatedAt: '2025-09-09T12:00:00.000+00:00',
    });
    const { getByTestId } = render(<AlertConfirmContactEmail {...props} />, {
      initialState,
    });
    await waitFor(() => {
      const component = getByTestId(testId);
      expect(component.getAttribute('visible')).to.equal('false');
      expect(recordEvent.calledOnce).to.be.false;
    });
  });
});
