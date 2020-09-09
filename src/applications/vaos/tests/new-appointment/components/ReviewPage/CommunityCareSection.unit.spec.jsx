import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import CommunityCareSection from '../../../../new-appointment/components/ReviewPage/CommunityCareSection';
import { MemoryRouter } from 'react-router-dom';

const defaultData = {
  phoneNumber: '5035551234',
  bestTimeToCall: {
    morning: true,
    afternoon: true,
  },
  email: 'joeblow@gmail.com',
  visitType: 'office',
  reasonForAppointment: 'routine-follow-up',
  reasonAdditionalInfo: 'additional information',
  calendarData: {
    selectedDates: [
      {
        date: '2019-11-25',
        optionTime: 'AM',
      },
      {
        date: '2019-11-26',
        optionTime: 'AM',
      },
      {
        date: '2019-11-27',
        optionTime: 'AM',
      },
    ],
  },
  facilityType: 'vamc',
  typeOfCareId: '323',
};

describe('Accessibility', () => {
  const data = {
    ...defaultData,
    facilityType: 'communityCare',
    hasCommunityCareProvider: false,
    preferredLanguage: 'english',
  };
  const vaCityState = 'Cheyenne, WY';

  let tree;

  beforeEach(() => {
    tree = mount(
      <MemoryRouter>
        <CommunityCareSection data={data} vaCityState={vaCityState} />
      </MemoryRouter>,
    );
  });

  afterEach(() => {
    tree.unmount();
  });

  it('should have aria labels to hide HR from screen reader', () => {
    expect(tree.find('hr[aria-hidden="true"]').exists()).to.be.true;
    expect(tree.find('hr[aria-hidden="true"]').length).to.equal(3);
  });
});
