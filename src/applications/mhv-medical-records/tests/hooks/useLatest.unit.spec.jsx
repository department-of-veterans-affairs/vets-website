import { expect } from 'chai';
import { renderHook } from '@testing-library/react-hooks';
import useLatest from '../../hooks/useLatest';

describe('useLatest', () => {
  it('returns a ref initialized to the provided value', () => {
    const { result } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: 'a' },
    });

    expect(result.current).to.have.property('current', 'a');
  });

  it('keeps the same ref object across rerenders while updating .current', () => {
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: 'first' },
    });

    const firstRef = result.current;
    expect(firstRef.current).to.equal('first');

    rerender({ value: 'second' });
    expect(result.current).to.equal(firstRef);
    expect(result.current.current).to.equal('second');

    rerender({ value: { nested: true } });
    expect(result.current).to.equal(firstRef);
    expect(result.current.current).to.deep.equal({ nested: true });
  });
});
