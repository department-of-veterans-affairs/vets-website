import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import NoValidVAFacilities from '../../components/NoValidVAFacilities';

const systemDetails = {
  attributes: {
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
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7',
    },
    lat: 41.1457280000001,
    long: -104.7895949,
  },
};

describe('VAOS <NoValidVAFacilities>', () => {
  it('should render alert message', () => {
    const tree = mount(<NoValidVAFacilities typeOfCare="Mental health" />);

    expect(tree.text()).to.contain(
      'We’re sorry. None of the facilities in this health system allow online scheduling for Mental health appointments',
    );
    expect(tree.find('[aria-atomic="true"]').exists()).to.be.true;
    tree.unmount();
  });

  it('should render facility info if systemDetails provided', () => {
    const tree = mount(
      <NoValidVAFacilities
        typeOfCare="Mental health"
        systemDetails={systemDetails}
      />,
    );

    expect(tree.text()).to.contain('Cheyenne VA Medical Center');
    expect(tree.text()).to.contain('307-778-7550');
    expect(tree.text()).to.contain('24/7');
    expect(tree.find('a').length).to.equal(3);
    tree.unmount();
  });

  it('should render a link to facility locator if no systemDetails provided', () => {
    const tree = mount(
      <NoValidVAFacilities typeOfCare="Mental health" systemId="442" />,
    );

    expect(tree.text()).to.contain(
      'You can find contact information for this medical center at',
    );
    const link = tree.find('a');
    expect(link.length).to.equal(1);
    expect(link.props().href).to.equal(`/find-locations/facility/vha_442`);
    tree.unmount();
  });
});
