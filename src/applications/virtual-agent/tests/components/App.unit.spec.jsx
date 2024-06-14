import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { COMPLETE, ERROR, LOADING } from '../../utils/loadingStatus';
import * as UseWebChatModule from '../../hooks/useWebChat';
import * as ChatbotErrorModule from '../../components/ChatbotError';
import * as WebChatModule from '../../components/WebChat';
import App from '../../components/App';

describe('App', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('App', () => {
    it('should render the ChatbotError component when loadingStatus is ERROR', () => {
      sandbox
        .stub(UseWebChatModule, 'default')
        .returns({ loadingStatus: ERROR });
      sandbox
        .stub(ChatbotErrorModule, 'default')
        .returns(<div data-testid="chatbot-error" />);

      const { getByTestId } = render(<App />);

      expect(getByTestId('chatbot-error')).to.exist;
    });
    it('should render the va-loading-indicator component when loadingStatus is ERROR', () => {
      sandbox
        .stub(UseWebChatModule, 'default')
        .returns({ loadingStatus: LOADING });

      const { container } = render(<App />);

      expect($('va-loading-indicator', container)).to.exist;
    });
    it('should render the WebChat component when loadingStatus is ERROR', () => {
      sandbox
        .stub(UseWebChatModule, 'default')
        .returns({ loadingStatus: COMPLETE });
      sandbox
        .stub(WebChatModule, 'default')
        .returns(<div data-testid="webchat-module" />);

      const { getByTestId } = render(<App />);

      expect(getByTestId('webchat-module')).to.exist;
    });
    it('should throw an error when loadingStatus is unknown', async () => {
      sandbox
        .stub(UseWebChatModule, 'default')
        .returns({ loadingStatus: 'OTHER' });
      try {
        renderHook(() => App());
      } catch (error) {
        expect(error.message).to.equal('Invalid loading status: OTHER');
      }
    });
  });
});
