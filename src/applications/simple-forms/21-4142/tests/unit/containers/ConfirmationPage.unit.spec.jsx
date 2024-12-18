import React from 'react';

import { expect } from 'chai';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { cleanup } from '@testing-library/react';
import { format } from 'date-fns';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import formConfig from '../../../config/form';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import testData from '../../e2e/fixtures/data/maximal-test.json';

describe('ConfirmationPage', () => {
  let wrapper;
  let store;
  const mockStore = configureMockStore();
  const initialState = {
    form: {
      formId: formConfig.formId,
      submission: {
        response: { confirmationNumber: '123456' },
        timestamp: Date.now(),
      },
      data: {
        veteran: { fullName: { first: 'Jack', middle: 'W', last: 'Witness' } },
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

    expect(confirmationViewProps.submitDate).to.equal(
      format(initialState.form.submission.timestamp, 'yyyy-MM-dd'),
    );
    expect(confirmationViewProps.confirmationNumber).to.equal(
      initialState.form.submission.response.confirmationNumber,
    );
  });

  it('should select form from state when state.form is defined', () => {
    const submitDate = new Date();
    const mockInitialState = {
      form: {
        submission: {
          timestamp: submitDate,
          response: { confirmationNumber: '1234' },
        },
        data: {
          ...createInitialState(formConfig),
          ...testData.data,
        },
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
