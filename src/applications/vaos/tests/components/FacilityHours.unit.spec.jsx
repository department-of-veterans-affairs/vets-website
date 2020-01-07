import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import FacilityHours from '../../components/FacilityHours';

const location = {
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
  phone: {
    fax: '307-778-7381',
    main: '307-778-7550',
    pharmacy: '866-420-6337',
    afterHours: '307-778-7550',
    patientAdvocate: '307-778-7550 x7517',
    mentalHealthClinic: '307-778-7349',
    enrollmentCoordinator: '307-778-7550 x7579',
  },
  hours: {
    monday: '8:00AM-4:00PM',
    tuesday: 'Closed',
    wednesday: '24/7',
    thursday: '24/7',
    friday: '24/7',
    saturday: '24/7',
    sunday: '24/7',
  },
  lat: 41.1457280000001,
  long: -104.7895949,
};

describe('VAOS <FacilityHours>', () => {
  it('should render', () => {
    const tree = shallow(<FacilityHours location={location} />);
    expect(tree.text()).to.contain('Sunday');
    expect(tree.text()).to.contain('Monday');
    expect(tree.text()).to.contain('Tuesday');
    expect(tree.text()).to.contain('Wednesday');
    expect(tree.text()).to.contain('Thursday');
    expect(tree.text()).to.contain('Friday');
    expect(tree.text()).to.contain('Saturday');
    const dayDivs = tree.find('.vaos-facility-details__day');
    expect(dayDivs.length).to.equal(7);
    const hourDivs = tree.find('.vaos-facility-details__hours');
    expect(hourDivs.length).to.equal(7);
    expect(hourDivs.at(1).text()).to.equal('8:00a.m. - 4:00p.m.');
    expect(hourDivs.at(2).text()).to.equal('Closed');
    expect(hourDivs.at(3).text()).to.equal('24/7');
    tree.unmount();
  });
});
