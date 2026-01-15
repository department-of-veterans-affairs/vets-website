import { expect } from 'chai';
import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';

import useFreezeWebChatInput from '../../hooks/useFreezeWebChatInput';

function setupWebChatDom() {
  const root = document.createElement('div');
  root.setAttribute('data-testid', 'webchat');

  const input = document.createElement('input');
  input.className = 'webchat__send-box-text-box__input';
  root.appendChild(input);

  const button = document.createElement('button');
  button.className = 'webchat__send-button';
  root.appendChild(button);

  document.body.appendChild(root);

  return { root, input, button };
}

describe('useFreezeWebChatInput', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    document.body.innerHTML = '';
  });

  it('disables input and button when frozen and re-enables them on cleanup', () => {
    const { root, input, button } = setupWebChatDom();

    const { unmount } = renderHook(() => useFreezeWebChatInput(true));

    expect(input.getAttribute('disabled')).to.equal('true');
    expect(input.getAttribute('aria-disabled')).to.equal('true');
    expect(input.getAttribute('tabIndex')).to.equal('-1');

    expect(button.getAttribute('disabled')).to.equal('true');
    expect(button.getAttribute('aria-disabled')).to.equal('true');
    expect(button.getAttribute('tabIndex')).to.equal('-1');

    unmount();

    expect(input.hasAttribute('disabled')).to.be.false;
    expect(input.hasAttribute('aria-disabled')).to.be.false;
    expect(input.hasAttribute('tabIndex')).to.be.false;

    expect(button.hasAttribute('disabled')).to.be.false;
    expect(button.hasAttribute('aria-disabled')).to.be.false;
    expect(button.hasAttribute('tabIndex')).to.be.false;

    root.remove();
  });

  it('clears disabled state when isFrozen is false and does not create an observer', () => {
    const { root, input, button } = setupWebChatDom();

    input.setAttribute('disabled', 'true');
    input.setAttribute('aria-disabled', 'true');
    input.setAttribute('tabIndex', '-1');
    button.setAttribute('disabled', 'true');
    button.setAttribute('aria-disabled', 'true');
    button.setAttribute('tabIndex', '-1');

    const observeSpy = sandbox.spy();
    const observerStub = sandbox
      .stub(window, 'MutationObserver')
      .callsFake(function FakeObserver() {
        this.observe = observeSpy;
        this.disconnect = () => {};
      });

    const { unmount } = renderHook(() => useFreezeWebChatInput(false));

    expect(input.hasAttribute('disabled')).to.be.false;
    expect(input.hasAttribute('aria-disabled')).to.be.false;
    expect(input.hasAttribute('tabIndex')).to.be.false;

    expect(button.hasAttribute('disabled')).to.be.false;
    expect(button.hasAttribute('aria-disabled')).to.be.false;
    expect(button.hasAttribute('tabIndex')).to.be.false;

    expect(observerStub.called).to.be.false;
    expect(observeSpy.called).to.be.false;

    unmount();
    root.remove();
  });

  it('creates a MutationObserver when available and reapplies disabled state on mutations', () => {
    const { root, input, button } = setupWebChatDom();
    const observeSpy = sandbox.spy();
    let callback;

    const observerInstance = {
      observe: observeSpy,
      disconnect: sandbox.spy(),
    };

    const observerStub = sandbox
      .stub(window, 'MutationObserver')
      .callsFake(function FakeObserver(cb) {
        callback = cb;
        return observerInstance;
      });

    const { unmount } = renderHook(() => useFreezeWebChatInput(true));

    expect(observerStub.calledOnce).to.be.true;
    expect(observeSpy.calledOnce).to.be.true;

    input.removeAttribute('disabled');
    button.removeAttribute('disabled');

    callback();

    expect(input.getAttribute('disabled')).to.equal('true');
    expect(button.getAttribute('disabled')).to.equal('true');

    unmount();

    expect(observerInstance.disconnect.calledOnce).to.be.true;

    root.remove();
  });

  it('falls back gracefully when MutationObserver is not available', () => {
    const { root, input, button } = setupWebChatDom();

    const originalObserver = window.MutationObserver;
    window.MutationObserver = undefined;

    const { unmount } = renderHook(() => useFreezeWebChatInput(true));

    expect(input.getAttribute('disabled')).to.equal('true');
    expect(button.getAttribute('disabled')).to.equal('true');

    unmount();

    expect(input.hasAttribute('disabled')).to.be.false;
    expect(button.hasAttribute('disabled')).to.be.false;

    window.MutationObserver = originalObserver;

    root.remove();
  });
});
