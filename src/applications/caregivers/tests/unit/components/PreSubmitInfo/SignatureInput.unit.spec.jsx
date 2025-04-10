import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { inputVaTextInput } from 'platform/testing/unit/helpers';
import SignatureInput from '../../../../components/PreSubmitInfo/SignatureInput';
import { replaceStrValues } from '../../../../utils/helpers';
import content from '../../../../locales/en/content.json';

describe('CG <SignatureInput>', () => {
  const fullName = 'John Smith';
  const label = 'Veteran\u2019s';
  const handleChangeSpy = sinon.spy();
  const subject = ({
    showError = false,
    isChecked = false,
    isRepresentative = false,
  } = {}) => {
    const props = {
      fullName,
      label,
      showError,
      isChecked,
      isRepresentative,
      setSignatures: sinon.stub().callsFake(updateFn => {
        handleChangeSpy(updateFn({}));
      }),
    };
    const { container } = render(<SignatureInput {...props} />);
    const selectors = () => ({
      vaTextInput: container.querySelector('va-text-input'),
    });
    return { container, selectors };
  };

  afterEach(() => {
    handleChangeSpy.reset();
  });

  context('when a representative is signing for the Veteran', () => {
    it('should set the appropriate data no error has occurred', async () => {
      const { container, selectors } = subject({
        isChecked: true,
        isRepresentative: true,
      });
      const { vaTextInput } = selectors();

      await waitFor(() => {
        inputVaTextInput(container, 'Mary Smith', vaTextInput);
        fireEvent.blur(vaTextInput);
      });

      await waitFor(() => {
        expect(vaTextInput).to.not.have.attr('error');
        expect(handleChangeSpy.calledWithMatch({ [label]: 'Mary Smith' })).to.be
          .true;
      });
    });

    it('should render the appropriate message when an error has occurred', async () => {
      const { container, selectors } = subject({
        showError: true,
        isRepresentative: true,
      });
      const { vaTextInput } = selectors();
      await waitFor(() => {
        inputVaTextInput(container, 'Mary Smith', vaTextInput);
        expect(vaTextInput).to.have.attr(
          'error',
          content['validation-sign-as-rep'],
        );
      });
    });
  });

  context('when the Veteran is signing for themselves', () => {
    it('should set the appropriate data when the signature matches', async () => {
      const { container, selectors } = subject({ isChecked: true });
      const { vaTextInput } = selectors();

      await waitFor(() => {
        inputVaTextInput(container, fullName, vaTextInput);
        fireEvent.blur(vaTextInput);
      });

      await waitFor(() => {
        expect(vaTextInput).to.not.have.attr('error');
        expect(handleChangeSpy.calledWithMatch({ [label]: fullName })).to.be
          .true;
      });
    });

    it('should render the appropriate error message on signature mismatch', async () => {
      const { container, selectors } = subject({ showError: true });
      const { vaTextInput } = selectors();
      const error = replaceStrValues(
        content['validation-sign-as-rep--vet-name'],
        fullName,
      );

      await waitFor(() => {
        inputVaTextInput(container, 'Mary Smith', vaTextInput);
      });

      await waitFor(() => {
        expect(vaTextInput).to.have.attr('error', error);
        expect(handleChangeSpy.calledWithMatch({ [label]: '' })).to.be.true;
      });
    });
  });
});
