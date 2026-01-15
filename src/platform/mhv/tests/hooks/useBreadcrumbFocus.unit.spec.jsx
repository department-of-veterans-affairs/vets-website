import { expect } from 'chai';
import sinon from 'sinon';
import { act, renderHook } from '@testing-library/react-hooks';

import { useBreadcrumbFocus } from '../../hooks/useBreadcrumbFocus';

const makeRouteChangeEvent = href => ({ detail: { href } });

const makeClickEventWithComposedPath = nodes => ({
  composedPath: () => nodes,
});

const setupH1 = () => {
  document.body.innerHTML = '<h1 tabindex="-1">Test H1</h1>';
  return document.querySelector('h1');
};

describe('useBreadcrumbFocus', () => {
  let setTimeoutStub;

  beforeEach(() => {
    document.body.innerHTML = '';

    // Align "current URL" with tests
    window.history.pushState({}, '', '/my-health/secure-messages/inbox/');

    setTimeoutStub = sinon.stub(window, 'setTimeout').callsFake((fn, _ms) => {
      fn();
      return 0;
    });
  });

  afterEach(() => {
    if (setTimeoutStub?.restore) setTimeoutStub.restore();
    document.body.innerHTML = '';
  });

  it('handleRouteChange: focuses H1 when href matches current URL (no navigation)', () => {
    const h1 = setupH1();
    const h1FocusSpy = sinon.spy(h1, 'focus');
    const onRouteChange = sinon.spy();

    const { result } = renderHook(() => useBreadcrumbFocus({ onRouteChange }));

    act(() => {
      result.current.handleRouteChange(
        makeRouteChangeEvent('/my-health/secure-messages/inbox/'),
      );
    });

    expect(onRouteChange.called).to.equal(false);
    expect(h1FocusSpy.called).to.equal(true);
  });

  it('handleRouteChange: calls onRouteChange and focuses H1 when href differs', () => {
    const h1 = setupH1();
    const h1FocusSpy = sinon.spy(h1, 'focus');
    const onRouteChange = sinon.spy();

    const { result } = renderHook(() => useBreadcrumbFocus({ onRouteChange }));

    act(() => {
      result.current.handleRouteChange(
        makeRouteChangeEvent('/my-health/secure-messages/sent/'),
      );
    });

    expect(onRouteChange.calledOnce).to.equal(true);
    expect(h1FocusSpy.called).to.equal(true);
  });

  it('handleClick: focuses H1 when composed path contains aria-current="page"', () => {
    const h1 = setupH1();
    const h1FocusSpy = sinon.spy(h1, 'focus');

    const { result } = renderHook(() => useBreadcrumbFocus());

    const currentCrumbNode = {
      getAttribute: name => (name === 'aria-current' ? 'page' : null),
    };

    act(() => {
      result.current.handleClick(
        makeClickEventWithComposedPath([currentCrumbNode]),
      );
    });

    expect(h1FocusSpy.called).to.equal(true);
  });

  it('handleClick: does not focus H1 for non-current crumb clicks (no aria-current)', () => {
    const h1 = setupH1();
    const h1FocusSpy = sinon.spy(h1, 'focus');

    const { result } = renderHook(() => useBreadcrumbFocus());

    const nonCurrentNode = { getAttribute: () => null };

    act(() => {
      result.current.handleClick(
        makeClickEventWithComposedPath([nonCurrentNode]),
      );
    });

    expect(h1FocusSpy.called).to.equal(false);
  });
});
