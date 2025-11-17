import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { COMPLETE, ERROR, LOADING } from '../../utils/loadingStatus';
import * as UseWebChatModule from '../../hooks/useWebChat';
import * as ChatbotErrorModule from '../../components/ChatbotError';
import * as WebChatModule from '../../components/WebChat';
import * as SessionStorageModule from '../../utils/sessionStorage';
import * as ExpiryModule from '../../utils/expiry';
import App from '../../components/App';

describe('App', () => {
  let sandbox;
  let clock;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sinon.useFakeTimers({
      toFake: ['setInterval', 'clearInterval', 'Date'],
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
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
    it('should show the chat-ended alert when the token expiry threshold is reached', () => {
      const expiresAt = ExpiryModule.EXPIRY_ALERT_BUFFER_MS + 1000;

      sandbox
        .stub(SessionStorageModule, 'getTokenExpiresAt')
        .returns(expiresAt);
      sandbox.stub(UseWebChatModule, 'default').returns({
        token: 'fake-token',
        code: undefined,
        expired: false,
        webChatFramework: {},
        loadingStatus: COMPLETE,
      });
      sandbox
        .stub(WebChatModule, 'default')
        .returns(<div data-testid="webchat-module" />);

      const { queryByText, getByText } = render(<App />);

      expect(queryByText('Chat ended')).to.be.null;

      act(() => {
        clock.tick(1000);
      });

      expect(getByText('Chat ended')).to.exist;
    });
    it('should dispatch a reset event and toggle freeze when starting a new chat', () => {
      const freezeValues = [];
      sandbox.stub(WebChatModule, 'default').callsFake(props => {
        freezeValues.push(props.freeze);
        return <div data-testid="webchat-module" />;
      });

      sandbox.stub(UseWebChatModule, 'default').callsFake(() => {
        const [token, setToken] = React.useState('token-1');

        React.useEffect(() => {
          const handler = () => {
            setToken('token-2');
          };
          window.addEventListener('va-chatbot-reset', handler);
          return () => window.removeEventListener('va-chatbot-reset', handler);
        }, []);

        return {
          token,
          code: undefined,
          expired: true,
          webChatFramework: {},
          loadingStatus: COMPLETE,
        };
      });

      const dispatchEventSpy = sandbox.spy(window, 'dispatchEvent');

      const { container, getByText, queryByText } = render(<App />);

      expect(getByText('Chat ended')).to.exist;

      const button = container.querySelector(
        'va-button[text="Start new chat"]',
      );

      expect(button).to.exist;

      act(() => {
        fireEvent.click(button);
      });

      expect(dispatchEventSpy.calledOnce).to.be.true;
      expect(dispatchEventSpy.firstCall.args[0].type).to.equal(
        'va-chatbot-reset',
      );

      expect(queryByText('Chat ended')).to.be.null;

      expect(freezeValues.some(value => value === true)).to.be.true;
      expect(freezeValues[freezeValues.length - 1]).to.equal(false);
    });
  });
});
