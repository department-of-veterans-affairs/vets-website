import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
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

    it('should render the facility website link if available', () => {
      const facility = {
        attributes: {
          name: 'Facility Name',
          website: 'https://www.va.gov',
          facilityType: FacilityType.VA_HEALTH_FACILITY,
          phone: { main: '555-555-5555' },
          operatingStatus: { code: 'NORMAL' },
        },
      };
      const headerRef = React.createRef();
      const wrapper = mount(
        <FacilityInfo facility={facility} headerRef={headerRef} />,
      );

      const linkElement = wrapper.find('[data-testid="facility-info-url"]');

      expect(linkElement.exists()).to.be.true;
      expect(linkElement.prop('href')).to.equal('https://www.va.gov');
      expect(linkElement.prop('text')).to.equal('Visit our website');
      wrapper.unmount();
    });

    it('should not render the website link if website is NULL', () => {
      const facility = {
        attributes: {
          name: 'Facility Name',
          website: null,
          facilityType: FacilityType.VA_HEALTH_FACILITY,
          phone: { main: '555-555-5555' },
          operatingStatus: { code: 'NORMAL' },
        },
      };
      const headerRef = React.createRef();
      const wrapper = mount(
        <FacilityInfo facility={facility} headerRef={headerRef} />,
      );

      const linkElement = wrapper.find('[data-testid="facility-info-url"]');

      expect(linkElement.exists()).to.be.false;

      wrapper.unmount();
    });

    it('should render phone number if available', () => {
      const facility = {
        attributes: {
          name: 'Facility Name',
          phone: { main: '555-555-5555' },
          facilityType: FacilityType.VA_HEALTH_FACILITY,
        },
      };
      const headerRef = React.createRef();
      const { getByText } = render(
        <FacilityInfo facility={facility} headerRef={headerRef} />,
      );
      expect(
        getByText(
          'Planning to visit? Please call first as information on this page may change.',
        ),
      ).to.be.ok;
    });

    it('should not render visit warning for VBA facilities', () => {
      const facility = {
        attributes: {
          name: 'Facility Name',
          phone: { main: '555-555-5555' },
          facilityType: FacilityType.VA_BENEFITS_FACILITY,
        },
      };
      const headerRef = React.createRef();
      const { queryByText } = render(
        <FacilityInfo facility={facility} headerRef={headerRef} />,
      );
      expect(
        queryByText(
          'Planning to visit? Please call first as information on this page may change.',
        ),
      ).to.be.null;
    });

    it('should render BurialStatus for cemetery facilities', () => {
      const facility = {
        attributes: {
          name: 'National Cemetery',
          facilityType: FacilityType.VA_CEMETERY,
          phone: { main: '555-555-5555' },
          operatingStatus: {
            code: 'NORMAL',
            supplementalStatus: [{ id: 'UNKNOWN_STATUS' }],
          },
        },
      };
      const headerRef = React.createRef();
      const { getByText } = render(
        <FacilityInfo facility={facility} headerRef={headerRef} />,
      );
      expect(getByText('Burial space')).to.be.ok;
    });
  });
});
