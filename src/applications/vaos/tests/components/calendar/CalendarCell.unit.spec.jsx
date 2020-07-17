import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import moment from 'moment';

import CalendarCell from '../../../components/calendar/CalendarCell';

describe('VAOS <CalendarCell>', () => {
  const selectedDates = [
    {
      date: '2018-10-03',
      optionTime: 'PM',
    },
    {
      date: '2018-10-04',
      optionTime: 'AM',
    },
  ];

  it('show include CalendarSelectedIndicator if in selected array', () => {
    const tree = mount(
      <CalendarCell
        date="2018-10-04"
        currentlySelectedDate="2018-10-04"
        selectedDates={selectedDates}
        inSelectedArray
        disabled={false}
      />,
    );
    expect(tree.find('CalendarSelectedIndicator').exists()).to.be.true;
    tree.unmount();
  });

  it('should have a button with the correct id and aria label', () => {
    const momentDate = moment('2018-10-04');
    const tree = mount(
      <CalendarCell
        date={momentDate.format('YYYY-MM-DD')}
        currentlySelectedDate="2018-10-04"
        selectedDates={selectedDates}
        inSelectedArray
        disabled={false}
      />,
    );
    const button = tree.find('button');
    expect(button.exists()).to.be.true;
    expect(button.props().id).to.equal(
      `date-cell-${momentDate.format('YYYY-MM-DD')}`,
    );
    expect(button.props()['aria-label']).to.equal(
      momentDate.format('dddd, MMMM Do'),
    );
    tree.unmount();
  });

  it('test calendar CSS class', () => {
    const tree = mount(
      <CalendarCell
        date="2018-10-04"
        currentlySelectedDate="2018-10-04"
        selectedDates={selectedDates}
        inSelectedArray
        disabled={false}
      />,
    );
    const currentCell = tree.find(
      'div.vaos-calendar__calendar-day.vaos-calendar__day--current.vaos-calendar__day--selected',
    );
    const selectedCell = tree.find(
      'div.vaos-calendar__calendar-day.vaos-calendar__day--selected',
    );
    expect(selectedCell.exists()).to.be.true;
    expect(currentCell.exists()).to.be.true;
    expect(tree.find('.vaos-calendar__day--selected-triangle').length).to.equal(
      1,
    );
    expect(tree.find('button.vaos-calendar__calendar-day-button').exists()).to
      .be.true;

    tree.unmount();
  });

  it('should render a calendar cell button with proper label and values', () => {
    const tree = mount(
      <CalendarCell
        date="2018-10-04"
        currentlySelectedDate="2018-10-04"
        inSelectedArray
        disabled={false}
      />,
    );
    const cell = tree.find('button#date-cell-2018-10-04');
    expect(cell.exists()).to.be.true;
    expect(tree.find('.vaos-calendar__day--current').length).to.equal(1);
    expect(tree.find('.vaos-calendar__day--selected').length).to.equal(1);
    expect(cell.text()).to.contain('4');
    expect(cell.find('CalendarSelectedIndicator').exists()).to.be.true;
    tree.unmount();
  });

  it('should render differently if disabled', () => {
    const tree = mount(<CalendarCell date="2018-10-04" disabled />);
    const cell = tree.find('button#date-cell-2018-10-04');
    expect(tree.find('.vaos-calendar__day--current').length).to.equal(0);
    expect(tree.find('.vaos-calendar__day--selected').length).to.equal(0);
    expect(cell.props().disabled).to.equal(true);
    tree.unmount();
  });

  it('should blank if date is null', () => {
    const tree = mount(<CalendarCell date={null} />);
    const cell = tree.find('.vads-u-visibility--hidden');
    expect(cell.length).to.equal(1);
    tree.unmount();
  });

  it('should render CalendarOptions if isCurrentlySelected', () => {
    const tree = mount(
      <CalendarCell currentlySelectedDate="2019-10-21" date="2019-10-21" />,
    );

    expect(tree.find('CalendarOptions').exists()).to.be.true;
    tree.unmount();
  });

  it('should pass maxSelections on to CalendarOptions', () => {
    const tree = mount(
      <CalendarCell
        currentlySelectedDate="2019-10-21"
        date="2019-10-21"
        maxSelections={3}
      />,
    );

    expect(tree.find('CalendarOptions').props().maxSelections).to.equal(3);
    tree.unmount();
  });

  it('should update height after resize', done => {
    const tree = mount(
      <CalendarCell
        currentlySelectedDate="2019-10-22"
        date="2019-10-21"
        inSelectedArray
      />,
    );
    // This is like doing .update(), but works with useEffect
    tree.setProps({ currentlySelectedDate: '2019-10-21' });

    window.dispatchEvent(new Event('resize'));

    setTimeout(() => {
      // this test doesn't really do anything other than excercise the code and make
      // sure it doesn't error
      tree.setProps();
      tree.unmount();
      done();
    }, 60);
  });
});
