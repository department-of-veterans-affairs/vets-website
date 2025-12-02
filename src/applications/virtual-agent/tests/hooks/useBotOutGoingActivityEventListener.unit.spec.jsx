import sinon from 'sinon';
import { expect } from 'chai';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import useBotOutgoingActivityEventListener from '../../hooks/useBotOutgoingActivityEventListener';

describe('useBotOutgoingActivityEventListener', () => {
  let sandbox;
  let clock;
  let reloadStub;
  let originalLocation;
  const now = new Date();
  const originalWindow = global.window;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sinon.useFakeTimers({
      now,
      toFake: ['Date'],
    });

    // Set up window.location.reload stub by replacing the entire location object
    // This approach works with both jsdom and happy-dom
    reloadStub = sandbox.stub();
    originalLocation = window.location;

    const locationMock = {
      ...window.location,
      reload: reloadStub,
    };

    Object.defineProperty(window, 'location', {
      value: locationMock,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore the original location object
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });

    sandbox.restore();
    clock.restore();
    global.window = originalWindow;
  });

  it('should call addEventListener when enabled (default)', () => {
    const addEventListenerStub = sandbox.stub(window, 'addEventListener');

    renderHook(() => useBotOutgoingActivityEventListener(now));

    expect(
      addEventListenerStub.calledWithExactly(
        'bot-outgoing-activity',
        sinon.match.func,
      ),
    ).to.be.true;
  });

  it('should NOT call addEventListener when enabled=false', () => {
    const addEventListenerStub = sandbox.stub(window, 'addEventListener');

    renderHook(() => useBotOutgoingActivityEventListener(now, false));

    expect(addEventListenerStub.calledWith('bot-outgoing-activity')).to.be
      .false;
  });

  it('should reload when last message was more than 30 minutes ago', async () => {
    const setLastMessageTimeStub = sandbox.stub();
    const chatBotLoadTime = new Date(now.getTime() - 59 * 60 * 1000);
    const lastMessageTime = new Date(now.getTime() - 31 * 60 * 1000);
    sandbox
      .stub(React, 'useState')
      .returns([lastMessageTime, setLastMessageTimeStub]);

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

    renderHook(() => useBotOutgoingActivityEventListener(chatBotLoadTime));
    await act(async () => {
      global.window.dispatchEvent(new Event('bot-outgoing-activity'));
    });

    expect(reloadStub.calledOnce).to.be.true;
    expect(setLastMessageTimeStub.notCalled).to.be.true;
  });
});
