import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import ConfirmationScreenView from '../../../../components/ConfirmationPage/ConfirmationScreenView';

// declare static values
const TIMESTAMP = 1666887649663;

describe('CG <ConfirmationScreenView>', () => {
  const subject = ({ timestamp = undefined } = {}) => {
    const props = {
      name: { first: 'John', middle: 'Marjorie', last: 'Smith', suffix: 'Sr.' },
      route: { formConfig: {} },
      timestamp,
    };
    const mockStore = {
      getState: () => ({
        form: {
          submission: {
            response: undefined,
            timestamp: undefined,
          },
          data: { veteranFullName: {} },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationScreenView {...props} />
      </Provider>,
    );
    const selectors = () => ({
      veteranName: container.querySelector(
        '[data-testid="cg-veteran-fullname"]',
      ),
      submissionDate: container.querySelector(
        '[data-testid="cg-submission-date"]',
      ),
      printBtn: container.querySelector('[data-testid="cg-print-button"]'),
    });
    return { selectors };
  };
  let printSpy;

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

  it('should render Veteran name & application date when provided', () => {
    const { selectors } = subject({ timestamp: TIMESTAMP });
    const { submissionDate } = selectors();
    expect(submissionDate).to.contain.text('Oct. 27, 2022');
  });

  it('should not render timestamp in `application information` section when not provided', () => {
    const { selectors } = subject();
    const { submissionDate } = selectors();
    expect(submissionDate).to.not.exist;
  });

  it('should fire the correct event when the print button is clicked', () => {
    const { selectors } = subject({ timestamp: TIMESTAMP });
    const { printBtn } = selectors();
    fireEvent.click(printBtn);
    sinon.assert.calledOnce(printSpy);
  });
});
