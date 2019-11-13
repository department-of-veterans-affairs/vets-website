import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ConfirmationDirectScheduleInfo from '../../components/ConfirmationDirectScheduleInfo';

describe('VAOS <ConfirmationDirectScheduleInfo>', () => {
  it('should render', () => {
    const data = {
      calendarData: {
        selectedDates: [{ datetime: '2019-12-20T10:00:00' }],
      },
    };

    const tree = shallow(<ConfirmationDirectScheduleInfo data={data} />);

    expect(
      tree
        .find('AlertBox')
        .at(1)
        .dive()
        .text(),
    ).to.contain('December 20, 2019 at 10:00 a.m.');

    tree.unmount();
  });
});
