import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ConfirmationRequestInfo from '../../components/ConfirmationRequestInfo';

describe('VAOS <ConfirmationRequestInfo>', () => {
  it('should render VA request', () => {
    const data = {
      visitType: 'office',
      bestTimeToCall: {
        morning: true,
        afternoon: true,
      },
      calendarData: {
        selectedDates: [{ date: '2019-12-20', optionTime: 'AM' }],
      },
    };
    const facility = {
      institution: {
        institutionCode: '983GB',
        name: 'CHYSHR-Sidney VA Clinic',
        city: 'Sidney',
        stateAbbrev: 'NE',
        authoritativeName: 'CHYSHR-Sidney VA Clinic',
        rootStationCode: '983',
        adminParent: false,
        parentStationCode: '983',
      },
      institutionTimezone: 'America/Denver',
    };

    const tree = shallow(
      <ConfirmationRequestInfo data={data} facility={facility} />,
    );

    const text = tree
      .find('AlertBox')
      .at(1)
      .dive()
      .text();
    expect(text).not.to.contain('Community Care');
    expect(text).to.contain('CHYSHR-Sidney VA Clinic');
    expect(text).to.contain('Sidney, NE');

    expect(tree.find('AlertBox').exists()).to.be.true;

    tree.unmount();
  });

  it('should render CC request', () => {
    const data = {
      facilityType: 'communityCare',
      distanceWillingToTravel: '25',
      preferredLanguage: 'english',
      visitType: 'office',
      bestTimeToCall: {
        morning: true,
        afternoon: true,
      },
      hasCommunityCareProvider: true,
      communityCareProvider: {
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '5555555555',
        address: {
          street: '123 Test',
          city: 'Northampton',
          state: 'MA',
          postalCode: '01060',
        },
      },
      calendarData: {
        selectedDates: [{ date: '2019-12-20', optionTime: 'AM' }],
      },
    };
    const facility = {
      institution: {
        institutionCode: '983GB',
        name: 'CHYSHR-Sidney VA Clinic',
        city: 'Sidney',
        stateAbbrev: 'NE',
        authoritativeName: 'CHYSHR-Sidney VA Clinic',
        rootStationCode: '983',
        adminParent: false,
        parentStationCode: '983',
      },
      institutionTimezone: 'America/Denver',
    };

    const tree = shallow(
      <ConfirmationRequestInfo
        data={data}
        facility={facility}
        vaCityState="Cheyenne, WY"
      />,
    );

    const text = tree
      .find('AlertBox')
      .at(1)
      .dive()
      .text();
    expect(text).to.contain('Community Care');
    expect(text).not.to.contain('CHYSHR-Sidney VA Clinic');
    expect(text).to.contain('Jane Doe');
    expect(text).to.contain('5555555555');
    expect(text).to.contain('Northampton, MA');

    expect(tree.find('AlertBox').exists()).to.be.true;

    tree.unmount();
  });
});
