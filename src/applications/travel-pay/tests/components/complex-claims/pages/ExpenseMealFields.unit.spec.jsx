import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ExpenseMealFields from '../../../../components/complex-claims/pages/ExpenseMealFields';

describe('ExpenseMealFields', () => {
  const defaultProps = {
    formState: { vendor: '' },
    onChange: sinon.spy(),
  };

  it('renders the vendor input', () => {
    const { container } = render(<ExpenseMealFields {...defaultProps} />);

    const input = container.querySelector('va-text-input[name="vendor"]');
    expect(input).to.exist;
    expect(input.getAttribute('label')).to.equal(
      'Where did you purchase the meal?',
    );
    expect(input.getAttribute('value')).to.equal('');
  });

  it('renders the vendor input with a pre-filled value', () => {
    const { container } = render(
      <ExpenseMealFields
        {...defaultProps}
        formState={{ vendor: 'Test Vendor' }}
      />,
    );

    const input = container.querySelector('va-text-input[name="vendor"]');
    expect(input).to.exist;
    expect(input.getAttribute('value')).to.equal('Test Vendor');
  });

  // Updated to use direct event dispatching - testing if Node 22 compatibility issue is resolved
  it('calls onChange when typing into the input', async () => {
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseMealFields {...defaultProps} onChange={onChangeSpy} />,
    );

    const vaInput = container.querySelector('va-text-input[name="vendor"]');
    expect(vaInput).to.exist;

    // Simulate the input change using platform's recommended approach
    vaInput.value = 'New Vendor';

    // Dispatch InputEvent as recommended by platform helpers
    const inputEvent = new window.InputEvent('input', {
      bubbles: true,
      composed: true,
      data: 'New Vendor',
    });
    vaInput.dispatchEvent(inputEvent);

    // Also dispatch CustomEvent for compatibility
    vaInput.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: 'New Vendor' },
        bubbles: true,
        composed: true,
      }),
    );

    await waitFor(() => {
      expect(onChangeSpy.called).to.be.true;
      const eventArg = onChangeSpy.firstCall.args[0];
      const value = eventArg?.detail?.value || eventArg?.target?.value;
      expect(value).to.equal('New Vendor');
    });
  });
});
