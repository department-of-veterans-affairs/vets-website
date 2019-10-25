import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CalendarCell from '../../../components/calendar/CalendarCell';

describe('VAOS <CalendarCell>', () => {
  it('should render a calendar cell button with proper label and values', () => {
    const tree = shallow(
      <CalendarCell
        date="2018-10-04"
        isCurrentlySelected
        inSelectedArray
        disabled={false}
      />,
    );
    const cell = tree.find('button#date-cell-2018-10-04');
    expect(cell.length).to.equal(1);
    expect(tree.find('.vaos-calendar__cell-current').length).to.equal(1);
    expect(tree.find('.vaos-calendar__cell-selected').length).to.equal(1);
    expect(cell.text()).to.equal('4');
    tree.unmount();
  });

  it('should render differently if disabled', () => {
    const tree = shallow(<CalendarCell date="2018-10-04" disabled />);
    const cell = tree.find('button#date-cell-2018-10-04');
    expect(tree.find('.vaos-calendar__cell-current').length).to.equal(0);
    expect(tree.find('.vaos-calendar__cell-selected').length).to.equal(0);
    expect(cell.props().disabled).to.equal(true);
    tree.unmount();
  });

  it('should blank if date is null', () => {
    const tree = shallow(<CalendarCell date={null} />);
    const cell = tree.find('.vads-u-visibility--hidden');
    expect(cell.length).to.equal(1);
    tree.unmount();
  });
});
