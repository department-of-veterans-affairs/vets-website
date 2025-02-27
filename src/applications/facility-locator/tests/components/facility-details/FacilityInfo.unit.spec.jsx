import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { FacilityType } from '../../../constants';
import FacilityInfo from '../../../components/facility-details/FacilityInfo';

describe('facility-locator', () => {
  describe('FacilityInfo', () => {
    it('should render the facility info', () => {
      const facility = {
        attributes: {
          name: 'Facility Name',
          website: 'https://www.va.gov',
          phone: { main: '555-555-5555' },
          operatingStatus: { code: 'NORMAL' },
          facilityType: FacilityType.VA_BENEFITS_FACILITY,
        },
      };
      const headerRef = React.createRef();
      const { getByText } = render(
        <FacilityInfo facility={facility} headerRef={headerRef} />,
      );

      expect(getByText(facility.attributes.name)).to.be.ok;
    });
  });
});
