import { expect } from 'chai';
import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/dom';
import useFocusSettle from '../../hooks/useFocusSettle';

describe('useFocusSettle hook', () => {
  // Per instruction: use real timers with extended waitFor — do NOT use sinon.useFakeTimers()

  it('returns empty string when content is falsy', () => {
    const { result } = renderHook(() => useFocusSettle(''));
    expect(result.current).to.equal('');
  });

  it('returns empty string when content is undefined', () => {
    const { result } = renderHook(() => useFocusSettle(undefined));
    expect(result.current).to.equal('');
  });

  it('returns empty string initially when content is provided', () => {
    const { result } = renderHook(() => useFocusSettle('Alert text'));
    // Before any timers fire, should be empty
    expect(result.current).to.equal('');
  });

  it('returns content after focus settles (1s debounce)', async () => {
    const { result } = renderHook(() => useFocusSettle('Success message'));

    // Trigger a focusin event to start the debounce
    act(() => {
      document.dispatchEvent(new Event('focusin', { bubbles: true }));
    });

    // Wait for the 1s debounce + RAF to resolve
    await waitFor(
      () => {
        expect(result.current).to.equal('Success message');
      },
      { timeout: 4000 },
    );
  });

  it('resets to empty string when content changes to empty', async () => {
    const { result, rerender } = renderHook(
      ({ content }) => useFocusSettle(content),
      { initialProps: { content: 'Alert text' } },
    );

    // Wait for it to populate
    act(() => {
      document.dispatchEvent(new Event('focusin', { bubbles: true }));
    });
    await waitFor(
      () => {
        expect(result.current).to.equal('Alert text');
      },
      { timeout: 4000 },
    );

    // Now clear the content
    rerender({ content: '' });
    expect(result.current).to.equal('');
  });

  it('updates when content changes to a new non-empty value', async () => {
    const { result, rerender } = renderHook(
      ({ content }) => useFocusSettle(content),
      { initialProps: { content: 'First message' } },
    );

    // Wait for first message to settle
    act(() => {
      document.dispatchEvent(new Event('focusin', { bubbles: true }));
    });
    await waitFor(
      () => {
        expect(result.current).to.equal('First message');
      },
      { timeout: 4000 },
    );

    // Change to new message
    rerender({ content: 'Second message' });

    // Trigger focusin again for new content
    act(() => {
      document.dispatchEvent(new Event('focusin', { bubbles: true }));
    });

    await waitFor(
      () => {
        expect(result.current).to.equal('Second message');
      },
      { timeout: 4000 },
    );
  });

  it('eventually announces content regardless of external focusin events', async () => {
    const { result } = renderHook(() => useFocusSettle('Eventual test'));

    // No explicit focusin dispatch — the hook kicks off an initial debounce
    // internally via onFocusIn(), so content will announce after 1s settle.
    // This verifies that consumers don't need to trigger focusin manually.
    await waitFor(
      () => {
        expect(result.current).to.equal('Eventual test');
      },
      { timeout: 7000 },
    );
  });

  it('debounces repeated focusin events', async () => {
    const { result } = renderHook(() => useFocusSettle('Debounce test'));

    // Fire multiple focusin events rapidly
    act(() => {
      document.dispatchEvent(new Event('focusin', { bubbles: true }));
    });
    act(() => {
      document.dispatchEvent(new Event('focusin', { bubbles: true }));
    });
    act(() => {
      document.dispatchEvent(new Event('focusin', { bubbles: true }));
    });

    // Should still be empty immediately after rapid focusin events
    expect(result.current).to.equal('');

    // After debounce settles (1s from last focusin + RAF)
    await waitFor(
      () => {
        expect(result.current).to.equal('Debounce test');
      },
      { timeout: 4000 },
    );
  });
});
