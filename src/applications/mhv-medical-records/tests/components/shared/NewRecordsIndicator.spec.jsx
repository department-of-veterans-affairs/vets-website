import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import NewRecordsIndicator from '../../../components/shared/NewRecordsIndicator';
import { refreshExtractTypes } from '../../../util/constants';

describe('NewRecordsIndicator', () => {
  const now = new Date();

  const minutesBefore = (date, minutes) => {
    return new Date(date.getTime() - minutes * 60 * 1000);
  };

  const renderRefreshInProgressState = () => {
    return render(
      <NewRecordsIndicator
        refreshState={{
          statusDate: now,
          status: [
            {
              extract: 'VPR',
              lastRequested: minutesBefore(now, 10),
              lastCompleted: minutesBefore(now, 80),
              lastSuccessfulCompleted: minutesBefore(now, 80),
            },
          ],
        }}
        extractType={refreshExtractTypes.VPR}
        newRecordsFound={false}
      />,
    );
  };

  it('should display "last updated" when refresh was not run', () => {
    const screen = render(
      <NewRecordsIndicator
        refreshState={{
          statusDate: now,
          status: [
            {
              extract: 'VPR',
              lastRequested: minutesBefore(now, 10),
              lastCompleted: minutesBefore(now, 5),
              lastSuccessfulCompleted: minutesBefore(now, 5),
            },
          ],
        }}
        extractType={refreshExtractTypes.VPR}
        newRecordsFound={false}
      />,
    );

    const lastUpdated = screen.getByText('Last updated at', {
      exact: false,
    });
    expect(lastUpdated).to.exist;
  });

  it('should display a spinner if refresh is currently running', () => {
    const screen = renderRefreshInProgressState();

    const spinner = screen.getByTestId('new-records-loading-indicator');
    expect(spinner).to.exist;
  });

  it('should display the green box if refresh ran and records are current', async () => {
    const { rerender, getByTestId } = renderRefreshInProgressState();

    rerender(
      <NewRecordsIndicator
        refreshState={{
          statusDate: now,
          status: [
            {
              extract: 'VPR',
              lastRequested: minutesBefore(now, 10),
              lastCompleted: minutesBefore(now, 5),
              lastSuccessfulCompleted: minutesBefore(now, 5),
            },
          ],
        }}
        extractType={refreshExtractTypes.VPR}
        newRecordsFound={false}
      />,
    );

    waitFor(() => {
      expect(getByTestId('new-records-refreshed-current')).to.exist;
      expect(getByTestId('new-records-refreshed-stale')).to.not.exist;
      expect(getByTestId('new-records-loading-indicator')).to.not.exist;
      expect(getByTestId('new-records-refreshed-failed')).to.not.exist;
    });
  });

  it('should display the blue box if refresh ran and records are stale', async () => {
    const { rerender, getByTestId } = renderRefreshInProgressState();

    rerender(
      <NewRecordsIndicator
        refreshState={{
          statusDate: now,
          status: [
            {
              extract: 'VPR',
              lastRequested: minutesBefore(now, 10),
              lastCompleted: minutesBefore(now, 80),
              lastSuccessfulCompleted: minutesBefore(now, 80),
            },
          ],
        }}
        extractType={refreshExtractTypes.VPR}
        newRecordsFound
      />,
    );

    waitFor(() => {
      expect(getByTestId('new-records-refreshed-stale')).to.exist;
      expect(getByTestId('new-records-refreshed-current')).to.not.exist;
      expect(getByTestId('new-records-loading-indicator')).to.not.exist;
      expect(getByTestId('new-records-refreshed-failed')).to.not.exist;
    });
  });

  it('should display the yellow box if refresh ran and there was an error', async () => {
    const { rerender, getByTestId } = renderRefreshInProgressState();

    rerender(
      <NewRecordsIndicator
        refreshState={{
          statusDate: now,
          status: [
            {
              extract: 'VPR',
              lastRequested: minutesBefore(now, 10),
              lastCompleted: minutesBefore(now, 5),
              lastSuccessfulCompleted: minutesBefore(now, 80),
            },
          ],
        }}
        extractType={refreshExtractTypes.VPR}
        newRecordsFound
      />,
    );

    waitFor(() => {
      expect(getByTestId('new-records-refreshed-failed')).to.exist;
      expect(getByTestId('new-records-refreshed-stale')).to.not.exist;
      expect(getByTestId('new-records-refreshed-current')).to.not.exist;
      expect(getByTestId('new-records-loading-indicator')).to.not.exist;
    });
  });
});
