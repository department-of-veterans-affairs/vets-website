import React from 'react';

import { expect } from 'chai';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { cleanup } from '@testing-library/react';
import { format } from 'date-fns';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import formConfig from '../../config/form';
import ConfirmationPage from '../../containers/ConfirmationPage';
import testData from '../e2e/fixtures/data/maximal-test.json';

describe('ConfirmationPage', () => {
  let wrapper;
  let store;
  const mockStore = configureMockStore();
  const initialState = {
    form: {
      ...createInitialState(formConfig),
      data: testData,
      submission: {
        response: {
          confirmationNumber: '1234567890',
        },
        timestamp: '2022-01-01T00:00:00Z',
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

  it('passes the correct props to ConfirmationPageView', () => {
    const confirmationViewProps = wrapper.find('ConfirmationView').props();

    expect(confirmationViewProps.submitDate).to.equal('2022-01-01T00:00:00Z');
    expect(confirmationViewProps.confirmationNumber).to.equal('1234567890');
  });

  it('should select form from state when state.form is defined', () => {
    const submitDate = new Date();
    const mockInitialState = {
      form: {
        ...createInitialState(formConfig),
        submission: {
          timestamp: submitDate,
          response: { confirmationNumber: '1234' },
        },
        data: testData,
      },
    };
    const mockDefinedState = createStore(() => mockInitialState);

    const definedWrapper = mount(
      <Provider store={mockDefinedState}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect(definedWrapper.text()).to.include(
      format(submitDate, 'MMMM d, yyyy'),
    );
    expect(definedWrapper.text()).to.include('1234');

    definedWrapper.unmount();
  });

  it('should throw error when state.form is undefined', () => {
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
