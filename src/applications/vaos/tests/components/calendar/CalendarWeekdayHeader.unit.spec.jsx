import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CalendarWeekdayHeader from '../../../components/calendar/CalendarWeekdayHeader';

describe('VAOS <CalendarWeekdayHeader>', () => {
  it('should render with weekday names', () => {
    const tree = shallow(<CalendarWeekdayHeader />);

    const items = tree.find('.vaos-calendar__weekday');
    expect(items.length).to.equal(5);
    expect(items.at(0).text()).to.equal('Monday');
    expect(items.at(1).text()).to.equal('Tuesday');
    expect(items.at(2).text()).to.equal('Wednesday');
    expect(items.at(3).text()).to.equal('Thursday');
    expect(items.at(4).text()).to.equal('Friday');
    tree.unmount();
  });
});
