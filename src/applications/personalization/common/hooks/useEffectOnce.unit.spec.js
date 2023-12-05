import sinon from 'sinon';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderHook } from '../unitHelpers';
import { useEffectOnce } from './useEffectOnce';

describe('useEffectOnce', () => {
  it('should run provided effect only once', () => {
    const mockEffectCallback = sinon.spy();
    const { rerender } = renderHook(() => useEffectOnce(mockEffectCallback));
    expect(mockEffectCallback.callCount).to.equal(1);

    rerender();
    expect(mockEffectCallback.callCount).to.equal(1);
  });

  it('should run clean-up provided on unmount', async () => {
    const mockEffectCleanup = sinon.spy();
    const mockEffectCallback = sinon.stub().returns(mockEffectCleanup);
    const { unmount } = renderHook(() => useEffectOnce(mockEffectCallback));
    expect(mockEffectCleanup.callCount).to.equal(0);
    expect(mockEffectCallback.callCount).to.equal(1);
    unmount();

    await waitFor(() => expect(mockEffectCleanup.callCount).to.equal(1));
  });
});
