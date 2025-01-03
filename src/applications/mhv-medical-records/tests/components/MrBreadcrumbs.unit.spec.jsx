import { expect } from 'chai';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';

import {
  renderWithStoreAndRouter,
  renderInReduxProvider,
} from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import Sinon from 'sinon';
import reducer from '../../reducers';
import MrBreadcrumbs from '../../components/MrBreadcrumbs';

describe('MrBreadcrumbs component', () => {
  let querySelector;

  beforeEach(() => {
    querySelector = window.document.querySelector;
  });

  afterEach(() => {
    window.document.querySelector = querySelector;
  });

  it('should display breadcrumbs on the landing page', () => {
    const initialState = {
      mr: {
        breadcrumbs: {
          crumbsList: [
            {
              href: '/',
              label: 'VA.gov home',
            },
            {
              href: '/my-health',
              label: 'My HealtheVet',
            },
            {
              href: '/',
              label: 'Medical records',
              isRouterLink: true,
            },
          ],
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_integration_medical_records_to_phase_1: true,
      },
    };

    const screen = renderWithStoreAndRouter(<MrBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: '/',
    });
    const header = screen.getByTestId('breadcrumbs');
    expect(header).to.exist;
  });

  it('tests the page number logic', () => {
    const initialState = {
      mr: {
        pageTracker: {
          pageNumber: 10,
        },
        breadcrumbs: {
          crumbsList: [
            {
              href: '/',
              label: 'VA.gov home',
            },
            {
              href: '/my-health',
              label: 'My HealtheVet',
            },
            {
              href: '/',
              label: 'Medical records',
              isRouterLink: true,
            },
          ],
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_integration_medical_records_to_phase_1: true,
      },
    };
    window.document.querySelector = Sinon.stub().returns({
      textContent: 'test',
    });
    const screen = renderInReduxProvider(
      <MemoryRouter initialEntries={[`/vitals/blood-pressure-history`]}>
        <Route path="/vitals/blood-pressure-history">
          <MrBreadcrumbs />
        </Route>
      </MemoryRouter>,
      {
        initialState,
        reducers: reducer,
      },
    );
    const header = screen.getByTestId('breadcrumbs');
    expect(header).to.exist;
  });

  it('tests the default useEffect case', () => {
    const initialState = {
      mr: {
        breadcrumbs: {
          crumbsList: [
            {
              href: '/',
              label: 'VA.gov home',
            },
            {
              href: '/my-health',
              label: 'My HealtheVet',
            },
            {
              href: '/',
              label: 'Medical records',
              isRouterLink: true,
            },
          ],
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_integration_medical_records_to_phase_1: true,
      },
    };
    window.document.querySelector = Sinon.stub().returns({
      textContent: 'test',
    });
    const screen = renderInReduxProvider(
      <MemoryRouter initialEntries={[`/vitals/blood-pressure-history`]}>
        <Route path="/vitals/blood-pressure-history">
          <MrBreadcrumbs />
        </Route>
      </MemoryRouter>,
      {
        initialState,
        reducers: reducer,
      },
    );
    const header = screen.getByTestId('breadcrumbs');
    expect(header).to.exist;
  });

  it('phase 1 disabled && no crumbs list && on the home page, should display the no-crumbs div', () => {
    const initialState = {
      mr: {
        breadcrumbs: {
          crumbsList: null,
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_integration_medical_records_to_phase_1: false,
      },
    };

    const screen = renderWithStoreAndRouter(<MrBreadcrumbs />, {
      initialState,
      reducers: reducer,
    });
    const { getByTestId } = screen;
    expect(getByTestId('no-crumbs-list-display')).to.exist;
  });

  it('checks the lab test bread crumbs', () => {
    const initialState = {
      mr: {
        breadcrumbs: {
          crumbsList: [
            {
              href: '/',
              label: 'VA.gov home',
            },
            {
              href: '/my-health',
              label: 'My HealtheVet',
            },
            {
              href: '/',
              label: 'Medical records',
              isRouterLink: true,
            },
          ],
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_integration_medical_records_to_phase_1: true,
      },
    };
    const screen = renderInReduxProvider(
      <MemoryRouter initialEntries={[`/labs-and-tests/123`]}>
        <Route path="/labs-and-tests/:labId">
          <MrBreadcrumbs />
        </Route>
      </MemoryRouter>,
      {
        initialState,
        reducers: reducer,
      },
    );
    const { getByTestId } = screen;
    expect(getByTestId('mr-breadcrumbs')).to.exist;
  });
});
