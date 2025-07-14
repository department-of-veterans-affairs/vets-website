import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockDate from 'mockdate';

import TravelPayDateRangeSelect from '../../components/TravelPayDateRangeSelect';

describe('TravelPayDateRangeSelect', () => {
  const onChangeSpy = sinon.spy();

  const dateRanges = [
    {
      label: 'Past three months',
      value: 'pastThreeMonths',
      start: '2024-03-25T00:00:00-05:00',
      end: '2024-06-25T23:59:59-04:00',
    },
    {
      label: 'Jan 2024 - Mar 2024',
      value: 'Q1_2024',
      start: '2024-01-01T00:00:00-06:00',
      end: '2024-03-31T23:59:59-05:00',
    },
    {
      label: 'Oct 2023 - Dec 2023',
      value: 'Q4_2023',
      start: '2023-10-01T00:00:00-05:00',
      end: '2023-12-31T23:59:59-05:00',
    },
  ];

  const defaultValue = JSON.stringify(dateRanges[0]);

  beforeEach(() => {
    MockDate.set('2024-06-25');
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('selects a date range', async () => {
    const screen = render(
      <TravelPayDateRangeSelect
        availableDateRanges={dateRanges}
        selectedDateRange={defaultValue}
        onDateRangeChange={onChangeSpy}
      />,
    );

    await waitFor(() => {
      const dateSelect = screen.getByTestId('claimsDates');
      dateSelect.__events.vaSelect({
        target: {
          value:
            '{"label":"Jan 2024 - Mar 2024","value":"Q1_2024","start":"2024-01-01T00:00:00-06:00","end":"2024-03-31T23:59:59-05:00"}',
        },
      });

      userEvent.selectOptions(dateSelect, ['Jan 2024 - Mar 2024']);

      expect(
        screen.getByRole('option', { name: 'Jan 2024 - Mar 2024' }).selected,
      ).to.true;

      expect(onChangeSpy.calledOnce).to.be.true;
      expect(onChangeSpy.firstCall.args[0]).to.deep.equal({
        target: {
          value: JSON.stringify({
            label: 'Jan 2024 - Mar 2024',
            value: 'Q1_2024',
            start: '2024-01-01T00:00:00-06:00',
            end: '2024-03-31T23:59:59-05:00',
          }),
        },
      });
    });
  });
});
