import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import {
  mockWidgetFacilitiesList,
  mockFacilityLocatorApiResponse,
} from './mockFacilitiesData';

import FacilityListWidget from '../FacilityListWidget';

describe('facilities <FacilityListWidget>', () => {
  it('should render loading', () => {
    const tree = shallow(
      <FacilityListWidget facilities={mockWidgetFacilitiesList} />,
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
      <FacilityListWidget facilities={mockWidgetFacilitiesList} />,
    );
    tree.instance().request.then(() => {
      tree.update();
      expect(tree.find('va-loading-indicator').exists()).to.be.false;

      const facilityNameComponent = tree.find('FacilityTitle').dive();
      const facilityName = facilityNameComponent.find('h3');
      expect(facilityName.text()).to.contain(
        'Pittsburgh VA Medical Center-University Drive',
      );

      const facilityAddressComponent = tree.find('FacilityAddress').dive();
      const address = facilityAddressComponent.find('address');
      expect(address.text()).to.contain(
        'University Drive CPittsburgh, PA 15240-1003',
      );

      const facilityPhoneComponent = tree.find('FacilityPhone').dive();
      const mainPhone = facilityPhoneComponent.find('.main-phone');
      expect(mainPhone.text()).to.contain('Main phone: 866-482-7488');

      const mentalHealthClinic = facilityPhoneComponent.find(
        '.mental-health-clinic-phone',
      );
      expect(mentalHealthClinic.text()).to.contain(
        'Mental health clinic: 412-360-6600',
      );
      tree.unmount();
      done();
    });
  });
});
