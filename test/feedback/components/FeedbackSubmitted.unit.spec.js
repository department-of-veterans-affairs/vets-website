import React from 'react';
import enzyme from 'enzyme';
import chai from 'chai';

import FeedbackSubmitted from '../../../src/js/feedback/components/FeedbackSubmitted';

const props = {
  shouldSendResponse: true
};

describe('<FeedbackSubmitted/>', () => {

  it('should render', () => {
    const wrapper = enzyme.shallow(<FeedbackSubmitted {...props}/>);
    const text = wrapper.text();
    chai.assert.isTrue(text.includes('We\'ll get back to you soon.'), 'The title was rendered.');
  });

});
