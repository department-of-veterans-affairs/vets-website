import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router-dom';
import * as sinon from 'sinon';
import useFocusAfterLoading from '../../hooks/useFocusAfterLoading';

const defaultProps = {
  isLoading: false,
  isLoadingAcceleratedData: false,
};

// Wrapper component to provide router context
const createWrapper = (initialEntries = ['/']) => {
  // eslint-disable-next-line react/prop-types
  return function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    );
  };
};

describe('useFocusAfterLoading hook', () => {
  let sandbox;
  let h1FocusSpy;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Create mock h1 element with focus spy
    const h1Element = document.createElement('h1');
    h1Element.textContent = 'Test Heading';
    h1FocusSpy = sandbox.spy(h1Element, 'focus');
    document.body.appendChild(h1Element);
  });

  afterEach(() => {
    sandbox.restore();
    document.body.innerHTML = '';
  });

  describe('basic loading behavior', () => {
    it('does not focus h1 when isLoading is true', () => {
      renderHook(
        () =>
          useFocusAfterLoading({
            ...defaultProps,
            isLoading: true,
          }),
        { wrapper: createWrapper() },
      );

      expect(h1FocusSpy.called).to.be.false;
    });

    it('does not focus h1 when isLoadingAcceleratedData is true', () => {
      renderHook(
        () =>
          useFocusAfterLoading({
            ...defaultProps,
            isLoadingAcceleratedData: true,
          }),
        { wrapper: createWrapper() },
      );

      expect(h1FocusSpy.called).to.be.false;
    });

    it('does not focus h1 when both loading states are true', () => {
      renderHook(
        () =>
          useFocusAfterLoading({
            isLoading: true,
            isLoadingAcceleratedData: true,
          }),
        { wrapper: createWrapper() },
      );

      expect(h1FocusSpy.called).to.be.false;
    });

    it('focuses h1 when both loading states are false', async () => {
      renderHook(() => useFocusAfterLoading(defaultProps), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(h1FocusSpy.called).to.be.true;
      });
    });

    it('focuses h1 when only isLoading is passed (default isLoadingAcceleratedData)', async () => {
      renderHook(
        () =>
          useFocusAfterLoading({
            isLoading: false,
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(h1FocusSpy.called).to.be.true;
      });
    });
  });

  describe('loading transition behavior', () => {
    it('focuses h1 when isLoading transitions from true to false', async () => {
      const { rerender } = renderHook(
        props =>
          useFocusAfterLoading({
            ...defaultProps,
            isLoading: props.isLoading,
          }),
        { initialProps: { isLoading: true }, wrapper: createWrapper() },
      );

      // While loading, h1 should not be focused
      expect(h1FocusSpy.called).to.be.false;

      // Complete loading
      rerender({ isLoading: false });

      await waitFor(() => {
        expect(h1FocusSpy.called).to.be.true;
      });
    });

    it('focuses h1 when isLoadingAcceleratedData transitions from true to false', async () => {
      const { rerender } = renderHook(
        props =>
          useFocusAfterLoading({
            ...defaultProps,
            isLoadingAcceleratedData: props.isLoadingAcceleratedData,
          }),
        {
          initialProps: { isLoadingAcceleratedData: true },
          wrapper: createWrapper(),
        },
      );

      expect(h1FocusSpy.called).to.be.false;

      rerender({ isLoadingAcceleratedData: false });

      await waitFor(() => {
        expect(h1FocusSpy.called).to.be.true;
      });
    });

    it('waits for both loading states to be false before focusing', async () => {
      const { rerender } = renderHook(
        props =>
          useFocusAfterLoading({
            isLoading: props.isLoading,
            isLoadingAcceleratedData: props.isLoadingAcceleratedData,
          }),
        {
          initialProps: { isLoading: true, isLoadingAcceleratedData: true },
          wrapper: createWrapper(),
        },
      );

      // Both loading - no focus
      expect(h1FocusSpy.called).to.be.false;

      // Only isLoading finishes - should not focus yet
      rerender({ isLoading: false, isLoadingAcceleratedData: true });
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(h1FocusSpy.called).to.be.false;

      // Now isLoadingAcceleratedData finishes - should focus
      rerender({ isLoading: false, isLoadingAcceleratedData: false });

      await waitFor(() => {
        expect(h1FocusSpy.called).to.be.true;
      });
    });
  });

  describe('focus-once behavior', () => {
    it('only focuses h1 once when re-rendered with same not-loading props', async () => {
      const { rerender } = renderHook(
        () => useFocusAfterLoading(defaultProps),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(h1FocusSpy.calledOnce).to.be.true;
      });

      // Re-render with same props - should NOT refocus
      rerender();

      await new Promise(resolve => setTimeout(resolve, 0));
      expect(h1FocusSpy.calledOnce).to.be.true;
    });

    it('focuses h1 again after a new loading cycle', async () => {
      const { rerender } = renderHook(
        props =>
          useFocusAfterLoading({
            ...defaultProps,
            isLoading: props.isLoading,
          }),
        { initialProps: { isLoading: true }, wrapper: createWrapper() },
      );

      // Initially loading, no focus
      expect(h1FocusSpy.called).to.be.false;

      // First loading cycle completes
      rerender({ isLoading: false });

      await waitFor(() => {
        expect(h1FocusSpy.calledOnce).to.be.true;
      });

      // Start new loading cycle
      rerender({ isLoading: true });

      // Still only one call while loading
      expect(h1FocusSpy.calledOnce).to.be.true;

      // Complete new loading cycle - should focus again
      rerender({ isLoading: false });

      await waitFor(() => {
        expect(h1FocusSpy.calledTwice).to.be.true;
      });
    });

    it('resets focus tracking when isLoadingAcceleratedData starts', async () => {
      const { rerender } = renderHook(
        props =>
          useFocusAfterLoading({
            isLoading: false,
            isLoadingAcceleratedData: props.isLoadingAcceleratedData,
          }),
        {
          initialProps: { isLoadingAcceleratedData: false },
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(h1FocusSpy.calledOnce).to.be.true;
      });

      // Start accelerated loading
      rerender({ isLoadingAcceleratedData: true });

      // Finish accelerated loading - should focus again
      rerender({ isLoadingAcceleratedData: false });

      await waitFor(() => {
        expect(h1FocusSpy.calledTwice).to.be.true;
      });
    });
  });

  describe('pagination deep-link behavior', () => {
    it('does not focus h1 when URL has page param (deep-link to pagination)', async () => {
      renderHook(() => useFocusAfterLoading(defaultProps), {
        wrapper: createWrapper(['/vaccines?page=2']),
      });

      await new Promise(resolve => setTimeout(resolve, 0));
      expect(h1FocusSpy.called).to.be.false;
    });

    it('focuses h1 normally when URL has no page param', async () => {
      renderHook(() => useFocusAfterLoading(defaultProps), {
        wrapper: createWrapper(['/vaccines']),
      });

      await waitFor(() => {
        expect(h1FocusSpy.called).to.be.true;
      });
    });
  });
});
