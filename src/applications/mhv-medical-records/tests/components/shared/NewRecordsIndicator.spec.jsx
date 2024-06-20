import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import NewRecordsIndicator from '../../../components/shared/NewRecordsIndicator';
import { refreshExtractTypes } from '../../../util/constants';

describe('NewRecordsIndicator', () => {
  const minuteBefore = (date, minutes) => {
    return new Date(date.getTime() - minutes * 60 * 1000);
  };

  const now = new Date();

  it('should display "last updated" when refresh was not run', () => {
    const screen = render(
      <NewRecordsIndicator
        refreshState={{
          statusDate: now,
          status: [
            {
              extract: 'VPR',
              lastRequested: minuteBefore(now, 10),
              lastCompleted: minuteBefore(now, 5),
              lastSuccessfulCompleted: minuteBefore(now, 5),
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
    const screen = render(
      <NewRecordsIndicator
        refreshState={{
          statusDate: now,
          status: [
            {
              extract: 'VPR',
              lastRequested: minuteBefore(now, 10),
              lastCompleted: minuteBefore(now, 80),
              lastSuccessfulCompleted: minuteBefore(now, 80),
            },
          ],
        }}
        extractType={refreshExtractTypes.VPR}
        newRecordsFound={false}
      />,
    );

    const spinner = screen.getByTestId('new-records-loading-indicator');
    expect(spinner).to.exist;
  });

  it('should display the green box if refresh ran and records are current', async () => {
    const { rerender, getByTestId } = render(
      <NewRecordsIndicator
        refreshState={{
          statusDate: now,
          status: [
            {
              extract: 'VPR',
              lastRequested: minuteBefore(now, 10),
              lastCompleted: minuteBefore(now, 80),
              lastSuccessfulCompleted: minuteBefore(now, 80),
            },
          ],
        }}
        extractType={refreshExtractTypes.VPR}
        newRecordsFound={false}
      />,
    );

    waitFor(() => {
      const spinner = getByTestId('new-records-loading-indicator');
      expect(spinner).to.exist;
    });

    rerender(
      <NewRecordsIndicator
        refreshState={{
          statusDate: now,
          status: [
            {
              extract: 'VPR',
              lastRequested: minuteBefore(now, 10),
              lastCompleted: minuteBefore(now, 5),
              lastSuccessfulCompleted: minuteBefore(now, 5),
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
    });
  });

  it('should display the blue box if refresh ran and records are stale', async () => {
    const { rerender, getByTestId } = render(
      <NewRecordsIndicator
        refreshState={{
          statusDate: now,
          status: [
            {
              extract: 'VPR',
              lastRequested: minuteBefore(now, 10),
              lastCompleted: minuteBefore(now, 80),
              lastSuccessfulCompleted: minuteBefore(now, 80),
            },
          ],
        }}
        extractType={refreshExtractTypes.VPR}
        newRecordsFound={false}
      />,
    );

    waitFor(() => {
      const spinner = getByTestId('new-records-loading-indicator');
      expect(spinner).to.exist;
    });

    rerender(
      <NewRecordsIndicator
        refreshState={{
          statusDate: now,
          status: [
            {
              extract: 'VPR',
              lastRequested: minuteBefore(now, 10),
              lastCompleted: minuteBefore(now, 80),
              lastSuccessfulCompleted: minuteBefore(now, 80),
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
    });
  });
});
