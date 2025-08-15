import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import { ERROR_MSG_INPUT_REP } from '../../../../components/PreSubmitInfo/StatementOfTruthItem';
import * as useSignaturesSyncModule from '../../../../hooks/useSignatureSync';
import PreSubmitInfo from '../../../../components/PreSubmitInfo';

const MOCK_FULL_NAME = { first: 'John', last: 'Smith' };

describe('CG <PreSubmitCheckboxGroup>', () => {
  let dispatch;
  let onSectionComplete;
  const subject = ({
    isRep = false,
    showError = false,
    status = false,
  } = {}) => {
    const props = {
      formData: {
        primaryFullName: MOCK_FULL_NAME,
        veteranFullName: MOCK_FULL_NAME,
        signAsRepresentativeYesNo: isRep ? 'yes' : 'no',
        'view:hasPrimaryCaregiver': true,
      },
      showError,
      onSectionComplete,
    };
    const mockStore = {
      getState: () => ({ form: { submission: { status } } }),
      subscribe: () => {},
      dispatch,
    };
    const { container, unmount } = render(
      <Provider store={mockStore}>
        <PreSubmitInfo.CustomComponent {...props} />
      </Provider>,
    );
    const selectors = () => ({
      vaStatementsOfTruth: container.querySelectorAll('va-statement-of-truth'),
    });
    return { container, selectors, unmount };
  };

  beforeEach(() => {
    dispatch = sinon.spy();
    onSectionComplete = sinon.spy();
  });

  afterEach(() => {
    dispatch.resetHistory();
    onSectionComplete.resetHistory();
  });

  it('should render error state for statement components when invalid', () => {
    const { selectors } = subject({ isRep: true, showError: true });
    const { vaStatementsOfTruth } = selectors();
    vaStatementsOfTruth.forEach(component => {
      expect(component).to.have.attr('checkbox-error');
    });
    expect(vaStatementsOfTruth[0]).to.have.attr(
      'input-error',
      ERROR_MSG_INPUT_REP,
    );
  });

  it('should dispatch `SET_DATA` on input change if submission is not pending', async () => {
    const { selectors } = subject();
    const { vaStatementsOfTruth } = selectors();
    const signatureBox = vaStatementsOfTruth[0];
    const fillInput = value => {
      signatureBox.__events.vaInputChange({ detail: { value } });
      signatureBox.__events.vaInputBlur();
    };

    await waitFor(() => {
      fillInput('Jack John');
      expect(signatureBox).to.have.attr('input-error');
      sinon.assert.calledWithMatch(dispatch.secondCall, {
        type: 'SET_DATA',
        data: { veteranSignature: 'Jack John' },
      });
    });

    await waitFor(() => {
      fillInput('John Smith');
      expect(signatureBox).to.not.have.attr('input-error');
      sinon.assert.calledWithMatch(dispatch.lastCall, {
        type: 'SET_DATA',
        data: { veteranSignature: 'John Smith' },
      });
    });
  });

  it('should not dispatch `SET_DATA` on input change if submission is pending', async () => {
    const { selectors } = subject({ status: 'submitPending' });
    const { vaStatementsOfTruth } = selectors();

    await waitFor(() => {
      const signatureBox = vaStatementsOfTruth[0];
      signatureBox.__events.vaInputChange({ detail: { value: 'Jack John' } });
    });

    sinon.assert.notCalled(dispatch);
  });

  it('should call `onSectionComplete(true)` when all statements are complete (not as representative)', async () => {
    const { selectors } = subject();
    const { vaStatementsOfTruth } = selectors();
    const completeSignatureBox = component => {
      component.__events.vaInputChange({ detail: { value: 'John Smith' } });
      component.__events.vaCheckboxChange({ detail: { checked: true } });
      component.__events.vaInputBlur();
    };

    await waitFor(() => completeSignatureBox(vaStatementsOfTruth[0]));
    await waitFor(() => completeSignatureBox(vaStatementsOfTruth[1]));

    sinon.assert.calledWith(onSectionComplete.lastCall, true);
  });

  it('should call `onSectionComplete(true)` when all statements are complete (as representative)', async () => {
    const { selectors } = subject({ isRep: true });
    const { vaStatementsOfTruth } = selectors();
    const completeSignatureBox = component => {
      component.__events.vaInputChange({ detail: { value: 'Jack Smith' } });
      component.__events.vaCheckboxChange({ detail: { checked: true } });
      component.__events.vaInputBlur();
    };

    await waitFor(() => completeSignatureBox(vaStatementsOfTruth[0]));
    await waitFor(() => completeSignatureBox(vaStatementsOfTruth[1]));

    sinon.assert.calledWith(onSectionComplete.lastCall, true);
  });

  it('should call `onSectionComplete(false)` on unmount', () => {
    const { unmount } = subject();
    unmount();
    sinon.assert.calledWith(onSectionComplete.lastCall, false);
  });

  it('should fallback to `DEFAULT_SIGNATURE_STATE` when there is a formData mismatch', () => {
    sinon.stub(useSignaturesSyncModule, 'useSignaturesSync').returns({
      requiredElements: [
        {
          label: 'Random',
          fullName: MOCK_FULL_NAME,
          statementText: ['Some text'],
        },
      ],
      signatures: {},
      setSignatures: sinon.spy(),
      signatureConfig: {},
    });

    const { selectors } = subject();
    const { vaStatementsOfTruth } = selectors();
    expect(vaStatementsOfTruth[0]).to.have.attr(
      'input-label',
      'Random full name',
    );

    sinon.restore();
  });
});
