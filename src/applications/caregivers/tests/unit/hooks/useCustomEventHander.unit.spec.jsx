import { renderHook } from '@testing-library/react-hooks';
import sinon from 'sinon-v20';
import { useCustomEventHandler } from '../../../hooks/useCustomEventHandler';

describe('CG `useCustomEventHandler` hook', () => {
  let addEventListenerSpy;
  let removeEventListenerSpy;
  let eventHandler;
  let mockRef;

  beforeEach(() => {
    const mockElement = {
      addEventListener: () => {},
      removeEventListener: () => {},
    };
    addEventListenerSpy = sinon.spy(mockElement, 'addEventListener');
    removeEventListenerSpy = sinon.spy(mockElement, 'removeEventListener');
    mockRef = { current: mockElement };
    eventHandler = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should add event listener to the referenced element', () => {
    renderHook(() => useCustomEventHandler(mockRef, 'click', eventHandler));
    sinon.assert.calledOnceWithExactly(
      addEventListenerSpy,
      'click',
      eventHandler,
    );
  });

  it('should remove event listener when unmounted', () => {
    const { unmount } = renderHook(() =>
      useCustomEventHandler(mockRef, 'click', eventHandler),
    );
    unmount();
    sinon.assert.calledOnceWithExactly(
      removeEventListenerSpy,
      'click',
      eventHandler,
    );
  });

  it('should trigger handler when event occurs', () => {
    renderHook(() => useCustomEventHandler(mockRef, 'click', eventHandler));
    const event = { target: mockRef.current };
    mockRef.current.addEventListener.firstCall.args[1](event);
    sinon.assert.calledOnceWithExactly(eventHandler, event);
  });
});
