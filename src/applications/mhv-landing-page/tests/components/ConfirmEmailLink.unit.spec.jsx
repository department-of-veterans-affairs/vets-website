import React from 'react';
import Cookies from 'js-cookie';
import { expect } from 'chai';
import sinon from 'sinon';
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

let sandbox;

describe('<ConfirmEmailLink />', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('renders', async () => {
    const recordEventFn = sandbox.spy();
    const props = { recordEvent: recordEventFn };
    const { getByTestId } = render(<ConfirmEmailLink {...props} />, {
      initialState: stateFn(),
    });
    await waitFor(() => {
      const component = getByTestId(testId);
      expect(component).to.exist;
      expect(component.link).to.equal(href);
      expect(component.text).to.match(textContent);
      expect(recordEventFn.calledOnce).to.be.true;
      expect(recordEventFn.calledTwice).to.be.false;
    });
  });

  it('renders when updatedAt is null', async () => {
    const recordEventFn = sandbox.spy();
    const props = { recordEvent: recordEventFn };
    const initialState = stateFn({ updatedAt: null });
    const { getByTestId } = render(<ConfirmEmailLink {...props} />, {
      initialState,
    });
    await waitFor(() => {
      const component = getByTestId(testId);
      expect(component).to.exist;
      expect(component.link).to.equal(href);
      expect(component.text).to.match(textContent);
      expect(recordEventFn.calledOnce).to.be.true;
      expect(recordEventFn.calledTwice).to.be.false;
    });
  });

  it('renders nothing when loading', async () => {
    const recordEventFn = sandbox.spy();
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
    const recordEventFn = sandbox.spy();
    const props = { recordEvent: recordEventFn };
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

  describe('When MHV_EMAIL_CONFIRMATION_DISMISSED cookie is set', () => {
    before(() => {
      Cookies.set('MHV_EMAIL_CONFIRMATION_DISMISSED', 'true');
    });
    after(() => {
      Cookies.remove('MHV_EMAIL_CONFIRMATION_DISMISSED');
    });
    it('renders nothing', async () => {
      const recordEventFn = sandbox.spy();
      const props = { recordEvent: recordEventFn };
      const { container } = render(<ConfirmEmailLink {...props} />, {});
      await waitFor(() => {
        expect(container).to.be.empty;
        expect(recordEventFn.calledOnce).to.be.false;
      });
    });
  });
});
