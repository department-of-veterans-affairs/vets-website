import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import CalendarOptions from '../../../components/calendar/CalendarOptions';

describe('VAOS <CalendarOptions>', () => {
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

  it('should render radio buttons when maxSelections === 1', () => {
    const tree = mount(
      <CalendarOptions
        currentlySelectedDate="2019-10-21"
        selectedDates={selectedDates}
        additionalOptions={{ maxSelections: 1, getOptionsByDate }}
      />,
    );

    const radios = tree.find('CalendarRadioOption');
    expect(radios.length).to.equal(2);
    tree.unmount();
  });

  it('should render checkboxes when maxSelections > 1', () => {
    const tree = mount(
      <CalendarOptions
        currentlySelectedDate="2019-10-21"
        selectedDates={selectedDates}
        additionalOptions={{ maxSelections: 2, getOptionsByDate }}
      />,
    );

    const checks = tree.find('CalendarCheckboxOption');
    expect(checks.length).to.equal(2);
    tree.unmount();
  });

  it('should not disable checkboxes if selectedDates length < maxSelections', () => {
    const tree = mount(
      <CalendarOptions
        currentlySelectedDate="2019-10-18"
        selectedDates={selectedDates}
        maxSelections={3}
        additionalOptions={{ maxSelections: 2, getOptionsByDate }}
      />,
    );

    const checks = tree.find('CalendarCheckboxOption');
    expect(checks.length).to.equal(2);
    expect(checks.at(0).props().disabled).to.be.false;
    expect(checks.at(1).props().disabled).to.be.false;
    tree.unmount();
  });

  it('should disable checkboxes if selectedDates length === maxSelections', () => {
    const tree = mount(
      <CalendarOptions
        currentlySelectedDate="2019-10-18"
        selectedDates={selectedDates}
        maxSelections={1}
        additionalOptions={{ maxSelections: 2, getOptionsByDate }}
      />,
    );

    const checks = tree.find('CalendarCheckboxOption');
    expect(checks.length).to.equal(2);
    expect(checks.at(0).props().disabled).to.be.true;
    expect(checks.at(1).props().disabled).to.be.true;
    tree.unmount();
  });
});
