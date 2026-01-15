import React, { useEffect } from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderHook, act } from '@testing-library/react-hooks';
import { MemoryRouter, useLocation } from 'react-router-dom-v5-compat';

import { useBreadcrumbFocus } from '../../hooks/useBreadcrumbFocus';

const makeRouteChangeEvent = href => ({ detail: { href } });

const makeClickEventWithComposedPath = nodes => ({
  composedPath: () => nodes,
});

const setupH1 = () => {
  document.body.innerHTML = '<h1 tabindex="-1">Test H1</h1>';
  return document.querySelector('h1');
};

const LocationObserver = ({ onChange }) => {
  const loc = useLocation();
  useEffect(() => onChange(loc), [loc, onChange]);
  return null;
};

describe('useBreadcrumbFocus', () => {
  let setTimeoutStub;
  let latestLocation;

  beforeEach(() => {
    document.body.innerHTML = '';
    latestLocation = null;

    setTimeoutStub = sinon.stub(window, 'setTimeout').callsFake((fn, _ms) => {
      fn();
      return 0;
    });
  });

  afterEach(() => {
    if (setTimeoutStub?.restore) setTimeoutStub.restore();
    document.body.innerHTML = '';
  });

  const renderUseBreadcrumbFocus = (
    initialPath = '/my-health/secure-messages/inbox/',
  ) => {
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={[initialPath]}>
        <LocationObserver
          onChange={loc => {
            latestLocation = loc;
          }}
        />
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(() => useBreadcrumbFocus(), { wrapper });
    if (result?.error) throw result.error;
    return result;
  };

  it('handleRouteChange: focuses H1 when href matches current URL (no navigation)', () => {
    const h1 = setupH1();
    const h1FocusSpy = sinon.spy(h1, 'focus');

    const result = renderUseBreadcrumbFocus(
      '/my-health/secure-messages/inbox/',
    );

    act(() => {
      result.current.handleRouteChange(
        makeRouteChangeEvent('/my-health/secure-messages/inbox/'),
      );
    });

    expect(latestLocation.pathname).to.equal(
      '/my-health/secure-messages/inbox/',
    );
    expect(h1FocusSpy.called).to.equal(true);
  });

  it('handleRouteChange: navigates and focuses H1 when href differs', () => {
    const h1 = setupH1();
    const h1FocusSpy = sinon.spy(h1, 'focus');

    const result = renderUseBreadcrumbFocus(
      '/my-health/secure-messages/inbox/',
    );

    act(() => {
      result.current.handleRouteChange(
        makeRouteChangeEvent('/my-health/secure-messages/sent/'),
      );
    });

    expect(latestLocation.pathname).to.equal(
      '/my-health/secure-messages/sent/',
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
