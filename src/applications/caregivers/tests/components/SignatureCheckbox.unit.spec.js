import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import SignatureCheckbox from '../../components/PreSubmitInfo/SignatureCheckbox';

const getData = ({ isRepresentative = false, label } = {}) => ({
  mockProps: {
    children: undefined,
    fullName: '',
    label,
    setSignatures: () => {},
    showError: false,
    submission: {},
    isRequired: false,
    isRepresentative,
  },
});

describe('10-10CG', () => {
  describe('SignatureCheckbox', () => {
    it('should render aria-describedby attribute when "isRepresentative" is true', () => {
      const label = 'test-label';
      const labelId = `${label}-signature-label`;
      const { mockProps } = getData({
        isRepresentative: true,
        label,
      });
      const view = render(<SignatureCheckbox {...mockProps} />);
      const inputComponent = view.container.querySelector('.signature-input');

      expect(inputComponent).to.have.attribute('aria-describedby', labelId);
    });

    it('should not render aria-describedby attribute when "isRepresentative" is false', () => {
      const label = 'test-label';
      const { mockProps } = getData({
        isRepresentative: false,
        label,
      });
      const view = render(<SignatureCheckbox {...mockProps} />);
      const inputComponent = view.container.querySelector('.signature-input');

      expect(inputComponent).to.not.have.attribute('aria-describedby');
    });
  });
});
