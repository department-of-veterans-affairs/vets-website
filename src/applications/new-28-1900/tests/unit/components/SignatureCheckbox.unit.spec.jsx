import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import SignatureCheckbox from '../../../components/PreSubmit/SignatureCheckbox';

describe('CG <SignatureCheckbox>', () => {
  const subject = ({ showError = false } = {}) => {
    const props = {
      children: null,
      fullName: { first: 'John', middle: 'G', last: 'Smith', suffix: 'Jr.' },
      label: 'test-label',
      setIsStatementOfTruthSigned: f => f,
      setIsStatementOfTruthCertified: f => f,
      isRequired: true,
      submission: {},
      showError,
    };
    const { container } = render(<SignatureCheckbox {...props} />);
    const selectors = () => ({
      vaTextInput: container.querySelector('.signature-input'),
      vaCheckbox: container.querySelector('.signature-checkbox'),
    });
    return { selectors };
  };

  context('when an error has occurred', () => {
    it('should display the error message within the `va-checkbox` component', async () => {
      const { selectors } = subject({
        showError: true,
      });
      await waitFor(() => expect(selectors().vaCheckbox).to.have.attr('error'));
    });
  });
});
