/* eslint-disable camelcase */
import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import ConfirmationScreenView from '../../../../components/ConfirmationPage/ConfirmationScreenView';

// declare static data values
const VETERAN_NAME = 'John Marjorie Smith Sr.';
const TIMESTAMP = 1666887649663;

describe('hca <ConfirmationScreenView>', () => {
  const subject = ({ timestamp = undefined, features = {} } = {}) => {
    const props = {
      name: VETERAN_NAME,
      form: {
        submission: { response: undefined, timestamp },
        data: { veteranFullName: {} },
      },
      timestamp,
    };
    const mockStore = {
      getState: () => ({
        featureToggles: features,
        form: {
          data: {
            'view:veteranInformation': {
              veteranFullName: { first: 'John', last: 'Smith' },
            },
          },
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
      veteranName: container.querySelector('.hca-veteran-fullname'),
      timestamp: container.querySelector('.hca-application-date'),
      printBtn: container.querySelector('va-button'),
      downloadLink: container.querySelector('.hca-application--download'),
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
    const { veteranName, timestamp } = selectors();
    expect(veteranName).to.contain.text(VETERAN_NAME);
    expect(timestamp).to.contain.text('Oct. 27, 2022');
  });

  it('should not render application date when submission timestamp value is `undefined`', () => {
    const { selectors } = subject();
    const { timestamp } = selectors();
    expect(timestamp).to.not.exist;
  });

  it('should fire the correct event when the print button is clicked', () => {
    const { selectors } = subject({ timestamp: TIMESTAMP });
    const { printBtn } = selectors();
    fireEvent.click(printBtn);
    sinon.assert.calledOnce(printSpy);
  });
});
