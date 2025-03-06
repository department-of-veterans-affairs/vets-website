import React from 'react';

import { expect } from 'chai';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { cleanup } from '@testing-library/react';
import { format } from 'date-fns';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import formConfig from '../../../config/form';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import testData from '../../e2e/fixtures/data/user.json';

const submitDate = new Date();
const initialState = {
  form: {
    ...createInitialState(formConfig),
    testData,
    submission: {
      response: {
        confirmationNumber: '1234567890',
      },
      timestamp: submitDate,
    },
  },
};
const mockStore = state => createStore(() => state);

const mountPage = (state = initialState) => {
  const safeState = {
    form: {
      submission: {
        response: { confirmationNumber: '1234567890', pdfUrl: '' },
        timestamp: '',
      },
      ...state.form,
    },
  };

  const store = mockStore(safeState);
  return mount(
    <Provider store={store}>
      <ConfirmationPage route={{ formConfig }} />
    </Provider>,
  );
};

describe('ConfirmationPage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountPage();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    cleanup();
  });

  it('passes the correct props to ConfirmationPageView', () => {
    const confirmationViewProps = wrapper.find('ConfirmationView').props();

    expect(confirmationViewProps.submitDate).to.equal(submitDate);
    expect(confirmationViewProps.confirmationNumber).to.equal('1234567890');
  });

  it('should select form from state when state.form is defined', () => {
    expect(wrapper.text()).to.include(format(submitDate, 'MMMM d, yyyy'));
    expect(wrapper.text()).to.include('1234');
  });

  it('should throw error when state.form is undefined', () => {
    expect(() => {
      mountPage({ form: {} });
    }).to.throw();
  });
});
