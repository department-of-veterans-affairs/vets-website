import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import { ConfirmationPage } from '../../containers/ConfirmationPage';

const storeBase = {
  form: {
    submission: {
      timestamp: '2024-01-02T03:04:05.067Z',
      response: {
        confirmationNumber: '123456',
        pdfUrl: '',
      },
    },
    data: {
      fullName: {
        first: 'John',
        middle: '',
        last: 'Doe',
        suffix: '',
      },
    },
  },
};

describe('<ConfirmationPage>', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('should render with data', () => {
    const router = {
      push: () => {},
    };
    const { container } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage router={router} />
      </Provider>,
    );
    expect(container).to.exist;
  });
  it('should show Alert if school is not accredited', () => {
    const router = {
      push: () => {},
    };
    const { container } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage isAccredited={false} router={router} />
      </Provider>,
    );
    expect($('#additional-form-needed-alert', container)).to.exist;
  });
  it("should show the text 'form' if the school is accredited", () => {
    global.localStorage.setItem('isAccredited', 'true');
    const { getByTestId } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage />
      </Provider>,
    );

    expect(getByTestId('confirmation-header').textContent).to.equal(
      'To submit your form, follow the steps below',
    );
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
