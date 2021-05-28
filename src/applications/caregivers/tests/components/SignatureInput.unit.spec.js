import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import SignatureInput from '../../components/PreSubmitInfo/SignatureInput';

const getData = ({ ariaDescribedBy, isRepresentative = false } = {}) => ({
  mockProps: {
    fullName: '',
    label: '',
    isChecked: false,
    showError: false,
    hasSubmittedForm: false,
    setSignatures: () => {},
    isRepresentative,
    ariaDescribedBy,
    required: false,
  },
});

describe('10-10CG', () => {
  describe('SignatureInput', () => {
    it('should render aria-describedby attribute', () => {
      const ariaDescribedBy = 'test-id';
      const { mockProps } = getData({
        ariaDescribedBy,
        isRepresentative: true,
      });
      const view = render(<SignatureInput {...mockProps} />);

      expect(
        view.getByLabelText(
          'Enter your name to sign as the Veteran’s representative',
        ),
      ).to.have.attribute('aria-describedby', ariaDescribedBy);
    });
  });
});
