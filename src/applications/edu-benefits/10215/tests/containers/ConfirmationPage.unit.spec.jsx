import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import {
  ConfirmationPage,
  setClaimIdInLocalStage,
  getClaimIdFromLocalStage,
} from '../../containers/ConfirmationPage';

const storeBase = {
  form: {
    submission: {
      timestamp: false,
      status: false,
    },
    data: {},
  },
};

describe('<ConfirmationPage>', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  const middleware = [thunk];
  const mockStore = configureStore(middleware);
  it('should set claim id in local stage', () => {
    const submission = {
      response: {
        id: 1,
      },
    };
    setClaimIdInLocalStage(submission);
    const result = getClaimIdFromLocalStage();
    expect(result).to.equal(submission.response.id);
  });
  it('should render with data', () => {
    const router = {
      push: () => {},
    };
    const { getByTestId } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage router={router} />
      </Provider>,
    );
    expect(getByTestId('download-link')).to.exist;
  });
  it('should call window.print when print button is clicked', () => {
    const printSpy = sinon.spy(window, 'print');
    const { getByTestId } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage />
      </Provider>,
    );
    fireEvent.click(getByTestId('print-page'));
    expect(printSpy.calledOnce).to.be.true;
    printSpy.restore();
  });
  it("should call router.push('/review-and-submit') when back button is clicked", () => {
    const router = {
      push: sinon.spy(),
    };
    const { getByTestId } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage router={router} />
      </Provider>,
    );
    fireEvent.click(getByTestId('back-button'));
    expect(router.push.calledOnce).to.be.true;
    expect(router.push.calledWith('/review-and-submit')).to.be.true;
  });
});
