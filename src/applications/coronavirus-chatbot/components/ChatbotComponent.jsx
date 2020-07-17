import React from 'react';
import ChatbotLoadError from './ChatbotLoadError';
import * as ChatbotModule from '../index';
import * as GaEvents from '../gaEvents';
import * as Utils from '../utils';

const idString = 'chatbot-wrapper-id';

export class ChatbotComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatbotError: false,
    };
  }

  async componentDidMount() {
    const initialComponent = document.querySelector(`#${idString}`);
    try {
      GaEvents.addLinkClickListener();
      Utils.handleButtonsPostRender();
      const webchatOptions = await ChatbotModule.initializeChatbot();
      if (!webchatOptions) {
        return;
      }
      GaEvents.recordChatbotSuccess();
      window.WebChat.renderWebChat(webchatOptions, initialComponent);
    } catch (error) {
      GaEvents.recordChatbotFailure(error);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        chatbotError: true,
      });
    }
  }

  render() {
    if (this.state.chatbotError) {
      return <ChatbotLoadError />;
    }
    return <div id={idString} />;
  }
}
