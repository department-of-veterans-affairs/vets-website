import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import * as Disclaimer from '../../../shared/components/Disclaimer/Disclaimer';
import * as Chatbox from '../../components/Chatbox';
import FloatingBot from '../../components/FloatingBot';

describe('FloatingBot', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('FloatingBot', () => {
    it('should render the chatbot icon, corner bot, close bot button, disclaimer and chatbox components', () => {
      sandbox
        .stub(Disclaimer, 'default')
        .callsFake(() => <div data-testid="disclaimer" />);
      sandbox
        .stub(Chatbox, 'default')
        .callsFake(() => <div className="chatbox" />);

      const { getByTestId, container } = render(<FloatingBot />);

      expect($$('div.chatbot-icon', container)).to.exist;
      expect($$('div.corner-bot', container)).to.exist;
      expect($$('div.close-chatbot-button', container)).to.exist;
      expect($$('div.chatbox', container).length).to.equal(2);
      expect(getByTestId('disclaimer')).to.exist;
    });
    it('should hide the chatbot and show the chatbot icon by default', () => {
      sandbox
        .stub(Disclaimer, 'default')
        .callsFake(() => <div data-testid="disclaimer" />);
      sandbox
        .stub(Chatbox, 'default')
        .callsFake(() => <div className="chatbox" />);

      const { container } = render(<FloatingBot />);

      expect($('#corner-bot', container).classList.contains('hide')).to.be.true;
      expect($('#chatbot-icon', container).classList.contains('unhide')).to.be
        .true;
    });
    it('should show the chatbot and hide the chatbot icon when Go to chatbot link is clicked', () => {
      sandbox
        .stub(Disclaimer, 'default')
        .callsFake(() => <div data-testid="disclaimer" />);
      sandbox
        .stub(Chatbox, 'default')
        .callsFake(() => <div className="chatbox" />);

      const { container } = render(<FloatingBot />);
      const goToChatbotLink = $('a.show-on-focus', container);
      goToChatbotLink.click();

      expect($('#corner-bot', container).classList.contains('unhide')).to.be
        .true;
      expect($('#chatbot-icon', container).classList.contains('hide')).to.be
        .true;
    });
    it('should show the chatbot and hide the chatbot icon when chatbot icon is clicked', () => {
      sandbox
        .stub(Disclaimer, 'default')
        .callsFake(() => <div data-testid="disclaimer" />);
      sandbox
        .stub(Chatbox, 'default')
        .callsFake(() => <div className="chatbox" />);

      const { container } = render(<FloatingBot />);
      const showBotButton = $('#chatbot-icon', container);
      showBotButton.click();

      expect($('#corner-bot', container).classList.contains('unhide')).to.be
        .true;
      expect($('#chatbot-icon', container).classList.contains('hide')).to.be
        .true;
    });
    it('should hide the chatbot and show the chatbot icon when close chatbot button is clicked', () => {
      sandbox
        .stub(Disclaimer, 'default')
        .callsFake(() => <div data-testid="disclaimer" />);
      sandbox
        .stub(Chatbox, 'default')
        .callsFake(() => <div className="chatbox" />);

      const { container } = render(<FloatingBot />);
      const closeBotButton = $('div.close-chatbot-button', container);
      closeBotButton.click();

      expect($('#corner-bot', container).classList.contains('hide')).to.be.true;
      expect($('#chatbot-icon', container).classList.contains('unhide')).to.be
        .true;
    });
  });
});
