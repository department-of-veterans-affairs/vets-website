import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { mockApiRequest, resetFetch } from 'platform/testing/unit/helpers';
import {
  mockWidgetFacilitiesList,
  mockFacilityLocatorApiResponse,
} from './mockFacilitiesData';

import FacilityListWidget from '../../facilities/FacilityListWidget';

describe('facilities <FacilityListWidget>', () => {
  it('should render loading', () => {
    const tree = shallow(
      <FacilityListWidget facilities={mockWidgetFacilitiesList} />,
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
      <FacilityListWidget facilities={mockWidgetFacilitiesList} />,
    );
    tree.instance().request.then(() => {
      tree.update();
      expect(tree.find('LoadingIndicator').exists()).to.be.false;

      const facilityName = tree.find('h3.vads-u-margin-bottom--2p5');
      expect(facilityName.text()).to.contain(
        'Pittsburgh VA Medical Center-University Drive',
      );

      const address = tree.find('address');
      expect(address.text()).to.contain(
        'University Drive CPittsburgh, PA 15240-1003',
      );

      const mainPhone = tree.find('.main-phone');
      expect(mainPhone.text()).to.contain('Main phone: 866-482-7488');

      const mentalHealthClinic = tree.find('.mental-health-clinic-phone');
      expect(mentalHealthClinic.text()).to.contain(
        'Mental health clinic: 412-360-6600',
      );
      tree.unmount();
      resetFetch();
      done();
    });
  });
});
