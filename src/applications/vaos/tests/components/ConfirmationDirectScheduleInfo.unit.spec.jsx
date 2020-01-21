import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import ConfirmationDirectScheduleInfo from '../../components/ConfirmationDirectScheduleInfo';

describe('VAOS <ConfirmationDirectScheduleInfo>', () => {
  it('should render', () => {
    const data = {
      calendarData: {
        selectedDates: [{ datetime: '2019-12-20T10:00:00' }],
      },
    };
    const pageTitle = 'Your appointment has been scheduled';

    const tree = mount(
      <ConfirmationDirectScheduleInfo data={data} pageTitle={pageTitle} />,
    );

    expect(tree.text()).to.contain('December 20, 2019 at 10:00 a.m.');

    expect(tree.find('h1').text()).to.equal(pageTitle);

    tree.unmount();
  });
});
