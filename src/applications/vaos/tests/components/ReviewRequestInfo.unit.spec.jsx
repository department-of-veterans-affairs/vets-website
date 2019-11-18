import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ReviewRequestInfo from '../../components/ReviewRequestInfo';

describe('VAOS <ReviewRequestInfo>', () => {
  it('should render VA request', () => {
    const data = {
      visitType: 'office',
      bestTimeToCall: {
        morning: true,
        afternoon: true,
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

    const tree = shallow(<ReviewRequestInfo data={data} facility={facility} />);

    expect(tree.find('h2').length).to.equal(7);

    const text = tree.text();
    expect(text).not.to.contain('Community Care');
    expect(text).to.contain('CHYSHR-Sidney VA Clinic');
    expect(text).to.contain('Sidney, NE');
    expect(text).to.contain('Office');

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
      <ReviewRequestInfo
        data={data}
        facility={facility}
        vaCityState="Cheyenne, WY"
      />,
    );

    expect(tree.find('h2').length).to.equal(7);

    const text = tree.text();
    expect(text).to.contain('Community Care');
    expect(text).not.to.contain('CHYSHR-Sidney VA Clinic');
    expect(text).to.contain('Jane Doe');
    expect(text).to.contain('5555555555');
    expect(text).to.contain('Cheyenne, WY');
    expect(text).to.contain('English');

    expect(tree.find('AlertBox').exists()).to.be.true;

    tree.unmount();
  });

  it('should render aria labels for Edit links', () => {
    const tree = shallow(<ReviewRequestInfo data={{}} />);

    expect(tree.find('[aria-label]').length).to.equal(7);
    expect(tree.find('[aria-label="Edit type of care"]').exists()).to.be.true;

    tree.unmount();
  });
});
