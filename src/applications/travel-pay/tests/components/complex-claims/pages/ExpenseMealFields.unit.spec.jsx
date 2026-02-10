import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ExpenseMealFields from '../../../../components/complex-claims/pages/ExpenseMealFields';
import { simulateVaInputBlur } from '../../../../util/testing-input-helpers';

describe('ExpenseMealFields', () => {
  const defaultProps = {
    formState: { vendorName: '' },
    onChange: sinon.spy(),
  };

  it('renders the vendorName input', () => {
    const { container } = render(<ExpenseMealFields {...defaultProps} />);

    const input = container.querySelector('va-text-input[name="vendorName"]');
    expect(input).to.exist;
    expect(input.getAttribute('label')).to.equal(
      'Where did you purchase the meal?',
    );
    expect(input.getAttribute('value')).to.equal('');
    expect(input.getAttribute('error')).to.be.null;
  });

  it('renders the vendorName input with a pre-filled value', () => {
    const { container } = render(
      <ExpenseMealFields
        {...defaultProps}
        formState={{ vendorName: 'Test Vendor' }}
      />,
    );

    const input = container.querySelector('va-text-input[name="vendorName"]');
    expect(input).to.exist;
    expect(input.getAttribute('value')).to.equal('Test Vendor');
  });

  it('renders the vendorName input with an error message', () => {
    const { container } = render(
      <ExpenseMealFields
        {...defaultProps}
        errors={{ vendorName: 'Vendor is required' }}
      />,
    );

    const input = container.querySelector('va-text-input[name="vendorName"]');
    expect(input).to.exist;
    expect(input.getAttribute('error')).to.equal('Vendor is required');
  });

  it('renders the vendorName input with an error message', () => {
    const { container } = render(
      <ExpenseMealFields
        {...defaultProps}
        errors={{ vendorName: 'Vendor is required' }}
      />,
    );

    const input = container.querySelector('va-text-input[name="vendorName"]');
    expect(input).to.exist;
    expect(input.getAttribute('error')).to.equal('Vendor is required');
  });

  it('calls onBlur when focusing out of the vendor field', async () => {
    const onBlurSpy = sinon.spy();
    const { container } = render(
      <ExpenseMealFields {...defaultProps} onBlur={onBlurSpy} />,
    );

    const vaInput = container.querySelector('va-text-input[name="vendorName"]');
    expect(vaInput).to.exist;

    simulateVaInputBlur(vaInput, 'New Vendor');

    await waitFor(() => {
      expect(onBlurSpy.called).to.be.true;
      const eventArg = onBlurSpy.firstCall.args[0];
      const value = eventArg?.detail?.value || eventArg?.target?.value;
      expect(value).to.equal('New Vendor');
    });
  });

  it('clears the error when input changes', async () => {
    const onBlurSpy = sinon.spy();
    const { container, rerender } = render(
      <ExpenseMealFields
        {...defaultProps}
        errors={{ vendorName: 'Vendor is required' }}
        onBlur={onBlurSpy}
      />,
    );

    const input = container.querySelector('va-text-input[name="vendorName"]');
    expect(input.getAttribute('error')).to.equal('Vendor is required');

    // Simulate input change
    simulateVaInputBlur(input, 'Updated Vendor');

    await waitFor(() => {
      expect(onBlurSpy.called).to.be.true;
      // Re-render with cleared error
      rerender(
        <ExpenseMealFields
          {...defaultProps}
          errors={{}}
          formState={{ vendorName: 'Updated Vendor' }}
          onBlur={onBlurSpy}
        />,
      );
      const updatedInput = container.querySelector(
        'va-text-input[name="vendorName"]',
      );
      expect(updatedInput.getAttribute('error')).to.be.null;
      expect(updatedInput.getAttribute('value')).to.equal('Updated Vendor');
    });
  });
});
