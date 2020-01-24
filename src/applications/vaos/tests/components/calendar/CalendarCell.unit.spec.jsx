import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import CalendarCell from '../../../components/calendar/CalendarCell';

describe('VAOS <CalendarCell>', () => {
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
    expect(tree.find('.vaos-calendar__cell-current').length).to.equal(1);
    expect(tree.find('.vaos-calendar__cell-selected').length).to.equal(1);
    expect(cell.text()).to.contain('4');
    expect(cell.find('CalendarSelectedIndicator').exists()).to.be.true;
    tree.unmount();
  });

  it('should render differently if disabled', () => {
    const tree = mount(<CalendarCell date="2018-10-04" disabled />);
    const cell = tree.find('button#date-cell-2018-10-04');
    expect(tree.find('.vaos-calendar__cell-current').length).to.equal(0);
    expect(tree.find('.vaos-calendar__cell-selected').length).to.equal(0);
    expect(cell.props().disabled).to.equal(true);
    tree.unmount();
  });

  it('should blank if date is null', () => {
    const tree = mount(<CalendarCell date={null} />);
    const cell = tree.find('.vads-u-visibility--hidden');
    expect(cell.length).to.equal(1);
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
