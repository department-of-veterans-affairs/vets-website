import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderInReduxProvider as render } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import ConfirmEmailLink, {
  EMAIL_UPDATED_AT_THRESHOLD,
} from '../../components/ConfirmEmailLink';

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

const testId = 'va-profile--confirm-contact-email-link';
const href = '/profile/contact-information#contact-email-address';
const textContent = /^Confirm your contact email address/;

describe('<ConfirmEmailLink />', () => {
  it('renders', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    const { getByTestId } = render(<ConfirmEmailLink {...props} />, {
      initialState: stateFn(),
    });
    await waitFor(() => {
      const component = getByTestId(testId);
      expect(component).to.exist;
      expect(component.link).to.equal(href);
      expect(component.text).to.match(textContent);
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });

  it('renders when updatedAt is null', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    const initialState = stateFn({ updatedAt: null });
    const { getByTestId } = render(<ConfirmEmailLink {...props} />, {
      initialState,
    });
    await waitFor(() => {
      const component = getByTestId(testId);
      expect(component).to.exist;
      expect(component.link).to.equal(href);
      expect(component.text).to.match(textContent);
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });

  it('renders nothing when loading', async () => {
    const recordEventFn = sinon.spy();
    const props = { recordEventFn };
    const initialState = stateFn({ loading: true });
    const { container } = render(<ConfirmEmailLink {...props} />, {
      initialState,
    });
    await waitFor(() => {
      expect(container).to.be.empty;
      expect(recordEventFn.calledOnce).to.be.false;
    });
  });

  it(`renders nothing when email was updated after ${EMAIL_UPDATED_AT_THRESHOLD}`, async () => {
    const recordEventFn = sinon.spy();
    const props = { recordEventFn };
    const initialState = stateFn({
      updatedAt: '2025-09-08T12:00:00.000+00:00',
    });
    const { container } = render(<ConfirmEmailLink {...props} />, {
      initialState,
    });
    await waitFor(() => {
      expect(container).to.be.empty;
      expect(recordEventFn.calledOnce).to.be.false;
    });
  });
});
