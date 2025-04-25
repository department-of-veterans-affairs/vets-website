import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import SignatureCheckbox from '../../../../components/PreSubmitInfo/SignatureCheckbox';

describe('CG <SignatureCheckbox>', () => {
  const subject = ({ isRepresentative = true, showError = false } = {}) => {
    const props = {
      children: undefined,
      fullName: { first: 'John', middle: '', last: 'Smith' },
      label: 'test-label',
      setSignatures: f => f,
      isRequired: false,
      submission: {},
      showError,
      isRepresentative,
    };
    const { container } = render(<SignatureCheckbox {...props} />);
    const selectors = () => ({
      repLabel: container.querySelector('.signature-box--representative'),
      vaTextInput: container.querySelector('.signature-input'),
      vaCheckbox: container.querySelector('.signature-checkbox'),
    });
    return { selectors };
  };

  context('when `isRepresentative` is `true`', () => {
    it('should render input with the `message-aria-describedby` attribute', () => {
      const { selectors } = subject();
      expect(selectors().vaTextInput).to.have.attr('message-aria-describedby');
    });

    it('should render `on behalf of` label', () => {
      const { selectors } = subject();
      expect(selectors().repLabel).to.exist;
    });
  });

  context('when an error has occurred', () => {
    it('should display the error message within the `va-checkbox` component', async () => {
      const { selectors } = subject({
        isRepresentative: false,
        showError: true,
      });
      await waitFor(() => expect(selectors().vaCheckbox).to.have.attr('error'));
    });
  });
});
