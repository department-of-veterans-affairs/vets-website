import sinon from 'sinon';
import { expect } from 'chai';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import useBotOutgoingActivityEventListener from '../../hooks/useBotOutgoingActivityEventListener';

describe('useBotOutgoingActivityEventListener', () => {
  let sandbox;
  let clock;
  const now = new Date();
  const originalWindow = global.window;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sinon.useFakeTimers({
      now,
      toFake: ['Date'],
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
    global.window = originalWindow;
  });

  it('should call addEventListener', () => {
    const addEventListenerStub = sandbox.stub(window, 'addEventListener');

    renderHook(() => useBotOutgoingActivityEventListener(now));

    expect(
      addEventListenerStub.calledWithExactly(
        'bot-outgoing-activity',
        sinon.match.func,
      ),
    ).to.be.true;
  });

  it('should reload when last message was more than 30 minutes ago', async () => {
    const setLastMessageTimeStub = sandbox.stub();
    const chatBotLoadTime = new Date(now.getTime() - 59 * 60 * 1000);
    const lastMessageTime = new Date(now.getTime() - 31 * 60 * 1000);
    sandbox
      .stub(React, 'useState')
      .returns([lastMessageTime, setLastMessageTimeStub]);
    const reloadStub = sandbox.stub();
    global.window.location = {
      reload: reloadStub,
    };

    renderHook(() => useBotOutgoingActivityEventListener(chatBotLoadTime));
    await act(async () => {
      global.window.dispatchEvent(new Event('bot-outgoing-activity'));
    });

    expect(reloadStub.calledOnce).to.be.true;
    expect(setLastMessageTimeStub.notCalled).to.be.true;
  });

  it('should reload when last message was less than 30 minutes ago and chatbotLoadTime was more than 30 minute ago', async () => {
    const setLastMessageTimeStub = sandbox.stub();
    const chatBotLoadTime = new Date(now.getTime() - 59 * 60 * 1000);
    const lastMessageTime = new Date(now.getTime() - 29 * 60 * 1000);
    sandbox
      .stub(React, 'useState')
      .returns([lastMessageTime, setLastMessageTimeStub]);
    const reloadStub = sandbox.stub();
    global.window.location = {
      reload: reloadStub,
    };

    renderHook(() => useBotOutgoingActivityEventListener(chatBotLoadTime));
    await act(async () => {
      global.window.dispatchEvent(new Event('bot-outgoing-activity'));
    });

    expect(reloadStub.notCalled).to.be.true;
    expect(setLastMessageTimeStub.calledOnce).to.be.true;
  });

  it('should call setLastMessageTime when last message was less than 30 minutes ago', async () => {
    const setLastMessageTimeStub = sandbox.stub();
    const chatBotLoadTime = new Date(now.getTime() - 61 * 60 * 1000);
    const lastMessageTime = new Date(now.getTime() - 29 * 60 * 1000);
    sandbox
      .stub(React, 'useState')
      .returns([lastMessageTime, setLastMessageTimeStub]);
    const reloadStub = sandbox.stub();
    global.window.location = {
      reload: reloadStub,
    };

    renderHook(() => useBotOutgoingActivityEventListener(chatBotLoadTime));
    await act(async () => {
      global.window.dispatchEvent(new Event('bot-outgoing-activity'));
    });

    expect(reloadStub.calledOnce).to.be.true;
    expect(setLastMessageTimeStub.calledOnce).to.be.true;
  });

  it('should call setLastMessageTime when last message was less than 30 minutes ago', async () => {
    const setLastMessageTimeStub = sandbox.stub();
    const chatBotLoadTime = new Date(now.getTime() - 61 * 60 * 1000);
    const lastMessageTime = new Date(now.getTime() - 31 * 60 * 1000);
    sandbox
      .stub(React, 'useState')
      .returns([lastMessageTime, setLastMessageTimeStub]);
    const reloadStub = sandbox.stub();
    global.window.location = {
      reload: reloadStub,
    };

    renderHook(() => useBotOutgoingActivityEventListener(chatBotLoadTime));
    await act(async () => {
      global.window.dispatchEvent(new Event('bot-outgoing-activity'));
    });

    expect(reloadStub.calledOnce).to.be.true;
    expect(setLastMessageTimeStub.notCalled).to.be.true;
  });
});
