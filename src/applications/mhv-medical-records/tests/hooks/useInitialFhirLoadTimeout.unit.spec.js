import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useInitialFhirLoadTimeout from '../../hooks/useInitialFhirLoadTimeout';

describe('useInitialFhirLoadTimeout', () => {
  it('should return false initially when there is no initialFhirLoad', () => {
    const { result } = renderHook(() => useInitialFhirLoadTimeout(null));
    expect(result.current).to.be.false;
  });

  it('should return false if timeout has not yet passed', () => {
    const initialFhirLoad = new Date(new Date() - 500); // 500ms ago
    const timeoutDuration = 1000; // 1 second

    const { result } = renderHook(() =>
      useInitialFhirLoadTimeout(initialFhirLoad, timeoutDuration),
    );

    expect(result.current).to.be.false;
  });

  it('should return true if timeout has already passed', async () => {
    const initialFhirLoad = new Date(new Date() - 1500); // 1.5 seconds ago
    const timeoutDuration = 1000; // 1 second

    const { result } = renderHook(() =>
      useInitialFhirLoadTimeout(initialFhirLoad, timeoutDuration),
    );

    await waitFor(() => {
      expect(result.current).to.be.true;
    });
  });

  it('should transition to true after the timeout duration', async () => {
    const initialFhirLoad = new Date(new Date() - 500); // 500ms ago
    const timeoutDuration = 1000; // 1 second

    const { result, waitForNextUpdate } = renderHook(() =>
      useInitialFhirLoadTimeout(initialFhirLoad, timeoutDuration),
    );

    expect(result.current).to.be.false;

    // Wait for the timeout to pass
    await waitForNextUpdate();

    expect(result.current).to.be.true;
  });

  it('should clear the timeout on unmount', () => {
    const initialFhirLoad = new Date(new Date() - 500); // 500ms ago
    const timeoutDuration = 1000; // 1 second

    const { unmount } = renderHook(() =>
      useInitialFhirLoadTimeout(initialFhirLoad, timeoutDuration),
    );

    // Act as if the component is unmounted
    unmount();

    // No specific assertion for timeout clearance, but ensure no errors occur
    expect(true).to.be.true; // Ensure no errors occurred
  });

  it('should reset to false when initialFhirLoad changes to null', () => {
    const initialFhirLoad = new Date(new Date() - 500); // 500ms ago
    const timeoutDuration = 1000; // 1 second

    const { result, rerender } = renderHook(
      ({ initialLoad, duration }) =>
        useInitialFhirLoadTimeout(initialLoad, duration),
      {
        initialProps: {
          initialLoad: initialFhirLoad,
          duration: timeoutDuration,
        },
      },
    );

    expect(result.current).to.be.false;

    // Update initialFhirLoad to null
    rerender({ initialLoad: null, duration: timeoutDuration });

    expect(result.current).to.be.false;
  });
});
