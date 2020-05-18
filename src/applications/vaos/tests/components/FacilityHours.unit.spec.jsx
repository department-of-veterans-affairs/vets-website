import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import FacilityHours from '../../components/FacilityHours';

const hoursOfOperation = [
  {
    daysOfWeek: ['mon'],
    allDay: false,
    openingTime: '8:00 a.m.',
    closingTime: '4:00 p.m.',
  },
  {
    daysOfWeek: ['wed', 'thu', 'fri', 'sat', 'sun'],
    allDay: true,
    openingTime: null,
    closingTime: null,
  },
];

describe('VAOS <FacilityHours>', () => {
  it('should render', () => {
    const tree = shallow(<FacilityHours hoursOfOperation={hoursOfOperation} />);
    expect(tree.text()).to.contain('Sunday');
    expect(tree.text()).to.contain('Monday');
    expect(tree.text()).to.contain('Tuesday');
    expect(tree.text()).to.contain('Wednesday');
    expect(tree.text()).to.contain('Thursday');
    expect(tree.text()).to.contain('Friday');
    expect(tree.text()).to.contain('Saturday');
    const dayDivs = tree.find('.vaos-facility-details__day');
    expect(dayDivs.length).to.equal(7);
    const hourDivs = tree.find('.vaos-facility-details__hours');
    expect(hourDivs.length).to.equal(7);
    expect(hourDivs.at(1).text()).to.equal('8:00 a.m. - 4:00 p.m.');
    expect(hourDivs.at(2).text()).to.equal('Closed');
    expect(hourDivs.at(3).text()).to.equal('24/7');
    tree.unmount();
  });
});
