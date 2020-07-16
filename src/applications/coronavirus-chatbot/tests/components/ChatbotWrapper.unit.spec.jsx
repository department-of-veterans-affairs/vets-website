import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { ChatbotWrapper } from '../../components/ChatbotWrapper';

describe('ChatbotWrapper <ChatbotWrapper>', () => {
  it('should render loading indicator when state is loading', () => {
    const mockStore = {
      getState: () => ({
        featureToggles: {
          loading: true,
        },
      }),
      subscribe: () => {},
    };

    const wrapper = shallow(<ChatbotWrapper store={mockStore} />);

    const chatbotWrapper = wrapper.instance();
    const unsubscribeSpy = sinon.spy();
    chatbotWrapper.unsubscribe = unsubscribeSpy;

    expect(wrapper.find('LoadingIndicator').length).to.equal(1);

    wrapper.unmount();

    expect(unsubscribeSpy.calledOnce).to.be.true;
  });

  it('should render chatbot component when state is not loading', () => {
    const mockStore = {
      getState: () => ({
        featureToggles: {
          loading: false,
        },
      }),
      subscribe: () => {},
    };

    const wrapper = shallow(<ChatbotWrapper store={mockStore} />);

    const chatbotWrapper = wrapper.instance();
    const unsubscribeSpy = sinon.spy();
    chatbotWrapper.unsubscribe = unsubscribeSpy;

    expect(wrapper.find('ChatbotComponent').length).to.equal(1);

    wrapper.unmount();

    expect(unsubscribeSpy.calledOnce).to.be.true;
  });
});
