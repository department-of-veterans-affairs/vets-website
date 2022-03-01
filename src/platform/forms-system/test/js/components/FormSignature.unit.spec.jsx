import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { spy } from 'sinon';

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
      const { getByLabelText } = render(<FormSignature {...signatureProps} />);
      expect(getByLabelText('Veteran’s full name')).to.exist;
    });

    it('should render input with custom string label', () => {
      const { getByLabelText } = render(
        <FormSignature {...signatureProps} signatureLabel="Custom text here" />,
      );
      expect(getByLabelText('Custom text here')).to.exist;
    });

    it('should render input input with custom React element label', () => {
      const customLabel = <span>Custom text here</span>;
      const { getByLabelText } = render(
        <FormSignature {...signatureProps} signatureLabel={customLabel} />,
      );
      expect(getByLabelText('Custom text here')).to.exist;
    });
  });

  describe('certification checkbox', () => {
    it('should render with default label', () => {
      const { getByLabelText } = render(<FormSignature {...signatureProps} />);
      expect(
        getByLabelText(
          'I certify the information above is correct and true to the best of my knowledge and belief.',
        ),
      ).to.exist;
    });

    it('should render with custom string label', () => {
      const { getByLabelText } = render(
        <FormSignature {...signatureProps} checkboxLabel="LGTM" />,
      );
      expect(getByLabelText('LGTM')).to.exist;
    });

    it('should render with custom React element label', () => {
      const customLabel = <span>Custom text here</span>;
      const { getByLabelText } = render(
        <FormSignature {...signatureProps} checkboxLabel={customLabel} />,
      );
      expect(getByLabelText('Custom text here')).to.exist;
    });
  });

  describe('validation', () => {
    it.skip('should require signature and certification', () => {
      const { getByText } = render(
        <FormSignature {...signatureProps} required />,
      );
      expect(getByText(inputErrorText)).to.exist;
      expect(getByText(checkboxErrorText)).to.exist;
    });

    it('should not show validation errors when showError is false', () => {
      const { queryByText } = render(
        <FormSignature {...signatureProps} showError={false} required />,
      );
      expect(queryByText(inputErrorText)).to.not.exist;
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
      const { getByLabelText } = render(
        <FormSignature
          {...signatureProps}
          required
          onSectionComplete={oscSpy}
        />,
      );
      // Not called on first render
      expect(oscSpy.called).to.be.false;
      const checkbox = getByLabelText(
        /I certify the information above is correct/,
      );

      // Not called if there are validation errors (required name isn't entered)
      userEvent.click(checkbox);
      expect(oscSpy.called).to.be.false;

      // Uncheck box
      userEvent.click(checkbox);

      // Not called if the box isn't checked
      userEvent.type(getByLabelText(/Veteran’s full name/), 'asdf');
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
