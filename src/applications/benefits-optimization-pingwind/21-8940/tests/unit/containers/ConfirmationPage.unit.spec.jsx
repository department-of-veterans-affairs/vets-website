import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { format } from 'date-fns';
import { cleanup } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import formConfig from '../../../config/form';
import testData from '../../e2e/fixtures/data/maximal-test.json';

const submitDate = new Date();
const initialState = {
  form: {
    ...createInitialState(formConfig),
    data: testData.data,
    submission: {
      response: {
        confirmationNumber: '1234567890',
      },
      timestamp: submitDate,
    },
  },
};
const mockStore = state => createStore(() => state);

const mountPage = state => {
  const store = mockStore(state);
  return mount(
    <Provider store={store}>
      <ConfirmationPage route={{ formConfig }} />
    </Provider>,
  );
};

describe('ConfirmationPage', () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = mountPage(initialState);
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
});
