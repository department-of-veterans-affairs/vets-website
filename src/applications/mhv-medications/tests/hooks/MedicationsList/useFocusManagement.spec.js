import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import * as sinon from 'sinon';
import { renderHook } from '../../testing-utils/renderHook';
import { useFocusManagement } from '../../../hooks/MedicationsList/useFocusManagement';

const defaultProps = {
  isLoading: false,
  filteredList: [{ id: 1 }, { id: 2 }],
  noFilterMatches: false,
  isReturningFromDetailsPage: false,
  scrollLocation: { current: null },
  showingFocusedAlert: false,
};

describe('useFocusManagement', () => {
  let sandbox;
  let showingRxScrollIntoView;
  let h1FocusSpy;
  let noMatchesFocusSpy;
  let showingRxFocusSpy;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Create mock DOM elements with focus spies
    const h1Element = document.createElement('h1');
    h1Element.textContent = 'Medications';
    h1FocusSpy = sandbox.spy(h1Element, 'focus');
    document.body.appendChild(h1Element);

    const noMatchesElement = document.createElement('div');
    noMatchesElement.id = 'no-matches-msg';
    noMatchesFocusSpy = sandbox.spy(noMatchesElement, 'focus');
    document.body.appendChild(noMatchesElement);

    const showingRxElement = document.createElement('div');
    showingRxElement.id = 'showingRx';
    showingRxScrollIntoView = sandbox.stub();
    showingRxElement.scrollIntoView = showingRxScrollIntoView;
    showingRxFocusSpy = sandbox.spy(showingRxElement, 'focus');
    document.body.appendChild(showingRxElement);
  });

  afterEach(() => {
    sandbox.restore();
    document.body.innerHTML = '';
  });

  it('focuses h1 when loading completes', async () => {
    const { rerender } = renderHook(
      props =>
        useFocusManagement({
          ...defaultProps,
          isLoading: props.isLoading,
        }),
      { initialProps: { isLoading: true } },
    );

    // While loading, h1 should not be focused
    expect(h1FocusSpy.called).to.be.false;

    // Complete loading
    rerender({ isLoading: false });

    await waitFor(() => {
      expect(h1FocusSpy.called).to.be.true;
    });
  });

  describe('initial load focus behavior', () => {
    it('focuses h1 on initial load when not returning from details page and no alert shown', async () => {
      renderHook(() => useFocusManagement(defaultProps));

      await waitFor(() => {
        expect(h1FocusSpy.called).to.be.true;
      });
    });

    it('does not focus h1 when loading', () => {
      renderHook(() =>
        useFocusManagement({
          ...defaultProps,
          isLoading: true,
          filteredList: [],
        }),
      );

      expect(h1FocusSpy.called).to.be.false;
    });

    it('does not focus h1 when showingFocusedAlert is true', async () => {
      renderHook(() =>
        useFocusManagement({
          ...defaultProps,
          showingFocusedAlert: true,
        }),
      );

      // Wait a tick to ensure effects have run
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(h1FocusSpy.called).to.be.false;
    });

    it('scrolls to previous location when returning from details page', async () => {
      const scrollElement = document.createElement('div');
      scrollElement.scrollIntoView = sandbox.stub();

      renderHook(() =>
        useFocusManagement({
          ...defaultProps,
          isReturningFromDetailsPage: true,
          scrollLocation: { current: scrollElement },
        }),
      );

      await waitFor(() => {
        expect(scrollElement.scrollIntoView.called).to.be.true;
      });
    });

    it('focuses h1 when isReturningFromDetailsPage is true and scrollLocation ref is null', async () => {
      renderHook(() =>
        useFocusManagement({
          ...defaultProps,
          isReturningFromDetailsPage: true,
        }),
      );

      await new Promise(resolve => setTimeout(resolve, 0));
      expect(h1FocusSpy.called).to.be.true;
    });

    it('focuses h1 when isReturningFromDetailsPage is true and scrollLocation.current.scrollIntoView is undefined', async () => {
      renderHook(() =>
        useFocusManagement({
          ...defaultProps,
          isReturningFromDetailsPage: true,
          scrollLocation: { current: { foo: 'bar' } },
        }),
      );

      await new Promise(resolve => setTimeout(resolve, 0));
      expect(h1FocusSpy.called).to.be.true;
    });
  });

  describe('filter/sort focus behavior', () => {
    it('focuses no-matches-msg when noFilterMatches is true', async () => {
      renderHook(() =>
        useFocusManagement({
          ...defaultProps,
          filteredList: [],
          noFilterMatches: true,
        }),
      );

      await waitFor(() => {
        expect(noMatchesFocusSpy.called).to.be.true;
      });
    });

    it('does not focus no-matches-msg when loading', () => {
      renderHook(() =>
        useFocusManagement({
          ...defaultProps,
          isLoading: true,
          filteredList: [],
          noFilterMatches: true,
        }),
      );

      expect(noMatchesFocusSpy.called).to.be.false;
    });

    it('does not focus showingRx on first load', async () => {
      renderHook(() => useFocusManagement(defaultProps));

      await new Promise(resolve => setTimeout(resolve, 0));
      expect(showingRxFocusSpy.called).to.be.false;
    });

    it('focuses and scrolls to showingRx after filter/sort change', async () => {
      const { rerender } = renderHook(
        props =>
          useFocusManagement({
            ...defaultProps,
            filteredList: props.filteredList,
          }),
        { initialProps: { filteredList: [{ id: 1 }] } },
      );

      // First render - isFirstLoad is true, so showingRx should not be focused
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(showingRxFocusSpy.called).to.be.false;

      // Simulate filter change
      rerender({ filteredList: [{ id: 2 }, { id: 3 }] });

      await waitFor(() => {
        expect(showingRxFocusSpy.called).to.be.true;
        expect(showingRxScrollIntoView.called).to.be.true;
        expect(
          showingRxScrollIntoView.calledWith({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          }),
        ).to.be.true;
      });
    });

    it('focuses no-matches-msg instead of showingRx when filter returns no results', async () => {
      const { rerender } = renderHook(
        props =>
          useFocusManagement({
            ...defaultProps,
            filteredList: props.filteredList,
            noFilterMatches: props.noFilterMatches,
          }),
        { initialProps: { filteredList: [{ id: 1 }], noFilterMatches: false } },
      );

      // Simulate filter returning no results
      rerender({ filteredList: [], noFilterMatches: true });

      await waitFor(() => {
        expect(noMatchesFocusSpy.called).to.be.true;
        expect(showingRxFocusSpy.called).to.be.false;
      });
    });
  });
});
