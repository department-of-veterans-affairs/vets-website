import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ChatbotLoadError from '../../components/ChatbotLoadError';

describe('ChatbotLoadError <ChatbotLoadError>', () => {
  it('should render correct text in chatbot error', () => {
    const wrapper = shallow(<ChatbotLoadError />);
    const alertBox = wrapper.find('AlertBox');
    const alertMessageContent = alertBox.prop('content').props;
    const alertMessageParagraphOne =
      'Please make sure you’re connected to the internet, and refresh this page to try again.';
    const alertMessageParagraphTwo =
      'If it still doesn’t work, you may need to clear your internet browser’s history (sometimes called “cached data”). You can find how to do this within your browser’s privacy and security settings.';

    expect(alertBox.length).to.equal(1);
    expect(alertBox.prop('headline')).to.equal("We can't load the chatbot");
    expect(alertMessageContent.children[0].props.children).to.equal(
      alertMessageParagraphOne,
    );
    expect(alertMessageContent.children[1].props.children).to.equal(
      alertMessageParagraphTwo,
    );

    wrapper.unmount();
  });
});
