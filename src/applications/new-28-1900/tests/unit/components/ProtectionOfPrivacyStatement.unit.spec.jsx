import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import ProtectionOfPrivacyStatement from '../../../components/PreSubmit/ProtectionOfPrivacyStatement';

describe('<ProtectionOfPrivacyStatement>', () => {
  const subject = ({ showError = false } = {}) => {
    const props = {
      children: null,
      formData: {},
      hasSubmittedForm: false,
      isChecked: false,
      onSectionComplete: f => f,
      setIsChecked: f => f,
      showError,
    };
    const { container } = render(<ProtectionOfPrivacyStatement {...props} />);
    const selectors = () => ({
      vaTextInput: container.querySelector(
        '[data-testid="privacy-agreement-checkbox"]',
      ),
    });
    return { selectors };
  };

  context('when an error has occurred', () => {
    it('should display the error message within the `va-checkbox` component', async () => {
      const { selectors } = subject({
        showError: true,
      });
      await waitFor(() =>
        expect(selectors().vaTextInput).to.have.attr('error'),
      );
    });
  });
});
