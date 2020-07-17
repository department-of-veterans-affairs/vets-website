import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { FETCH_STATUS } from '../../utils/constants';

import NoValidVAFacilities from '../../components/NoValidVAFacilities';

const parentDetails = {
  name: 'Cheyenne VA Medical Center',
  address: {
    postalCode: '82001-5356',
    city: 'Cheyenne',
    state: 'WY',
    line: ['2360 East Pershing Boulevard'],
  },
  telecom: [
    {
      system: 'phone',
      value: '307-778-7550',
    },
  ],
};

describe('VAOS <NoValidVAFacilities>', () => {
  it('should display a loading indicator if FETCH_STATUS is loading', () => {
    const formContext = {
      facilityDetailsStatus: FETCH_STATUS.loading,
    };
    const tree = mount(<NoValidVAFacilities formContext={formContext} />);

    expect(tree.find('LoadingIndicator').exists()).to.be.true;
    tree.unmount();
  });

  it('should not display a loading indicator if FETCH_STATUS is succeeded', () => {
    const formContext = {
      facilityDetailsStatus: FETCH_STATUS.succeeded,
    };
    const tree = mount(<NoValidVAFacilities formContext={formContext} />);

    expect(tree.find('LoadingIndicator').exists()).to.be.false;
    tree.unmount();
  });

  it('should render alert message', () => {
    const formContext = {
      typeOfCare: 'Mental health',
    };
    const tree = mount(<NoValidVAFacilities formContext={formContext} />);

    expect(tree.text()).to.contain(
      'There are no mental health appointments at this location',
    );
    expect(tree.find('[aria-atomic="true"]').exists()).to.be.true;
    tree.unmount();
  });

  it('should render facility info if parentDetails provided', () => {
    const formContext = {
      typeOfCare: 'Mental health',
      parentDetails,
    };
    const tree = mount(<NoValidVAFacilities formContext={formContext} />);

    expect(tree.text()).to.contain('Cheyenne VA Medical Center');
    expect(tree.text()).to.contain('307-778-7550');
    expect(tree.find('a').length).to.equal(2);
    tree.unmount();
  });

  it('should render a link to facility locator if no parentDetails provided', () => {
    const formContext = {
      typeOfCare: 'Mental health',
      siteId: '442',
    };

    const tree = mount(<NoValidVAFacilities formContext={formContext} />);

    expect(tree.text()).to.contain(
      'You can find contact information for this medical center at',
    );
    const link = tree.find('a');
    expect(link.length).to.equal(1);
    expect(link.props().href).to.equal(`/find-locations/facility/vha_442`);
    tree.unmount();
  });
});
