import { expect } from 'chai';
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import user from '../fixtures/user.json';
import { convertMhvRadiologyRecord } from '../../util/imagesUtil';
import RadiologyDetailsPage from '../../containers/RadiologyDetailsPage';
import radiologyMhv from '../fixtures/radiologyMhv.json';

describe('RadiologyDetailsPage container', () => {
  const initialState = {
    user,
    mr: {
      radiology: {
        radiologyDetails: convertMhvRadiologyRecord({
          ...radiologyMhv,
          hash: 'test-hash',
        }),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <Switch>
        <Route path="/imaging-results/:radiologyId">
          <RadiologyDetailsPage />
        </Route>
      </Switch>,
      {
        initialState,
        reducers: reducer,
        path: '/imaging-results/r5621490-test-hash',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('displays a print button', () => {
    const printButton = screen.getByTestId('print-download-menu');
    expect(printButton).to.exist;
  });

  it('displays the procedure name as an h1', () => {
    const testName = screen.getByText('DEXA, PERIPHERAL STUDY', {
      exact: true,
      selector: 'h1',
    });
    expect(testName).to.exist;
  });

  it('displays the imaging provider', () => {
    expect(screen.getByText('Imaging provider', { exact: true })).to.exist;
  });
});

describe('RadiologyDetailsPage loading', () => {
  it('displays a loading indicator', () => {
    const initialState = {
      user,
      mr: {
        radiology: {},
      },
    };

    const screen = renderWithStoreAndRouter(
      <Switch>
        <Route path="/imaging-results/:radiologyId">
          <RadiologyDetailsPage />
        </Route>
      </Switch>,
      {
        initialState,
        reducers: reducer,
        path: '/imaging-results/r12345',
      },
    );

    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('RadiologyDetailsPage container with errors', () => {
  it('displays an error', async () => {
    const initialState = {
      user,
      mr: {
        radiology: {},
        alerts: {
          alertList: [
            {
              datestamp: '2023-10-10T16:03:28.568Z',
              isActive: true,
              type: 'error',
            },
            {
              datestamp: '2023-10-10T16:03:28.572Z',
              isActive: true,
              type: 'error',
            },
          ],
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <Switch>
        <Route path="/imaging-results/:radiologyId">
          <RadiologyDetailsPage />
        </Route>
      </Switch>,
      {
        initialState,
        reducers: reducer,
        path: '/imaging-results/r123',
      },
    );

    await waitFor(() => {
      expect(screen.getByTestId('expired-alert-message')).to.exist;
    });
  });
});
