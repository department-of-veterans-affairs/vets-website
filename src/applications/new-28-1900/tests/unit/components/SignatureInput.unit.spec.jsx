import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { inputVaTextInput } from 'platform/testing/unit/helpers';
import SignatureInput from '../../../components/PreSubmit/SignatureInput';

describe('<SignatureInput>', () => {
  const fullName = 'John Smith';
  const label = 'Your full name';

  const subject = ({ showError = false } = {}) => {
    const props = {
      fullName,
      label,
      showError,
      hasSubmittedForm: false,
      required: true,
      setIsStatementOfTruthSigned: () => {},
    };
    const { container } = render(<SignatureInput {...props} />);
    const selectors = () => ({
      vaTextInput: container.querySelector('va-text-input'),
    });
    return { container, selectors };
  };

  context('when signature is correct', () => {
    it('should not display an error', async () => {
      const { container, selectors } = subject({ isChecked: true });
      const { vaTextInput } = selectors();

      await waitFor(() => {
        inputVaTextInput(container, fullName, vaTextInput);
        fireEvent.blur(vaTextInput);
      });

      await waitFor(() => {
        expect(vaTextInput).to.not.have.attr('error');
      });
    });
  });
});
