import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as recordEventModule from 'platform/monitoring/record-event';
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

  context('when the `va-checkbox` is clicked', () => {
    it('should fire the `recordEvent` method to log the interaction to analytics', async () => {
      const recordEventStub = sinon.stub(recordEventModule, 'default');
      const { props } = getData({});
      const { selectors } = subject({ props });

      await waitFor(() => {
        const { fullName, label, isRepresentative } = props;
        const event = {
          'caregivers-poa-certification-checkbox-checked': true,
          fullName,
          label,
          isRepresentative,
        };
        selectors().vaCheckbox.__events.vaChange({ target: { checked: true } });
        expect(recordEventStub.calledWith(event)).to.be.true;
        recordEventStub.restore();
      });
    });
  });

  context('when an error has occurred', () => {
    it('should display the error message within the `va-checkbox` component', () => {
      const { props } = getData({ showError: true });
      const { selectors } = subject({ props });
      expect(selectors().vaCheckbox).to.have.attr('error');
    });
  });
});
