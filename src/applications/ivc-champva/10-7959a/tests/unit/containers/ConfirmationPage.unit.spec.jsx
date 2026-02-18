import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import ConfirmationPage from '../../../containers/ConfirmationPage';

const MOCK_FORM_DATA = {
  applicantName: { first: 'Jack', middle: 'W', last: 'Smith' },
  signature: 'Jack W Smith',
};

const MOCK_SUBMISSION = {
  timestamp: Date.UTC(2010, 0, 1, 12, 0, 0),
  id: '3702390024',
};

describe('10-7959a ConfirmationPage', () => {
  let printSpy;

  const subject = ({ submission = MOCK_SUBMISSION } = {}) => {
    const mockStore = {
      getState: () => ({ form: { submission, data: MOCK_FORM_DATA } }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage />
      </Provider>,
    );
    const getPrintBtn = () => container.querySelector('va-button');
    const getSubmissionDate = () =>
      container.querySelector('[data-dd-action-name="Submission date"]');
    return { getPrintBtn, getSubmissionDate };
  };

  beforeEach(() => {
    printSpy = sinon.spy();
    Object.defineProperty(window, 'print', {
      value: printSpy,
      configurable: true,
    });
  });

  afterEach(() => {
    printSpy.resetHistory();
  });

  it('should not render submission date container when there is no response data', () => {
    const { getSubmissionDate } = subject({ submission: { timestamp: false } });
    expect(getSubmissionDate()).to.not.exist;
  });

  it('should render application date container when there is response data', () => {
    const { getSubmissionDate } = subject();
    const expectedResult = 'January 1, 2010';
    expect(getSubmissionDate()).to.contain.text(expectedResult);
  });

  it('should fire the correct event when the print button is clicked', () => {
    const { getPrintBtn } = subject();
    fireEvent.click(getPrintBtn());
    sinon.assert.calledOnce(printSpy);
  });
});
