import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import { mockFacilityLocatorApiResponse } from './mockFacilitiesData';

import OtherFacilityListWidget from '../OtherFacilityListWidget';

describe('facilities <OtherFacilityListWidget>', () => {
  it('should render loading', () => {
    const tree = shallow(
      <OtherFacilityListWidget facilities="vha_663,nca_120" />,
      {
        disableLifecycleMethods: true,
      },
    );

    expect(tree.find('va-loading-indicator').exists()).to.be.true;
    tree.unmount();
  });

  it('should render facility data', done => {
    mockApiRequest(mockFacilityLocatorApiResponse);

    const tree = shallow(
      <OtherFacilityListWidget facilities="vha_663,nca_120" />,
    );
    tree.instance().request.then(() => {
      tree.update();
      expect(tree.find('va-loading-indicator').exists()).to.be.false;

      const facilityAddressComponent = tree.find('FacilityAddress').dive();
      const address = facilityAddressComponent.find('address');
      expect(address.text()).to.contain(
        'University Drive CPittsburgh, PA 15240-1003',
      );

      const mainPhone = tree.find('.main-phone');
      expect(mainPhone.exists()).to.be.true;
      const vaTelephone = mainPhone.find('va-telephone');
      expect(vaTelephone.exists()).to.be.true;
      expect(vaTelephone.prop('contact')).to.equal('866-482-7488');

      const facilityType = tree.find('.facility-type');
      expect(facilityType.text()).to.contain('VA Medical Center (VAMC)');
      tree.unmount();
      done();
    });
  });
});
