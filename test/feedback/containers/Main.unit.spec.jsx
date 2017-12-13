import React from 'react';
import enzyme from 'enzyme';
import chai from 'chai';
import sinon from 'sinon';

import { Main } from '../../../src/js/feedback/containers/Main';
import DefaultView from '../../../src/js/feedback/components/DefaultView';
import FeedbackForm from '../../../src/js/feedback/components/FeedbackForm';
import FeedbackSubmitted from '../../../src/js/feedback/components/FeedbackSubmitted';

const defaultProps = {
  requestPending: false,
  feedbackReceived: false,
  shouldSendResponse: false,
  sendFeedback() {},
  clearError() {},
  errorMessage: null
};

describe('<Main/>', () => {

  it('should render with DefaultView', () => {
    const wrapper = enzyme.shallow(<Main {...defaultProps}/>);
    const text = wrapper.text();
    chai.assert.isTrue(text.includes('Give feedback on this page'), 'The title was rendered.');
    chai.assert.lengthOf(wrapper.find(DefaultView), 1, 'The DefaultView was rendered');
  });

  it('should render FeedbackForm with correct props', () => {
    const state = { formIsVisible: true };
    const sendFeedback = sinon.spy();
    const props = { ...defaultProps, sendFeedback };
    const wrapper = enzyme.shallow(<Main {...props}/>);

    wrapper.setState(state);

    const feedbackFormWrapper = wrapper.find(FeedbackForm);
    chai.assert.lengthOf(feedbackFormWrapper, 1, 'The FeedbackForm was rendered');

    const event = { preventDefault: sinon.spy() };

    feedbackFormWrapper.dive().find('form').simulate('submit', event);
    chai.assert.isTrue(sendFeedback.calledOnce, 'The sendFeedback prop was passed correctly to the FeedbackForm');
    chai.assert.isTrue(event.preventDefault.calledOnce, 'event.preventDefault was called');
  });

  it('should render FeedbackSubmitted', () => {
    const props = { ...defaultProps, feedbackReceived: true };
    const wrapper = enzyme.shallow(<Main {...props}/>);
    chai.assert.lengthOf(wrapper.find(FeedbackSubmitted), 1, 'The FeedbackSubmitted was rendered');
  });

});
