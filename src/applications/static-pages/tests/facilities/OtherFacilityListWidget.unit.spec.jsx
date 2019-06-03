import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { mockApiRequest, resetFetch } from 'platform/testing/unit/helpers';
import { mockFacilityLocatorApiResponse } from './mockFacilitiesData';

import OtherFacilityListWidget from '../../facilities/OtherFacilityListWidget';

describe('facilities <OtherFacilityListWidget>', () => {
  it('should render loading', () => {
    const tree = shallow(
      <OtherFacilityListWidget facilities="vha_663,nca_120" />,
      {
        disableLifecycleMethods: true,
      },
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.true;
    tree.unmount();
  });

  it('should render facility data', done => {
    mockApiRequest(mockFacilityLocatorApiResponse);

    const tree = shallow(
      <OtherFacilityListWidget facilities="vha_663,nca_120" />,
    );
    tree.instance().request.then(() => {
      tree.update();
      expect(tree.find('LoadingIndicator').exists()).to.be.false;

      const facilityName = tree.find('h3.vads-u-margin-bottom--2p5');
      expect(facilityName.text()).to.contain(
        'Pittsburgh VA Medical Center-University Drive',
      );

      const facilityAddressComponent = tree.find('FacilityAddress').dive();
      const address = facilityAddressComponent.find('address');
      expect(address.text()).to.contain(
        'University Drive CPittsburgh, PA 15240-1003',
      );

      const mainPhone = tree.find('.main-phone');
      expect(mainPhone.text()).to.contain('Main phone: 866-482-7488');

      const facilityType = tree.find('.facility-type');
      expect(facilityType.text()).to.contain('VA Medical Center (VAMC)');
      tree.unmount();
      resetFetch();
      done();
    });
  });
});
