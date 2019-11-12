import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ReviewDirectScheduleInfo from '../../components/ReviewDirectScheduleInfo';

describe('VAOS <ReviewDirectScheduleInfo>', () => {
  it('should render', () => {
    const data = {
      calendarData: {
        selectedDates: [{ datetime: '2019-12-20T10:00:00' }],
      },
    };

    const tree = shallow(<ReviewDirectScheduleInfo data={data} />);

    expect(tree.find('h2').length).to.equal(7);
    expect(tree.text()).to.contain('December 20, 2019 at 10:00 a.m.');

    tree.unmount();
  });

  it('should render aria labels', () => {
    const data = {
      calendarData: {
        selectedDates: [{ datetime: '2019-12-20T10:00:00' }],
      },
    };
    const tree = shallow(<ReviewDirectScheduleInfo data={data} />);

    expect(tree.find('[aria-label]').length).to.equal(7);
    expect(tree.find('[aria-label="Edit appointment date"]').exists()).to.be
      .true;

    tree.unmount();
  });
});
