import { expect } from 'chai';
import { renderHook } from '@testing-library/react-hooks';
import useSetPageTitle from '../../hooks/useSetPageTitle';

const originalTitle = document.title;

const appendTitle = title => `${title} | Veterans Affairs`;

describe('useSetPageTitle', () => {
  afterEach(() => {
    document.title = originalTitle;
  });

  it('should set document title when a title is provided', () => {
    const testTitle = 'Test Page Title';
    renderHook(() => useSetPageTitle(testTitle));

    expect(document.title).to.equal(appendTitle(testTitle));
  });

  it('should not change document title when title is null or undefined', () => {
    const beforeTest = document.title;

    renderHook(() => useSetPageTitle(null));
    expect(document.title).to.equal(beforeTest);

    renderHook(() => useSetPageTitle(undefined));
    expect(document.title).to.equal(beforeTest);
  });

  it('should update document title when title changes', () => {
    const initialTitle = 'Initial Title';
    const updatedTitle = 'Updated Title';

    const { rerender } = renderHook(({ title }) => useSetPageTitle(title), {
      initialProps: { title: initialTitle },
    });

    expect(document.title).to.equal(appendTitle(initialTitle));
    rerender({ title: updatedTitle });

    expect(document.title).to.equal(appendTitle(updatedTitle));
  });
});
