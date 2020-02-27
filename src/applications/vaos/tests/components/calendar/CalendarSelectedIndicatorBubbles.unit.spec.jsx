import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CalendarSelectedIndicator from '../../../components/calendar/CalendarSelectedIndicator';
import { CALENDAR_INDICATOR_TYPES } from '../../../utils/constants';

describe('VAOS <CalendarSelectedIndicator>', () => {
  it('should render a checkbox by default', () => {
    const tree = shallow(
      <CalendarSelectedIndicator
        date="2018-10-04"
        selectedDates={[
          {
            date: '2018-10-04',
            optionTime: 'PM',
          },
          {
            date: '2018-10-04',
            optionTime: 'AM',
          },
        ]}
      />,
    );
    expect(tree.find('.vaos-calendar__indicator-bubble').length).to.equal(0);
    expect(
      tree.find('.fa-check.vaos-calendar__fa-check-position').length,
    ).to.equal(1);
    tree.unmount();
  });

  it('should render a bubbles if indicatorType is set to bubbles', () => {
    const tree = shallow(
      <CalendarSelectedIndicator
        date="2018-10-04"
        selectedDates={[
          {
            date: '2018-10-04',
            optionTime: 'PM',
          },
          {
            date: '2018-10-04',
            optionTime: 'AM',
          },
        ]}
        fieldName="optionTime"
        selectedIndicatorType={CALENDAR_INDICATOR_TYPES.BUBBLES}
      />,
    );
    const bubbles = tree.find('.vaos-calendar__indicator-bubble');
    expect(bubbles.length).to.equal(2);
    expect(bubbles.at(0).text()).to.equal('AM');
    expect(bubbles.at(1).text()).to.equal('PM');
    tree.unmount();
  });
});
