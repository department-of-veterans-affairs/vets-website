import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import sinon from 'sinon';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { usePageTitle } from '../../hooks/usePageTitle';

describe('usePageTitle', () => {
  let sandbox;
  let updatePageTitleSpy;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    updatePageTitleSpy = sandbox.spy(updatePageTitle);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('calls updatePageTitle on mount', async () => {
    renderHook(() =>
      usePageTitle('Medications Page', { updatePageTitle: updatePageTitleSpy }),
    );

    await waitFor(() => {
      expect(updatePageTitleSpy.calledWith('Medications Page')).to.be.true;
    });
  });

  it('calls updatePageTitle again when title changes', async () => {
    const { rerender } = renderHook(
      title => usePageTitle(title, { updatePageTitle: updatePageTitleSpy }),
      { initialProps: 'Title 1' },
    );

    await waitFor(() => {
      expect(updatePageTitleSpy.calledWith('Title 1')).to.be.true;
    });

    rerender('Title 2');

    await waitFor(() => {
      expect(updatePageTitleSpy.callCount).to.equal(2);
      expect(updatePageTitleSpy.secondCall.calledWith('Title 2')).to.be.true;
    });
  });

  it('does not call updatePageTitle again if title is the same', async () => {
    const { rerender } = renderHook(
      title => usePageTitle(title, { updatePageTitle: updatePageTitleSpy }),
      { initialProps: 'Title 1' },
    );

    await waitFor(() => {
      expect(updatePageTitleSpy.calledWith('Title 1')).to.be.true;
    });

    rerender('Title 1');

    // Wait a tick to ensure the effect runs
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(updatePageTitleSpy.callCount).to.equal(1);
  });
});
