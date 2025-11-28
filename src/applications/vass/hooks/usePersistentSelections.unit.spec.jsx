import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { usePersistentSelections } from './usePersistentSelections';

// Custom renderHook function for testing hooks
function renderHook(renderCallback, options = {}) {
  const { initialProps, ...renderOptions } = options;
  const result = React.createRef();
  result.current = null;

  function TestComponent({ renderCallbackProps }) {
    const hookResult = renderCallback(renderCallbackProps);
    result.current = hookResult;

    React.useEffect(() => {
      result.current = hookResult;
    });

    return null;
  }

  const { rerender: baseRerender, unmount } = render(
    <TestComponent renderCallbackProps={initialProps} />,
    renderOptions,
  );

  function rerender(rerenderCallbackProps) {
    return baseRerender(
      <TestComponent renderCallbackProps={rerenderCallbackProps} />,
    );
  }

  return { result, rerender, unmount };
}

describe('usePersistentSelections', () => {
  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sandbox.restore();
    localStorage.clear();
  });
  beforeEach(() => {
    localStorage.setItem(
      'vass-selections-123',
      JSON.stringify({
        selectedSlotTime: '2021-01-01T00:00:00.000Z',
        selectedTopicsIds: ['id-1', 'id-2'],
      }),
    );
  });
  describe('when selections are in localStorage', () => {
    const uuid = '123';
    it('should save and retrieve selections', () => {
      const { result } = renderHook(() => usePersistentSelections(uuid));
      const { getSaved } = result.current;
      expect(getSaved()).to.deep.equal({
        selectedSlotTime: '2021-01-01T00:00:00.000Z',
        selectedTopicsIds: ['id-1', 'id-2'],
      });
    });
    it('should save date selection and update only the date selection', () => {
      const { result } = renderHook(() => usePersistentSelections(uuid));
      const { saveDateSelection, getSaved } = result.current;
      saveDateSelection('2021-01-02T00:00:00.000Z');
      expect(getSaved()).to.deep.equal({
        selectedSlotTime: '2021-01-02T00:00:00.000Z',
        selectedTopicsIds: ['id-1', 'id-2'],
      });
    });
    it('should save topics selection and update only the topics selection', () => {
      const { result } = renderHook(() => usePersistentSelections(uuid));
      const { saveTopicsSelection, getSaved } = result.current;
      saveTopicsSelection(['id-3', 'id-4']);
      expect(getSaved()).to.deep.equal({
        selectedSlotTime: '2021-01-01T00:00:00.000Z',
        selectedTopicsIds: ['id-3', 'id-4'],
      });
    });
  });
  describe('when selections are not in localStorage', () => {
    const uuid = '456';
    it('should return initial selections', () => {
      const { result } = renderHook(() => usePersistentSelections(uuid));
      const { getSaved } = result.current;
      expect(getSaved()).to.deep.equal({
        selectedSlotTime: null,
        selectedTopicsIds: [],
      });
    });

    it('should save date selection and update only the date selection', () => {
      const { result } = renderHook(() => usePersistentSelections(uuid));
      const { saveDateSelection, getSaved } = result.current;
      saveDateSelection('2021-01-02T00:00:00.000Z');
      expect(getSaved()).to.deep.equal({
        selectedSlotTime: '2021-01-02T00:00:00.000Z',
        selectedTopicsIds: [],
      });
    });
    it('should save topics selection and update only the topics selection', () => {
      const { result } = renderHook(() => usePersistentSelections(uuid));
      const { saveTopicsSelection, getSaved } = result.current;
      saveTopicsSelection(['id-3', 'id-4']);
      expect(getSaved()).to.deep.equal({
        selectedSlotTime: null,
        selectedTopicsIds: ['id-3', 'id-4'],
      });
    });
  });
  describe('when selections cannot be parsed', () => {
    it('should clear the invalid selections and return initial selections', () => {
      localStorage.setItem('vass-selections-123', 'invalid');
      const { result } = renderHook(() => usePersistentSelections('123'));
      const { getSaved } = result.current;
      expect(getSaved()).to.deep.equal({
        selectedSlotTime: null,
        selectedTopicsIds: [],
      });
      expect(localStorage.getItem('vass-selections-123')).to.be.null;
    });
  });
});
