import React from 'react';
import enzyme from 'enzyme';
import chai from 'chai';

import FeedbackSubmitted from '../../../src/js/feedback/components/FeedbackSubmitted';

describe('<FeedbackSubmitted/>', () => {

  it('should render with follow-up message', () => {
    const wrapper = enzyme.shallow(<FeedbackSubmitted shouldSendResponse/>);
    const text = wrapper.text();
    chai.assert.isTrue(text.includes('We\'ll get back to you soon.'), 'The message for following up with the sender was rendered..');
  });

  it('should render without follow-up message', () => {
    const wrapper = enzyme.shallow(<FeedbackSubmitted/>);
    const text = wrapper.text();
    chai.assert.isFalse(text.includes('We\'ll get back to you soon.'), 'The message for following up with the sender was NOT rendered..');
  });

});
