import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import NewRecordsIndicator from '../../../components/shared/NewRecordsIndicator';
import { refreshExtractTypes, refreshPhases } from '../../../util/constants';

describe('NewRecordsIndicator', () => {
  const now = new Date();

  const minutesBefore = (date, minutes) =>
    new Date(date.getTime() - minutes * 60 * 1000);

  // now supports explicit phase and isTimedOut
  const generateState = ({
    requested,
    completed,
    successful,
    phase = undefined,
    isTimedOut = false,
  }) => ({
    statusDate: now,
    status: [
      {
        extract: 'VPR',
        lastRequested: minutesBefore(now, requested),
        lastCompleted: minutesBefore(now, completed),
        lastSuccessfulCompleted: minutesBefore(now, successful),
      },
    ],
    phase,
    isTimedOut,
  });

  const renderWithState = (state, newRecordsFound = false) =>
    render(
      <NewRecordsIndicator
        refreshState={state}
        extractType={refreshExtractTypes.VPR}
        newRecordsFound={newRecordsFound}
        reloadFunction={() => {}}
      />,
    );

  it('should display "last updated" when no live refresh is in progress', () => {
    const state = generateState({ requested: 10, completed: 5, successful: 5 });
    const { getByTestId } = renderWithState(state, false);
    expect(getByTestId('new-records-last-updated')).to.exist;
  });

  it('should display a spinner if a refresh is currently running', () => {
    const state = generateState({
      requested: 10,
      completed: 80,
      successful: 80,
    });
    const { getByTestId } = renderWithState(state, false);
    expect(getByTestId('new-records-loading-indicator')).to.exist;
  });

  it('should display the green box if refresh ran and records are current', async () => {
    const initialState = generateState({
      requested: 10,
      completed: 80,
      successful: 80,
    });
    const { rerender, getByTestId, queryByTestId } = renderWithState(
      initialState,
      false,
    );

    const currentState = generateState({
      requested: 10,
      completed: 5,
      successful: 5,
    });
    rerender(
      <NewRecordsIndicator
        refreshState={currentState}
        extractType={refreshExtractTypes.VPR}
        newRecordsFound={false}
        reloadFunction={() => {}}
      />,
    );

    await waitFor(() => {
      expect(getByTestId('new-records-refreshed-current')).to.exist;
      expect(queryByTestId('new-records-refreshed-stale')).to.not.exist;
      expect(queryByTestId('new-records-loading-indicator')).to.not.exist;
      expect(queryByTestId('new-records-refreshed-failed')).to.not.exist;
      expect(queryByTestId('new-records-refreshed-call_failed')).to.not.exist;
    });
  });

  it('should display the blue box if refresh ran and records are stale', async () => {
    const initialState = generateState({
      requested: 10,
      completed: 80,
      successful: 80,
    });
    const { rerender, getByTestId, queryByTestId } = renderWithState(
      initialState,
      false,
    );

    const staleState = generateState({
      requested: 10,
      completed: 5,
      successful: 5,
    });
    rerender(
      <NewRecordsIndicator
        refreshState={staleState}
        extractType={refreshExtractTypes.VPR}
        newRecordsFound
        reloadFunction={() => {}}
      />,
    );

    await waitFor(() => {
      expect(getByTestId('new-records-refreshed-stale')).to.exist;
      expect(queryByTestId('new-records-refreshed-current')).to.not.exist;
      expect(queryByTestId('new-records-loading-indicator')).to.not.exist;
      expect(queryByTestId('new-records-refreshed-failed')).to.not.exist;
      expect(queryByTestId('new-records-refreshed-call_failed')).to.not.exist;
    });
  });

  it('should display the yellow box if refresh ran and there was an error', async () => {
    const initialState = generateState({
      requested: 10,
      completed: 80,
      successful: 80,
    });
    const { rerender, getByTestId, queryByTestId } = renderWithState(
      initialState,
      false,
    );

    const errorState = generateState({
      requested: 10,
      completed: 5,
      successful: 80,
    });
    rerender(
      <NewRecordsIndicator
        refreshState={errorState}
        extractType={refreshExtractTypes.VPR}
        newRecordsFound
        reloadFunction={() => {}}
      />,
    );

    await waitFor(() => {
      expect(queryByTestId('new-records-refreshed-call_failed')).to.not.exist;
      expect(getByTestId('new-records-refreshed-failed')).to.exist;
      expect(queryByTestId('new-records-refreshed-stale')).to.not.exist;
      expect(queryByTestId('new-records-refreshed-current')).to.not.exist;
      expect(queryByTestId('new-records-loading-indicator')).to.not.exist;
    });
  });

  it('should display call-failed alert when the refresh request itself fails', () => {
    const callFailedState = {
      statusDate: now,
      status: [],
      phase: refreshPhases.CALL_FAILED,
      isTimedOut: false,
    };

    const { getByTestId, queryByTestId } = renderWithState(callFailedState);

    expect(getByTestId('new-records-refreshed-call_failed')).to.exist;
    expect(queryByTestId('new-records-loading-indicator')).to.not.exist;
  });
});
