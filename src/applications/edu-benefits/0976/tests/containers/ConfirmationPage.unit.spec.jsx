import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import { ConfirmationPage } from '../../containers/ConfirmationPage';

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
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    localStorage.clear();
  });

  afterEach(() => {
    sandbox.restore();
  });
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

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
    window.print = window.print || (() => {});
    const printSpy = sandbox.stub(window, 'print');
    const { container } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage />
      </Provider>,
    );
    fireEvent.click(
      container.querySelector(
        'va-button[text="Print this page for your records"]',
      ),
    );
    expect(printSpy.calledOnce).to.be.true;
  });

  it("should call router.push('/review-and-submit') when back button is clicked", () => {
    const router = {
      push: sandbox.spy(),
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
