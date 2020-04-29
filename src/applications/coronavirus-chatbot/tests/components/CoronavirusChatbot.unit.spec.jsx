import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import CoronavirusChatbot from '../../components/CoronavirusChatbot';

describe('Coronavirus Chatbot <CoronavirusChatbot>', () => {
  it('should render the loading indicator when no props are passed', () => {
    const wrapper = shallow(<CoronavirusChatbot />);
    const loadingComponent = wrapper.find('LoadingIndicator');

    expect(loadingComponent).to.have.lengthOf(1);
    expect(loadingComponent.prop('message')).to.equal(
      'Loading coronavirus chatbot...',
    );

    wrapper.unmount();
  });

  it('should render the chatbot component when props are passed', () => {
    const configProps = {
      directLine: {},
      store: {},
      userID: '',
      styleOptions: {},
    };
    const wrapper = shallow(<CoronavirusChatbot config={configProps} />);
    const chatbotComponent = wrapper.find('FullReactWebChat');
    expect(chatbotComponent).to.have.lengthOf(1);

    wrapper.unmount();
  });
});
