import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import moment from 'moment';

import DowntimeMessage from '../../save-in-progress/DowntimeMessage';

describe('<DowntimeMessage>', () => {
  it('should render with generic message', () => {
    const tree = shallow(<DowntimeMessage downtime={{}} />);

    expect(
      tree
        .find('AlertBox')
        .dive()
        .text(),
    ).to.contain('We’re sorry it’s not working right now.');
  });

  it('should render with window message', () => {
    const endTime = moment().add(2, 'days');
    const tree = shallow(<DowntimeMessage downtime={{ endTime }} />);

    expect(
      tree
        .find('AlertBox')
        .dive()
        .text(),
    ).to.contain(
      `We’re sorry it’s not working right now, and we hope to be finished by ${endTime.format(
        'MMMM Do, LT',
      )}`,
    );
  });
});
