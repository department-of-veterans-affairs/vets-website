import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import NewRecordsIndicator from '../../../components/shared/NewRecordsIndicator';
import { refreshExtractTypes } from '../../../util/constants';

const mockStore = configureStore([]);

describe('NewRecordsIndicator', () => {
  afterEach(() => {
    cleanup();
  });

  const now = new Date();

  const minutesBefore = (date, minutes) => {
    return new Date(date.getTime() - minutes * 60 * 1000);
  };

  /**
   * Build a mock refreshState with the given timestamps (in minutes before `now`).
   *
   * @param {*} requested minutes before now for lastRequested
   * @param {*} completed minutes before now for lastCompleted
   * @param {*} successful minutes before now for lastSuccessfulCompleted
   */
  const generateState = (requested, completed, successful) => {
    return {
      statusDate: now,
      status: [
        {
          extract: 'VPR',
          lastRequested: minutesBefore(now, requested),
          lastCompleted: minutesBefore(now, completed),
          lastSuccessfulCompleted: minutesBefore(now, successful),
        },
      ],
      // phase and isTimedOut can be omitted; getStatusExtractListPhase will compute phase,
      // and isTimedOut defaults to false (falsy)
    };
  };

  const createStore = refreshState => {
    return mockStore({
      mr: {
        refresh: refreshState,
      },
    });
  };

  const renderWithState = (refreshState, newRecordsFound) => {
    const store = createStore(refreshState);
    return render(
      <Provider store={store}>
        <NewRecordsIndicator
          extractType={refreshExtractTypes.VPR}
          newRecordsFound={newRecordsFound}
          reloadFunction={() => {}}
        />
      </Provider>,
    );
  };

  const renderRefreshInProgressState = () => {
    // lastRequested (10) is more recent than lastCompleted (80), so phase === IN_PROGRESS
    const refreshState = generateState(10, 80, 80);
    return renderWithState(refreshState, false);
  };

  it('should display the "last updated" card when refresh was not run', () => {
    // lastRequested (10) < lastCompleted (5) and lastSuccessful = 5 → phase === CURRENT,
    // so refreshedOnThisPage remains false, and lastSuccessfulUpdate exists
    const refreshState = generateState(10, 5, 5);
    const screen = renderWithState(refreshState, false);

    // Only the no-print card should be visible for screen; it has data-testid="new-records-last-updated"
    const lastUpdatedCard = screen.getByTestId('new-records-last-updated');
    expect(lastUpdatedCard).to.exist;
  });

  it('should display a spinner if refresh is currently running', () => {
    const screen = renderRefreshInProgressState();

    const spinner = screen.getByTestId('new-records-loading-indicator');
    expect(spinner).to.exist;
  });

  it('should display the green box if refresh ran and records are current (no new records)', async () => {
    // Start in a refresh-in-progress state so that refreshedOnThisPage becomes true
    const initialRender = renderRefreshInProgressState();

    // Rerender with a "CURRENT" state: lastRequested < lastCompleted, lastSuccessful === lastCompleted,
    // so phase === CURRENT. newRecordsFound = false → shows the green "up to date" alert.
    const currentState = generateState(10, 5, 5);
    const newStore = createStore(currentState);

    initialRender.rerender(
      <Provider store={newStore}>
        <NewRecordsIndicator
          extractType={refreshExtractTypes.VPR}
          newRecordsFound={false}
          reloadFunction={() => {}}
        />
      </Provider>,
    );

    await waitFor(() => {
      // The success alert (up to date) has data-testid="new-records-refreshed-current"
      expect(initialRender.getByTestId('new-records-refreshed-current')).to
        .exist;
      // All other possible indicators should not be present
      expect(() =>
        initialRender.getByTestId('new-records-refreshed-stale'),
      ).to.throw();
      expect(() =>
        initialRender.getByTestId('new-records-loading-indicator'),
      ).to.throw();
      expect(() =>
        initialRender.getByTestId('new-records-refreshed-failed'),
      ).to.throw();
      expect(() =>
        initialRender.getByTestId('new-records-refreshed-call_failed'),
      ).to.throw();
    });
  });

  it('should display the blue box if refresh ran and records are stale (newRecordsFound=true)', async () => {
    // Begin with IN_PROGRESS so refreshedOnThisPage becomes true
    const initialRender = renderRefreshInProgressState();

    // Rerender with same CURRENT state but newRecordsFound=true → shows the stale alert
    const staleState = generateState(10, 5, 5); // phase === CURRENT
    const newStore = createStore(staleState);

    initialRender.rerender(
      <Provider store={newStore}>
        <NewRecordsIndicator
          extractType={refreshExtractTypes.VPR}
          newRecordsFound
          reloadFunction={() => {}}
        />
      </Provider>,
    );

    await waitFor(() => {
      // The "Reload to get updates" alert has data-testid="new-records-refreshed-stale"
      expect(initialRender.getByTestId('new-records-refreshed-stale')).to.exist;
      expect(() =>
        initialRender.getByTestId('new-records-refreshed-current'),
      ).to.throw();
      expect(() =>
        initialRender.getByTestId('new-records-loading-indicator'),
      ).to.throw();
      expect(() =>
        initialRender.getByTestId('new-records-refreshed-failed'),
      ).to.throw();
      expect(() =>
        initialRender.getByTestId('new-records-refreshed-call_failed'),
      ).to.throw();
    });
  });

  it('should display the yellow box if refresh ran and there was an error', async () => {
    // Begin with IN_PROGRESS so refreshedOnThisPage becomes true
    const initialRender = renderRefreshInProgressState();

    // Rerender with a FAILED state: lastSuccessful (80) is older than lastCompleted (5) → phase === FAILED
    const failedState = generateState(10, 5, 80);
    const newStore = createStore(failedState);

    initialRender.rerender(
      <Provider store={newStore}>
        <NewRecordsIndicator
          extractType={refreshExtractTypes.VPR}
          newRecordsFound
          reloadFunction={() => {}}
        />
      </Provider>,
    );

    await waitFor(() => {
      // The FAILED alert has data-testid="new-records-refreshed-failed"
      expect(initialRender.getByTestId('new-records-refreshed-failed')).to
        .exist;
      expect(() =>
        initialRender.getByTestId('new-records-refreshed-call_failed'),
      ).to.throw();
      expect(() =>
        initialRender.getByTestId('new-records-refreshed-stale'),
      ).to.throw();
      expect(() =>
        initialRender.getByTestId('new-records-refreshed-current'),
      ).to.throw();
      expect(() =>
        initialRender.getByTestId('new-records-loading-indicator'),
      ).to.throw();
    });
  });
});
