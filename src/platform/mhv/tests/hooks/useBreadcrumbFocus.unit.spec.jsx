import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter, Route } from 'react-router-dom';

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
  let pushSpy;

  beforeEach(() => {
    document.body.innerHTML = '';

    // Run timeouts immediately (hook uses setTimeout before focusing).
    setTimeoutStub = sinon.stub(window, 'setTimeout').callsFake((fn, _ms) => {
      fn();
      return 0;
    });
  });

  afterEach(() => {
    if (pushSpy?.restore) pushSpy.restore();
    if (setTimeoutStub?.restore) setTimeoutStub.restore();
    document.body.innerHTML = '';
  });

  const renderUseBreadcrumbFocus = (
    initialPath = '/my-health/secure-messages/inbox/',
  ) => {
    let capturedHistory;

    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={[initialPath]}>
        <Route
          path="*"
          render={({ history }) => {
            capturedHistory = history;
            return children;
          }}
        />
      </MemoryRouter>
    );

    const { result } = renderHook(() => useBreadcrumbFocus(), { wrapper });

    if (result?.error) {
      throw result.error;
    }

    pushSpy = sinon.spy(capturedHistory, 'push');

    return result;
  };

  it('handleRouteChange: focuses H1 when href matches current URL (no navigation)', () => {
    const h1 = setupH1();
    const h1FocusSpy = sinon.spy(h1, 'focus');

    const result = renderUseBreadcrumbFocus(
      '/my-health/secure-messages/inbox/',
    );

    result.current.handleRouteChange(
      makeRouteChangeEvent('/my-health/secure-messages/inbox/'),
    );

    expect(pushSpy.called).to.equal(false);
    expect(h1FocusSpy.called).to.equal(true);
  });

  it('handleRouteChange: navigates (push) and focuses H1 when href differs', () => {
    const h1 = setupH1();
    const h1FocusSpy = sinon.spy(h1, 'focus');

    const result = renderUseBreadcrumbFocus(
      '/my-health/secure-messages/inbox/',
    );

    result.current.handleRouteChange(
      makeRouteChangeEvent('/my-health/secure-messages/sent/'),
    );

    expect(pushSpy.called).to.equal(true);
    expect(pushSpy.calledWith('/my-health/secure-messages/sent/')).to.equal(
      true,
    );
    expect(h1FocusSpy.called).to.equal(true);
  });

  it('handleClick: focuses H1 when composed path contains aria-current="page"', () => {
    const h1 = setupH1();
    const h1FocusSpy = sinon.spy(h1, 'focus');

    const result = renderUseBreadcrumbFocus();

    const currentCrumbNode = {
      getAttribute: name => (name === 'aria-current' ? 'page' : null),
    };

    result.current.handleClick(
      makeClickEventWithComposedPath([currentCrumbNode]),
    );

    expect(h1FocusSpy.called).to.equal(true);
  });

  it('handleClick: does not focus H1 for non-current crumb clicks (no aria-current)', () => {
    const h1 = setupH1();
    const h1FocusSpy = sinon.spy(h1, 'focus');

    const result = renderUseBreadcrumbFocus();

    const nonCurrentNode = { getAttribute: () => null };

    result.current.handleClick(
      makeClickEventWithComposedPath([nonCurrentNode]),
    );

    expect(h1FocusSpy.called).to.equal(false);
  });
});
