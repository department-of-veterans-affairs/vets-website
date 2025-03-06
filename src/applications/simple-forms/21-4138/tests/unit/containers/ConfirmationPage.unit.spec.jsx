import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { cleanup } from '@testing-library/react';
import { format } from 'date-fns';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import formConfig from '../../../config/form';

describe('ConfirmationPage', () => {
  let wrapper;
  let store;
  const mockStore = configureMockStore();
  const initialState = {
    form: {
      submission: {
        response: {
          confirmationNumber: '9876543210',
          pdfUrl: 'https://example.com/confirmation.pdf',
        },
        timestamp: '2023-05-15T12:34:56Z',
      },
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    cleanup();
  });

  it('passes the correct props to ConfirmationView', () => {
    const confirmationViewProps = wrapper.find('ConfirmationView').props();
    expect(confirmationViewProps.submitDate).to.equal('2023-05-15T12:34:56Z');
    expect(confirmationViewProps.confirmationNumber).to.equal('9876543210');
    expect(confirmationViewProps.pdfUrl).to.equal(
      'https://example.com/confirmation.pdf',
    );
  });

  it('should select form from state when state.form is defined', () => {
    const submitDate = new Date();
    const mockDefinedState = {
      form: {
        submission: {
          timestamp: submitDate,
          response: { confirmationNumber: '5678' },
        },
      },
    };
    const mockStoreDefined = createStore(() => mockDefinedState);
    const definedWrapper = mount(
      <Provider store={mockStoreDefined}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect(definedWrapper.text()).to.include(
      format(submitDate, 'MMMM d, yyyy'),
    );
    definedWrapper.unmount();
  });

  it('should throw an error when state.form is undefined', () => {
    const mockEmptyState = {};
    const mockEmptyStore = createStore(() => mockEmptyState);
    let errorWrapper;

    expect(() => {
      errorWrapper = mount(
        <Provider store={mockEmptyStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );
    }).to.throw();

    if (errorWrapper) {
      errorWrapper.unmount();
    }
  });
});
