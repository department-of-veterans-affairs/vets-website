import React from 'react';
import { expect } from 'chai';
import Sinon from 'sinon';
import { act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import reducer from '../../reducers';
import MrBreadcrumbs from '../../components/MrBreadcrumbs';

describe('MrBreadcrumbs breadcrumb focus behavior (MHV)', () => {
  let setTimeoutStub;

  const MR_BASENAME = '/my-health/medical-records';

  const toInternalMrRoute = productionPath => {
    const prefix = '/my-health/medical-records';
    if (!productionPath?.startsWith(prefix)) return productionPath || '/';

    const stripped = productionPath.slice(prefix.length);
    if (!stripped) return '/';
    if (stripped.startsWith('/')) return stripped;

    return `/${stripped}`;
  };

  const mountMrBreadcrumbsAtPath = (productionPath, crumbsList) => {
    // Hook compares against window.location, so set it to the *production* URL
    window.history.pushState({}, '', productionPath);

    // MrBreadcrumbs reads react-router location; unit tests for MR use internal routes
    const routerPath = toInternalMrRoute(productionPath);

    const initialState = {
      mr: {
        pageTracker: { pageNumber: 1 },
        breadcrumbs: { crumbsList },
      },
    };

    return renderInReduxProvider(
      <MemoryRouter initialEntries={[routerPath]}>
        <MrBreadcrumbs />
      </MemoryRouter>,
      { initialState, reducers: reducer },
    );
  };

  const getBreadcrumbsEl = screen =>
    screen.container.querySelector('va-breadcrumbs');

  const dispatchRouteChange = (el, href) => {
    el.dispatchEvent(
      new CustomEvent('routeChange', {
        bubbles: true,
        composed: true,
        detail: { href },
      }),
    );
  };

  const dispatchCurrentCrumbClick = el => {
    const currentCrumbNode = {
      getAttribute: name => (name === 'aria-current' ? 'page' : null),
    };

    const evt = new Event('click', { bubbles: true, cancelable: true });
    evt.composedPath = () => [currentCrumbNode];
    el.dispatchEvent(evt);
  };

  beforeEach(() => {
    document.body.innerHTML = '<h1 tabindex="-1">Medical records</h1>';

    // focusH1Soon uses setTimeout; make it deterministic
    setTimeoutStub = Sinon.stub(window, 'setTimeout').callsFake(fn => {
      fn();
      return 0;
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    if (setTimeoutStub?.restore) setTimeoutStub.restore();
  });

  it('MR landing crumb: from Labs & tests, selecting "Medical records" breadcrumb focuses H1', () => {
    const productionPath = `${MR_BASENAME}/labs-and-tests`;

    const h1 = document.querySelector('h1');
    const focusSpy = Sinon.spy(h1, 'focus');

    const screen = mountMrBreadcrumbsAtPath(productionPath, [
      { href: '/', label: 'VA.gov home' },
      { href: '/my-health', label: 'My HealtheVet' },

      // NOTE: In production this is `${MR_BASENAME}`, but MR unit-test routing uses internal paths.
      // We still validate the *focus* behavior triggered by breadcrumb navigation.
      { href: '/', label: 'Medical records' },

      { href: '/labs-and-tests', label: 'Labs and tests' },
    ]);

    const breadcrumbsEl = getBreadcrumbsEl(screen);
    expect(breadcrumbsEl).to.exist;

    act(() => {
      // Simulate navigating "up" a crumb (internal MR route)
      dispatchRouteChange(breadcrumbsEl, '/');
    });

    expect(focusSpy.called).to.equal(true);
  });

  [
    {
      name: 'MR landing page',
      productionPath: MR_BASENAME,
      currentCrumb: { href: MR_BASENAME, label: 'Medical records' },
    },
    {
      name: 'MR Lab and test results page',
      productionPath: `${MR_BASENAME}/labs-and-tests`,
      currentCrumb: {
        href: `${MR_BASENAME}/labs-and-tests`,
        label: 'Labs and tests',
      },
    },
    {
      name: 'MR Care summaries and notes page',
      productionPath: `${MR_BASENAME}/care-summaries-and-notes`,
      currentCrumb: {
        href: `${MR_BASENAME}/care-summaries-and-notes`,
        label: 'Care summaries and notes',
      },
    },
    {
      name: 'MR Vaccines page',
      productionPath: `${MR_BASENAME}/vaccines`,
      currentCrumb: { href: `${MR_BASENAME}/vaccines`, label: 'Vaccines' },
    },
    {
      name: 'MR Allergies and reactions page',
      productionPath: `${MR_BASENAME}/allergies`,
      currentCrumb: {
        href: `${MR_BASENAME}/allergies`,
        label: 'Allergies and reactions',
      },
    },
    {
      name: 'MR Health conditions page',
      productionPath: `${MR_BASENAME}/conditions`,
      currentCrumb: {
        href: `${MR_BASENAME}/conditions`,
        label: 'Health conditions',
      },
    },
    {
      name: 'MR Vitals page',
      productionPath: `${MR_BASENAME}/vitals`,
      currentCrumb: { href: `${MR_BASENAME}/vitals`, label: 'Vitals' },
    },
  ].forEach(({ name, productionPath, currentCrumb }) => {
    it(`${name}: clicking current breadcrumb focuses H1`, () => {
      const h1 = document.querySelector('h1');
      const focusSpy = Sinon.spy(h1, 'focus');

      const screen = mountMrBreadcrumbsAtPath(productionPath, [
        { href: '/', label: 'VA.gov home' },
        { href: '/my-health', label: 'My HealtheVet' },
        { href: MR_BASENAME, label: 'Medical records' },
        currentCrumb,
      ]);

      const breadcrumbsEl = getBreadcrumbsEl(screen);
      expect(breadcrumbsEl).to.exist;

      act(() => {
        dispatchCurrentCrumbClick(breadcrumbsEl);
      });

      expect(focusSpy.called).to.equal(true);
    });
  });
});
