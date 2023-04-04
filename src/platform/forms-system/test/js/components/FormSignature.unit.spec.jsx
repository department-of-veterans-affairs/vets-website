import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { spy } from 'sinon';
import { axeCheck } from 'platform/forms-system/test/config/helpers';

import { FormSignature } from '../../../src/js/components/FormSignature';

describe('Forms library - Forms signature component', () => {
  const signatureProps = {
    formData: { name: 'Foo' },
    onSectionComplete: () => {},
    setFormData: () => {},
    showError: true,
    required: false,
  };

  const checkboxErrorText =
    'Please check the box to certify the information is correct';
  const inputErrorText = 'Please enter your name';

  describe('signature input', () => {
    it('should render input with default label', () => {
      const { container } = render(<FormSignature {...signatureProps} />);
      expect(
        container.querySelector('va-text-input').getAttribute('label'),
      ).to.equal('Veteran’s full name');
    });

    it('should render input with custom string label', () => {
      const { container } = render(
        <FormSignature {...signatureProps} signatureLabel="Custom text here" />,
      );
      expect(
        container.querySelector('va-text-input').getAttribute('label'),
      ).to.equal('Custom text here');
    });

    it('should pass axeCheck', () => {
      axeCheck(<FormSignature />);
    });
  });

  describe('certification checkbox', () => {
    it('should render with default label', () => {
      const { container } = render(<FormSignature {...signatureProps} />);

      expect(
        container.querySelector('va-checkbox').getAttribute('label'),
      ).to.equal(
        'I certify the information above is correct and true to the best of my knowledge and belief.',
      );
    });

    it('should render with custom string label', () => {
      const { container } = render(
        <FormSignature {...signatureProps} checkboxLabel="LGTM" />,
      );

      expect(
        container.querySelector('va-checkbox').getAttribute('label'),
      ).to.equal('LGTM');
    });

    it('should render with custom React element label', () => {
      const customLabel = 'Custom text here';
      const customDescription = (
        <span id="custom-description">Custom description</span>
      );
      const { container } = render(
        <FormSignature
          {...signatureProps}
          checkboxLabel={customLabel}
          checkboxDescription={customDescription}
        />,
      );
      const checkbox = container.querySelector('va-checkbox');

      expect(checkbox.getAttribute('label')).to.equal(customLabel);
      expect(checkbox.querySelector('#custom-description').innerHTML).to.equal(
        'Custom description',
      );
    });
  });

  describe('validation', () => {
    it('should require signature and certification', () => {
      const { container } = render(
        <FormSignature {...signatureProps} required />,
      );
      expect(
        container.querySelector('va-text-input').getAttribute('required'),
      ).to.equal('true');
    });

    it('should not show validation errors when showError is false', () => {
      const { container, queryByText } = render(
        <FormSignature {...signatureProps} showError={false} required />,
      );
      expect(container.querySelector('va-text-input').getAttribute('error')).to
        .not.exist;
      expect(queryByText(checkboxErrorText)).to.not.exist;
    });

    it.skip('should dismiss validation errors after resolution', () => {
      const { queryByText } = render(
        <FormSignature {...signatureProps} required />,
      );
      userEvent.type(queryByText(/Veteran’s full name/), 'Curious George');
      userEvent.click(
        queryByText(/I certify the information above is correct/),
      );
      expect(queryByText(inputErrorText)).to.not.exist;
      expect(queryByText(checkboxErrorText)).to.not.exist;
    });

    it.skip('should perform data validations if present', () => {
      const validationSpies = [spy(() => 'Example error'), spy()];
      render(
        <FormSignature {...signatureProps} validations={validationSpies} />,
      );
      expect(validationSpies[0].calledWithExactly('', signatureProps.formData))
        .to.be.true;

      // Subsequent validation functions don't get run if previous validators
      // return an error message
      expect(validationSpies[1].called).to.be.false;
    });

    it.skip('should show error messages from validation functions', () => {
      const validationSpies = [spy(() => 'Example error'), spy()];
      const { getByText } = render(
        <FormSignature {...signatureProps} validations={validationSpies} />,
      );
      expect(getByText('Example error')).to.exist;
    });
  });

  describe('behavior', () => {
    it.skip('should call onSectionComplete when the signature is valid', () => {
      // "Valid" here means:
      //   - There are no validation errors
      //   - The checkbox has been checked
      const oscSpy = spy();
      const { getByLabelText } = render(
        <FormSignature
          {...signatureProps}
          required
          onSectionComplete={oscSpy}
        />,
      );
      expect(oscSpy.called).to.be.false;

      userEvent.type(getByLabelText(/Veteran’s full name/), 'asdf');
      userEvent.click(
        getByLabelText(/I certify the information above is correct/),
      );

      expect(oscSpy.called).to.be.true;
    });

    it('should NOT call onSectionComplete when the signature is INVALID', () => {
      // "Valid" here means:
      //   - There are no validation errors
      //   - The checkbox has been checked
      const oscSpy = spy();
      const { container } = render(
        <FormSignature
          {...signatureProps}
          required
          onSectionComplete={oscSpy}
        />,
      );
      // Not called on first render
      expect(oscSpy.called).to.be.false;

      const checkbox = container.querySelector('va-checkbox');

      // Not called if there are validation errors (required name isn't entered)
      userEvent.click(checkbox);
      expect(oscSpy.called).to.be.false;

      // Uncheck box
      userEvent.click(checkbox);

      // Not called if the box isn't checked
      userEvent.type(
        container.querySelector('va-text-input').getAttribute('label'),
        'asdf',
      );
      expect(oscSpy.called).to.be.false;
    });

    it.skip('should call setFormData when the name is entered', () => {
      const sfdSpy = spy();
      const { getByLabelText } = render(
        <FormSignature {...signatureProps} setFormData={sfdSpy} />,
      );
      userEvent.type(getByLabelText(/Veteran’s full name/), 'asdf');

      expect(
        sfdSpy.calledWith({
          ...signatureProps.formData,
          signature: 'asdf',
        }),
      ).to.be.true;
    });
  });
});
