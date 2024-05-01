import sinon from 'sinon';
import { expect } from 'chai';
import { renderHook } from '@testing-library/react-hooks';
import useChosenBot from '../../hooks/useChosenBot';

describe('useChosenBot', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should set chosenBot to "sticky" when virtualAgentShowFloatingChatbot is true', () => {
    const setIsLoading = sandbox.stub();
    const setChosenBot = sandbox.stub();
    const virtualAgentShowFloatingChatbot = true;

    renderHook(() =>
      useChosenBot(virtualAgentShowFloatingChatbot, setIsLoading, setChosenBot),
    );

    expect(setIsLoading.calledOnce).to.be.true;
    expect(setIsLoading.calledWithExactly(false)).to.be.true;
    expect(setChosenBot.calledOnce).to.be.true;
    expect(setChosenBot.calledWithExactly('sticky')).to.be.true;
  });
  it('should set chosenBot to "default" when virtualAgentShowFloatingChatbot is false', () => {
    const setIsLoading = sandbox.stub();
    const setChosenBot = sandbox.stub();
    const virtualAgentShowFloatingChatbot = false;

    renderHook(() =>
      useChosenBot(virtualAgentShowFloatingChatbot, setIsLoading, setChosenBot),
    );

    expect(setIsLoading.calledOnce).to.be.true;
    expect(setIsLoading.calledWithExactly(false)).to.be.true;
    expect(setChosenBot.calledOnce).to.be.true;
    expect(setChosenBot.calledWithExactly('default')).to.be.true;
  });
});
