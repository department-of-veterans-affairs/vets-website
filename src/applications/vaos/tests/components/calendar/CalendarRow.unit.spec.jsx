import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import CalendarRow from '../../../components/calendar/CalendarRow';
import moment from 'moment';

describe('VAOS <CalendarRow>', () => {
  const dayCells = [
    '2019-10-21',
    '2019-10-22',
    '2019-10-23',
    '2019-10-24',
    '2019-10-25',
  ];

  const selectedDates = [
    {
      date: '2019-10-24',
      datetime: '2019-10-24T09:00:00-07:00',
    },
  ];

  const getOptionsByDate = () => [
    {
      date: '2019-10-24',
      datetime: '2019-10-24T09:00:00-07:00',
    },
    {
      date: '2019-10-25',
      datetime: '2019-10-25T09:00:00-07:00',
    },
  ];

  it('should render a row with calendar cells', () => {
    const tree = shallow(
      <CalendarRow
        cells={dayCells}
        currentlySelectedDate="2019-10-21"
        rowNumber="0"
        selectedDates={selectedDates}
        additionalOptions={{ getOptionsByDate }}
      />,
    );

    const row = tree.find('.vads-u-flex-wrap--wrap');
    expect(row.length).to.equal(1);
    const cells = tree.find('CalendarCell');
    expect(cells.length).to.equal(5);
    tree.unmount();
  });

  it('should disable dates after the max date', () => {
    const cells = [
      moment().format('YYYY-MM-DD'),
      moment()
        .add(1, 'd')
        .format('YYYY-MM-DD'),
      moment()
        .add(2, 'd')
        .format('YYYY-MM-DD'),
      moment()
        .add(3, 'd')
        .format('YYYY-MM-DD'),
      moment()
        .add(4, 'd')
        .format('YYYY-MM-DD'),
    ];

    // Set max date to tomorrow...
    const tree = mount(
      <CalendarRow
        cells={cells}
        maxDate={moment()
          .add(1, 'd')
          .format('YYYY-MM-DD')}
        rowNumber="0"
        selectedDates={selectedDates}
        additionalOptions={{ getOptionsByDate }}
      />,
    );

    // Find all disabled day cell buttons...
    const buttons = tree.find(
      '.vaos-calendar__calendar-day-button[disabled=true]',
    );

    expect(buttons.length).to.equal(3);

    tree.unmount();
  });
});
