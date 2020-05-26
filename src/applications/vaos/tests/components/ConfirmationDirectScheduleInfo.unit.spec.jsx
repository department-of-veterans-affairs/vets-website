import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import ConfirmationDirectScheduleInfo from '../../components/ConfirmationDirectScheduleInfo';

describe('VAOS <ConfirmationDirectScheduleInfo>', () => {
  it('should render', () => {
    const props = {
      facilityDetails: {
        id: 'vha_983',
        name: 'Cheyenne VA Medical Center',
        address: {
          physical: {
            zip: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            address1: '2360 East Pershing Boulevard',
            address2: null,
            address3: null,
          },
        },
      },
      data: {
        calendarData: {
          selectedDates: [{ datetime: '2019-12-20T10:00:00' }],
        },
      },
      systemId: '983',
      slot: {
        start: '2019-12-20T10:00:00',
        end: '2019-12-20T10:20:00',
      },
    };
    const pageTitle = 'Your appointment has been scheduled';

    const tree = mount(
      <ConfirmationDirectScheduleInfo {...props} pageTitle={pageTitle} />,
    );

    expect(tree.text()).to.contain('December 20, 2019 at 10:00 a.m. MT');

    expect(tree.find('h1').text()).to.equal(pageTitle);

    expect(tree.find('.vaos-u-word-break--break-word').exists()).to.be.true;

    tree.unmount();
  });
});
