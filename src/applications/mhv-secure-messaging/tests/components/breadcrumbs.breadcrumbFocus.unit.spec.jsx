import React from 'react';
import { expect } from 'chai';
import Sinon from 'sinon';
import { act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import SmBreadcrumbs from '../../components/shared/SmBreadcrumbs';
import reducer from '../../reducers';

describe('SmBreadcrumbs breadcrumb focus behavior (MHV)', () => {
  let setTimeoutStub;
  let originalMatchMedia;

  const SM_BASENAME = '/my-health/secure-messages';

  const mountSmBreadcrumbsAtPath = (productionPath, crumbsList) => {
    window.history.pushState({}, '', productionPath);

    const initialState = {
      // Common platform state slices many MHV components expect
      user: {
        login: { currentlyLoggedIn: true },
        profile: { services: ['mhv-secure-messaging'] },
      },
      featureToggles: {
        loading: false,
        // keep shape compatible; some code expects an array of toggles
        toggles: [],
      },

      // SM slice
      sm: {
        folders: {
          folder: { folderId: 0, name: 'Inbox' },
          folderList: [
            { folderId: 0, name: 'Inbox' },
            { folderId: -1, name: 'Sent' },
          ],
        },
        breadcrumbs: {
          list: [],
          crumbsList,
          previousUrl: '',
        },
        threadDetails: {
          drafts: [],
        },
      },
    };

    return renderInReduxProvider(
      <MemoryRouter initialEntries={[productionPath]}>
        <SmBreadcrumbs />
      </MemoryRouter>,
      { initialState, reducers: reducer },
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
    document.body.innerHTML = '<h1 tabindex="-1">Secure messages</h1>';

    originalMatchMedia = window.matchMedia;
    window.matchMedia =
      originalMatchMedia ||
      (() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: () => {}, // deprecated
        removeListener: () => {}, // deprecated
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }));

    setTimeoutStub = Sinon.stub(window, 'setTimeout').callsFake(fn => {
      fn();
      return 0;
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    if (setTimeoutStub?.restore) setTimeoutStub.restore();
    window.matchMedia = originalMatchMedia;
  });

  [
    {
      name: 'Inbox',
      productionPath: `${SM_BASENAME}/inbox/`,
      currentCrumb: { href: `${SM_BASENAME}/inbox/`, label: 'Inbox' },
    },
    {
      name: 'Sent',
      productionPath: `${SM_BASENAME}/sent/`,
      currentCrumb: { href: `${SM_BASENAME}/sent/`, label: 'Sent' },
    },
    {
      name: 'More folders',
      productionPath: `${SM_BASENAME}/folders/`,
      currentCrumb: { href: `${SM_BASENAME}/folders/`, label: 'More folders' },
    },
  ].forEach(({ name, productionPath, currentCrumb }) => {
    it(`${name}: clicking current breadcrumb focuses H1`, () => {
      const h1 = document.querySelector('h1');
      const focusSpy = Sinon.spy(h1, 'focus');

      const screen = mountSmBreadcrumbsAtPath(productionPath, [
        { href: '/', label: 'VA.gov home' },
        { href: '/my-health', label: 'My HealtheVet' },
        { href: SM_BASENAME, label: 'Secure messages' },
        currentCrumb,
      ]);

      const breadcrumbsEl = screen.container.querySelector('va-breadcrumbs');
      expect(breadcrumbsEl).to.exist;

      act(() => {
        dispatchCurrentCrumbClick(breadcrumbsEl);
      });

      expect(focusSpy.called).to.equal(true);
    });
  });
});
