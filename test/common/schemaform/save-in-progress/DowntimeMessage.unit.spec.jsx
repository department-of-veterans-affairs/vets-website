import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import moment from 'moment';

import DowntimeMessage from '../../../../src/applications/common/schemaform/save-in-progress/DowntimeMessage';

describe('<DowntimeMessage>', () => {
  it('should render with generic message', () => {
    const tree = shallow(
      <DowntimeMessage downtimeWindow={{}}/>
    );
    const message = shallow(tree.find('AlertBox').prop('content'));

    expect(message.text()).to.contain('We’re sorry it’s not working right now.');
  });

  it('should render with window message', () => {
    const endTime = moment().add(2, 'days');
    const tree = shallow(
      <DowntimeMessage downtimeWindow={{ endTime }}/>
    );
    const message = shallow(tree.find('AlertBox').prop('content'));

    expect(message.text()).to.contain(`We’re sorry it’s not working right now, and we hope to be finished by ${endTime.format('MMMM Do, LT')}`);
  });
});
