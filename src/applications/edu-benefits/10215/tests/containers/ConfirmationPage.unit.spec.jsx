import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { cleanup } from '@testing-library/react';
import { createStore } from 'redux';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import { mount } from 'enzyme';
import testData from '../fixtures/data/test-data.json';
import formConfig from '../../config/form';
import {
  ConfirmationPage,
  setClaimIdInLocalStage,
  getClaimIdFromLocalStage,
} from '../../containers/ConfirmationPage';

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
  it('passes the correct props to ConfirmationPageView', () => {
    const confirmationViewProps = wrapper.find('ConfirmationView').props();

    expect(confirmationViewProps.submitDate).to.equal(submitDate);
    expect(confirmationViewProps.confirmationNumber).to.equal('1234567890');
  });

  it('should select form from state when state.form is defined', () => {
    expect(wrapper.text()).to.includes(
      'Complete all submission stepsThis form requires additional steps for successful submission.',
    );
  });

  it('should print the page', () => {
    const printSpy = sinon.spy(window, 'print');

    expect(wrapper.find('[data-testid="print-page"]')).to.exist;
    wrapper.find('[data-testid="print-page"]').simulate('click');
    expect(printSpy.calledOnce).to.be.true;
    printSpy.restore();
  });
});
