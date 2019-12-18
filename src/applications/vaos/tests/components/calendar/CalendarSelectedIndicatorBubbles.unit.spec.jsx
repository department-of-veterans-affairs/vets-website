import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CalendarSelectedIndicatorBubbles from '../../../components/calendar/CalendarSelectedIndicatorBubbles';

describe('VAOS <CalendarSelectedIndicatorBubbles>', () => {
  it('should render', () => {
    const tree = shallow(
      <CalendarSelectedIndicatorBubbles
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
      />,
    );
    const bubbles = tree.find('.vaos-calendar__indicator-bubble');
    expect(bubbles.length).to.equal(2);
    expect(bubbles.at(0).text()).to.equal('AM');
    expect(bubbles.at(1).text()).to.equal('PM');
    tree.unmount();
  });
});
