import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CalendarWidget from '../../../components/calendar/CalendarWidget';

describe('VAOS <CalendarWidget>', () => {
  it('should render 2 calendars', () => {
    const tree = shallow(<CalendarWidget monthsToShowAtOnce={2} />);
    const cell = tree.find('.vaos-calendar__container');
    expect(cell.length).to.equal(2);
    const navigation = tree.find('CalendarNavigation');
    expect(navigation.length).to.equal(1);
    const weekdayHeaders = tree.find('CalendarWeekdayHeader');
    expect(weekdayHeaders.length).to.equal(2);
    tree.unmount();
  });
});
