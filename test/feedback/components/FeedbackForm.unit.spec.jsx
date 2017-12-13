import React from 'react';
import enzyme from 'enzyme';
import chai from 'chai';
import sinon from 'sinon';

import FeedbackForm from '../../../src/js/feedback/components/FeedbackForm';
import AlertBox from '../../../src/js/common/components/AlertBox';

const defaultProps = {
  formValues: {},
  formErrors: {},
  sendFeedback() {},
  clearError() {},
  setFormValues() {},
  errorMessage: null,
  requestPending: null
};

describe('<FeedbackForm/>', () => {

  it('should render', () => {
    const wrapper = enzyme.shallow(<FeedbackForm {...defaultProps}/>);
    const text = wrapper.text();
    chai.assert.isTrue(text.includes('Tell us what you think'), 'The title was rendered.');
  });

  it('should render with an error message', () => {
    const errorMessage = 'Testing errors';
    const props = { ...defaultProps, errorMessage };
    const wrapper = enzyme.shallow(<FeedbackForm {...props}/>);
    chai.assert.lengthOf(wrapper.find(AlertBox), 1, 'The error message was rendered.');
  });

  it('submits the form information', () => {
    const sendFeedback = sinon.spy();
    const props = { ...defaultProps, sendFeedback };
    const wrapper = enzyme.shallow(<FeedbackForm {...props}/>);
    const event = { preventDefault: sinon.spy() };

    wrapper.find('form').simulate('submit', event);
    chai.assert.isTrue(event.preventDefault.calledOnce, 'event.preventDefault was called');
    chai.assert.isTrue(sendFeedback.calledOnce, 'The submit handler was called');
  });
});
