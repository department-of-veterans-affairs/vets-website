import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import SignatureCheckbox from '../../../../components/PreSubmitInfo/SignatureCheckbox';

describe('CG <SignatureCheckbox>', () => {
  const getData = ({ isRepresentative = false, showError = false } = {}) => ({
    props: {
      children: undefined,
      fullName: {
        first: 'John',
        middle: '',
        last: 'Smith',
      },
      label: 'test-label',
      setSignatures: () => {},
      submission: {},
      showError,
      isRequired: false,
      isRepresentative,
    },
  });
  const subject = ({ props }) => {
    const { container } = render(<SignatureCheckbox {...props} />);
    const selectors = () => ({
      repLabel: container.querySelector('.signature-box--representative'),
      vaTextInput: container.querySelector('.signature-input'),
      vaCheckbox: container.querySelector('.signature-checkbox'),
    });
    return { container, selectors };
  };

  context('when `isRepresentative` is `true`', () => {
    const { props } = getData({ isRepresentative: true });

    it('should render input with the `message-aria-describedby` attribute', () => {
      const { selectors } = subject({ props });
      expect(selectors().vaTextInput).to.have.attr('message-aria-describedby');
    });

    it('should render `on behalf of` label', () => {
      const { selectors } = subject({ props });
      expect(selectors().repLabel).to.exist;
    });
  });

  context('when an error has occurred', () => {
    it('should display the error message within the `va-checkbox` component', async () => {
      const { props } = getData({ showError: true });
      const { selectors } = subject({ props });
      await waitFor(() => {
        expect(selectors().vaCheckbox).to.have.attr('error');
      });
    });
  });
});
