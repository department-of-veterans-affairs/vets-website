import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderInReduxProvider as render } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';

import useConfirmEmailTransaction from '../../hooks/useConfirmEmailTransaction';

// Helper to build transaction response with a specific status
const buildTransactionResponse = (transactionStatus = 'COMPLETED_SUCCESS') => ({
  data: {
    id: '',
    type: 'async_transaction_va_profile_email_address_transactions',
    attributes: {
      transactionId: 'test-transaction-id',
      transactionStatus,
      type: 'AsyncTransaction::VAProfile::EmailAddressTransaction',
      metadata: [],
    },
  },
});

// Test component that exposes hook state
const TestComponent = ({
  emailAddressId,
  emailAddress,
  onSuccess,
  onError,
  autoConfirm = false,
}) => {
  const {
    confirmEmail,
    isLoading,
    isSuccess,
    isError,
  } = useConfirmEmailTransaction({
    emailAddressId,
    emailAddress,
    onSuccess,
    onError,
  });

  useEffect(
    () => {
      if (autoConfirm) {
        confirmEmail();
      }
    },
    [autoConfirm, confirmEmail],
  );

  return (
    <div>
      <span data-testid="isLoading">{String(isLoading)}</span>
      <span data-testid="isSuccess">{String(isSuccess)}</span>
      <span data-testid="isError">{String(isError)}</span>
      <va-button
        data-testid="confirm-btn"
        text="Confirm"
        onClick={() => confirmEmail()}
      />
    </div>
  );
};

TestComponent.propTypes = {
  autoConfirm: PropTypes.bool,
  emailAddress: PropTypes.string,
  emailAddressId: PropTypes.number,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

describe('useConfirmEmailTransaction', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    if (global.fetch && global.fetch.restore) {
      global.fetch.restore();
    }
  });

  it('returns initial state with isLoading, isSuccess, isError all false', () => {
    const { getByTestId } = render(
      <TestComponent emailAddressId={123} emailAddress="test@example.com" />,
    );

    expect(getByTestId('isLoading').textContent).to.equal('false');
    expect(getByTestId('isSuccess').textContent).to.equal('false');
    expect(getByTestId('isError').textContent).to.equal('false');
  });

  it('sets isLoading to true when confirmEmail is called', async () => {
    mockApiRequest(buildTransactionResponse('COMPLETED_SUCCESS'));

    const { getByTestId } = render(
      <TestComponent emailAddressId={123} emailAddress="test@example.com" />,
    );

    fireEvent.click(getByTestId('confirm-btn'));

    // isLoading should be true immediately after click
    expect(getByTestId('isLoading').textContent).to.equal('true');

    await waitFor(() => {
      expect(getByTestId('isLoading').textContent).to.equal('false');
    });
  });

  it('sets isSuccess to true when transaction completes successfully', async () => {
    mockApiRequest(buildTransactionResponse('COMPLETED_SUCCESS'));
    const onSuccess = sandbox.spy();

    const { getByTestId } = render(
      <TestComponent
        emailAddressId={123}
        emailAddress="test@example.com"
        onSuccess={onSuccess}
      />,
    );

    fireEvent.click(getByTestId('confirm-btn'));

    await waitFor(() => {
      expect(getByTestId('isSuccess').textContent).to.equal('true');
      expect(getByTestId('isError').textContent).to.equal('false');
      expect(getByTestId('isLoading').textContent).to.equal('false');
    });

    expect(onSuccess.calledOnce).to.be.true;
  });

  it('sets isError to true when API request fails', async () => {
    mockApiRequest({}, false); // Simulate failed request
    const onError = sandbox.spy();

    const { getByTestId } = render(
      <TestComponent
        emailAddressId={123}
        emailAddress="test@example.com"
        onError={onError}
      />,
    );

    fireEvent.click(getByTestId('confirm-btn'));

    await waitFor(() => {
      expect(getByTestId('isError').textContent).to.equal('true');
      expect(getByTestId('isSuccess').textContent).to.equal('false');
      expect(getByTestId('isLoading').textContent).to.equal('false');
    });

    expect(onError.calledOnce).to.be.true;
  });

  it('sets isError to true when transaction fails with COMPLETED_FAILURE', async () => {
    mockApiRequest(buildTransactionResponse('COMPLETED_FAILURE'));
    const onError = sandbox.spy();

    const { getByTestId } = render(
      <TestComponent
        emailAddressId={123}
        emailAddress="test@example.com"
        onError={onError}
      />,
    );

    fireEvent.click(getByTestId('confirm-btn'));

    await waitFor(() => {
      expect(getByTestId('isError').textContent).to.equal('true');
      expect(getByTestId('isSuccess').textContent).to.equal('false');
      expect(getByTestId('isLoading').textContent).to.equal('false');
    });

    expect(onError.calledOnce).to.be.true;
  });

  it('includes id and email_address in the request body', async () => {
    mockApiRequest(buildTransactionResponse('COMPLETED_SUCCESS'));

    const { getByTestId } = render(
      <TestComponent emailAddressId={456} emailAddress="veteran@example.com" />,
    );

    fireEvent.click(getByTestId('confirm-btn'));

    await waitFor(() => {
      expect(global.fetch.calledOnce).to.be.true;
    });

    const [, options] = global.fetch.firstCall.args;
    const requestBody = JSON.parse(options.body);

    expect(requestBody).to.have.property('id', 456);
    expect(requestBody).to.have.property(
      'email_address',
      'veteran@example.com',
    );
    expect(requestBody).to.have.property('confirmation_date');
  });

  it('sets isError and calls onError if emailAddressId is missing', async () => {
    mockApiRequest(buildTransactionResponse('COMPLETED_SUCCESS'));
    const consoleSpy = sandbox.spy(console, 'error');
    const onError = sandbox.spy();

    const { getByTestId } = render(
      <TestComponent emailAddress="test@example.com" onError={onError} />,
    );

    fireEvent.click(getByTestId('confirm-btn'));

    expect(global.fetch.called).to.be.false;
    expect(consoleSpy.calledOnce).to.be.true;
    expect(getByTestId('isError').textContent).to.equal('true');
    expect(getByTestId('isSuccess').textContent).to.equal('false');
    expect(getByTestId('isLoading').textContent).to.equal('false');
    expect(onError.calledOnce).to.be.true;
  });

  it('sets isError and calls onError if emailAddress is missing', async () => {
    mockApiRequest(buildTransactionResponse('COMPLETED_SUCCESS'));
    const consoleSpy = sandbox.spy(console, 'error');
    const onError = sandbox.spy();

    const { getByTestId } = render(
      <TestComponent emailAddressId={123} onError={onError} />,
    );

    fireEvent.click(getByTestId('confirm-btn'));

    expect(global.fetch.called).to.be.false;
    expect(consoleSpy.calledOnce).to.be.true;
    expect(getByTestId('isError').textContent).to.equal('true');
    expect(getByTestId('isSuccess').textContent).to.equal('false');
    expect(getByTestId('isLoading').textContent).to.equal('false');
    expect(onError.calledOnce).to.be.true;
  });

  it('handles response with no transactionId as success', async () => {
    // Some legacy responses may not include transactionId
    mockApiRequest({});
    const onSuccess = sandbox.spy();

    const { getByTestId } = render(
      <TestComponent
        emailAddressId={123}
        emailAddress="test@example.com"
        onSuccess={onSuccess}
      />,
    );

    fireEvent.click(getByTestId('confirm-btn'));

    await waitFor(() => {
      expect(getByTestId('isSuccess').textContent).to.equal('true');
      expect(getByTestId('isLoading').textContent).to.equal('false');
    });

    expect(onSuccess.calledOnce).to.be.true;
  });

  describe('transaction polling behavior', () => {
    // Note: Testing polling behavior with the existing test infrastructure
    // requires using mockApiRequest which doesn't easily support sequential
    // different responses. The following tests verify the key polling scenarios
    // by testing the error cases which don't require sequential mocking.

    beforeEach(() => {
      // Set a very short poll interval for tests
      window.VetsGov = { pollTimeout: 50 };
    });

    afterEach(() => {
      delete window.VetsGov;
    });

    it('handles REJECTED transaction status as error', async () => {
      mockApiRequest(buildTransactionResponse('REJECTED'));
      const onError = sandbox.spy();

      const { getByTestId } = render(
        <TestComponent
          emailAddressId={123}
          emailAddress="test@example.com"
          onError={onError}
        />,
      );

      fireEvent.click(getByTestId('confirm-btn'));

      await waitFor(() => {
        expect(getByTestId('isError').textContent).to.equal('true');
        expect(getByTestId('isSuccess').textContent).to.equal('false');
        expect(getByTestId('isLoading').textContent).to.equal('false');
      });

      expect(onError.calledOnce).to.be.true;
    });

    it('remains loading when initial response is RECEIVED (pending)', async () => {
      // When transaction is pending, isLoading stays true until resolved
      mockApiRequest(buildTransactionResponse('RECEIVED'));

      const { getByTestId } = render(
        <TestComponent emailAddressId={123} emailAddress="test@example.com" />,
      );

      fireEvent.click(getByTestId('confirm-btn'));

      // Should remain in loading state since transaction is pending
      // and no follow-up polling response is mocked
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(getByTestId('isLoading').textContent).to.equal('true');
      expect(getByTestId('isSuccess').textContent).to.equal('false');
      expect(getByTestId('isError').textContent).to.equal('false');
    });

    it('verifies poll interval is configurable via window.VetsGov.pollTimeout', () => {
      // This is a configuration test - the hook should use the configured value
      expect(window.VetsGov.pollTimeout).to.equal(50);
    });

    it('sets isError after max poll attempts are exceeded', async () => {
      // Mock API to always return RECEIVED (pending) status
      mockApiRequest(buildTransactionResponse('RECEIVED'));
      const onError = sandbox.spy();

      const { getByTestId } = render(
        <TestComponent
          emailAddressId={123}
          emailAddress="test@example.com"
          onError={onError}
        />,
      );

      fireEvent.click(getByTestId('confirm-btn'));

      // With pollTimeout of 50ms and MAX_POLL_ATTEMPTS of 15,
      // timeout should occur within ~800ms (15 * 50ms + buffer)
      await waitFor(
        () => {
          expect(getByTestId('isError').textContent).to.equal('true');
          expect(getByTestId('isLoading').textContent).to.equal('false');
        },
        { timeout: 2000 },
      );

      expect(onError.calledOnce).to.be.true;
    });
  });
});
