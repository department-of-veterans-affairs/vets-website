import { expect } from 'chai';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';

import {
  renderWithStoreAndRouter,
  renderInReduxProvider,
} from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import Sinon from 'sinon';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
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
    const header = screen.getByTestId('mr-breadcrumbs');
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
    const header = screen.getByTestId('mr-breadcrumbs');
    expect(header).to.exist;
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

  it('tests the time frame in the url logic', () => {
    const initialState = {
      mr: {
        pageTracker: {},
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
    };
    window.document.querySelector = Sinon.stub().returns({
      textContent: 'test',
    });
    const dispatchSpy = Sinon.spy();
    const mockStore = {
      getState: () => ({
        ...initialState,
      }),
      subscribe: () => {},
      dispatch: action => {
        action(dispatchSpy);
        expect(dispatchSpy.called).to.be.true;
        Sinon.assert.calledWith(
          dispatchSpy,
          Sinon.match(params => {
            expect(params.type).to.equal('MR_SET_BREAD_CRUMBS');
            expect(params.payload).to.exist;
            expect(params.payload.crumbs).to.exist;
            expect(params.payload.crumbs.length).to.equal(2);
            expect(params.payload.crumbs[0].href).to.equal(
              '/vitals?timeFrame=2024-02',
            );
            return true;
          }),
        );
      },
    };

    const screen = render(
      <MemoryRouter
        initialEntries={[`/vitals/blood-pressure-history?timeFrame=2024-02`]}
      >
        <Route path="/vitals/blood-pressure-history">
          <Provider store={mockStore}>
            <MrBreadcrumbs />
          </Provider>
        </Route>
      </MemoryRouter>,
    );

    const header = screen.getByTestId('mr-breadcrumbs');
    expect(header).to.exist;
  });
});
