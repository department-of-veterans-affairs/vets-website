import React from 'react';
import { expect } from 'chai';
import Sinon from 'sinon';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import LandingPage from '../../components/LandingPage';
import reducers from '../../reducers';
import manifest from '../../manifest.json';

describe('MHV Landing Page breadcrumbs focus behavior', () => {
  let setTimeoutStub;

  const clickCurrentBreadcrumb = breadcrumbsEl => {
    const currentCrumbNode = {
      getAttribute: name => (name === 'aria-current' ? 'page' : null),
    };

    const evt = new Event('click', { bubbles: true, cancelable: true });
    evt.composedPath = () => [currentCrumbNode];
    breadcrumbsEl.dispatchEvent(evt);
  };

  beforeEach(() => {
    window.history.pushState({}, '', manifest.rootUrl);

    // Make focus timing deterministic if the hook uses setTimeout internally.
    setTimeoutStub = Sinon.stub(window, 'setTimeout').callsFake(fn => {
      fn();
      return 0;
    });
  });

  afterEach(() => {
    if (setTimeoutStub?.restore) setTimeoutStub.restore();
  });

  it('clicking the current breadcrumb focuses the page H1', () => {
    const initialState = {
      user: {
        profile: {
          loa: { current: 3 },
          vaPatient: true,
          signIn: { serviceName: 'logingov' },
          userFullName: { first: 'Sam' },
          mhvAccountState: 'OK',
          facilities: [],
        },
      },
    };

    const { container, getByRole } = renderInReduxProvider(<LandingPage />, {
      initialState,
      reducers,
    });

    const h1 = getByRole('heading', { level: 1, name: /My HealtheVet/i });
    const focusSpy = Sinon.spy(h1, 'focus');

    const breadcrumbsEl = container.querySelector('va-breadcrumbs');
    expect(breadcrumbsEl).to.exist;

    clickCurrentBreadcrumb(breadcrumbsEl);

    expect(focusSpy.called).to.equal(true);
  });
});
