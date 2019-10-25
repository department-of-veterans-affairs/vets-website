import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CalendarRow from '../../../components/calendar/CalendarRow';

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

    const row = tree.find('.vaos-calendar__calendar-week');
    expect(row.length).to.equal(1);
    const cells = tree.find('CalendarCell');
    expect(cells.length).to.equal(5);
    tree.unmount();
  });

  it('should render radio buttons when maxSelections === 1', () => {
    const tree = shallow(
      <CalendarRow
        cells={dayCells}
        currentlySelectedDate="2019-10-21"
        rowNumber="0"
        selectedDates={selectedDates}
        additionalOptions={{ maxSelections: 1, getOptionsByDate }}
      />,
    );

    const radios = tree.find('CalendarRadioOption');
    expect(radios.length).to.equal(2);
    tree.unmount();
  });

  it('should render checkboxes when maxSelections > 1', () => {
    const tree = shallow(
      <CalendarRow
        cells={dayCells}
        currentlySelectedDate="2019-10-21"
        rowNumber="0"
        selectedDates={selectedDates}
        additionalOptions={{ maxSelections: 2, getOptionsByDate }}
      />,
    );

    const checks = tree.find('CalendarCheckboxOption');
    expect(checks.length).to.equal(2);
    tree.unmount();
  });
});
