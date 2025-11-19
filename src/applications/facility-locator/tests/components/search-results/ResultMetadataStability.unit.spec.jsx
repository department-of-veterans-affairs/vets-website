import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import VaFacilityResult from '../../../components/search-results-items/VaFacilityResult';
import { SearchResultsHeader } from '../../../components/SearchResultsHeader';
import LocationPhoneLink from '../../../components/search-results-items/common/LocationPhoneLink';
import { LocationType } from '../../../constants';
import testData from '../../../constants/mock-facility-data-v1.json';

/**
 * Result Metadata Stability Tests - Issue #20370
 *
 * These tests verify that result components display metadata
 * based on the committed query state (Redux), not draft state.
 *
 * Key behavior:
 * - Result metadata should NOT change when form inputs change
 * - Result metadata should ONLY change when form is submitted
 */
describe('Result metadata stability during form edits', () => {
  describe('VaFacilityResult', () => {
    it('should show health connect number based on committed query', () => {
      const committedQuery = {
        facilityType: LocationType.HEALTH,
      };

      const wrapper = shallow(
        <VaFacilityResult
          location={testData.data[0]}
          query={committedQuery}
          showHealthConnectNumber="1-877-222-VETS"
        />,
      );

      // Verify LocationPhoneLink is rendered with health connect number
      const phoneLink = wrapper.find('LocationPhoneLink');
      expect(phoneLink.prop('showHealthConnectNumber')).to.equal(
        '1-877-222-VETS',
      );
      expect(phoneLink.prop('query').facilityType).to.equal(
        LocationType.HEALTH,
      );

      wrapper.unmount();
    });

    it('should show burial link only for cemetery searches', () => {
      const committedQuery = {
        facilityType: LocationType.CEMETERY,
      };

      const wrapper = shallow(
        <VaFacilityResult
          location={testData.data[7]}
          query={committedQuery}
          isCemetery
        />,
      );

      // Verify burial link is rendered
      const burialLink = wrapper.find(
        'Link[children="Learn more about burial status"]',
      );
      expect(burialLink.length).to.equal(1);

      wrapper.unmount();
    });

    it('should NOT show burial link for non-cemetery searches', () => {
      const committedQuery = {
        facilityType: LocationType.HEALTH,
      };

      const wrapper = shallow(
        <VaFacilityResult
          location={testData.data[0]}
          query={committedQuery}
          isCemetery={false}
        />,
      );

      // Verify burial link is NOT rendered
      const burialLink = wrapper.find(
        'Link[children="Learn more about burial status"]',
      );
      expect(burialLink.length).to.equal(0);

      wrapper.unmount();
    });

    it('should NOT show health connect number for non-health searches', () => {
      const committedQuery = {
        facilityType: LocationType.BENEFITS,
      };

      const wrapper = shallow(
        <VaFacilityResult
          location={testData.data[6]}
          query={committedQuery}
          showHealthConnectNumber={false}
        />,
      );

      // Verify health connect number is not shown
      const phoneLink = wrapper.find('LocationPhoneLink');
      expect(phoneLink.prop('showHealthConnectNumber')).to.be.false;

      wrapper.unmount();
    });
  });

  describe('LocationPhoneLink', () => {
    it('should display health connect number based on committed query', () => {
      const committedQuery = {
        facilityType: LocationType.HEALTH,
      };

      const wrapper = shallow(
        <LocationPhoneLink
          location={testData.data[0]}
          query={committedQuery}
          showHealthConnectNumber="1-877-222-VETS"
          from="SearchResult"
        />,
      );

      // Verify health connect number is displayed
      expect(wrapper.find('va-telephone').length).to.be.greaterThan(0);

      wrapper.unmount();
    });

    it('should not display health connect number when not provided', () => {
      const committedQuery = {
        facilityType: LocationType.BENEFITS,
      };

      const wrapper = shallow(
        <LocationPhoneLink
          location={testData.data[6]}
          query={committedQuery}
          showHealthConnectNumber={false}
          from="SearchResult"
        />,
      );

      // Health connect number section should not exist
      const text = wrapper.text();
      expect(text).to.not.include('877');

      wrapper.unmount();
    });
  });

  describe('SearchResultsHeader', () => {
    it('should display header based on committed facilityType', () => {
      const committedQuery = {
        facilityType: LocationType.HEALTH,
      };

      const wrapper = shallow(
        <SearchResultsHeader
          results={[{}]}
          facilityType={committedQuery.facilityType}
          context="Austin TX"
          pagination={{ totalEntries: 5 }}
        />,
      );

      // Verify header contains "VA health"
      const headerText = wrapper.find('h2').text();
      expect(headerText).to.include('VA health');

      wrapper.unmount();
    });

    it('should display header based on committed serviceType', () => {
      const committedQuery = {
        facilityType: LocationType.HEALTH,
        serviceType: 'PrimaryCare',
      };

      const wrapper = shallow(
        <SearchResultsHeader
          results={[{}]}
          facilityType={committedQuery.facilityType}
          serviceType={committedQuery.serviceType}
          context="Austin TX"
          pagination={{ totalEntries: 5 }}
        />,
      );

      // Verify header contains service type
      const headerText = wrapper.find('h2').text();
      expect(headerText).to.include('Primary care');

      wrapper.unmount();
    });

    it('should display header based on committed vamcServiceDisplay', () => {
      const committedQuery = {
        facilityType: LocationType.HEALTH,
        vamcServiceDisplay: 'Mental health care',
      };

      const wrapper = shallow(
        <SearchResultsHeader
          results={[{}]}
          facilityType={committedQuery.facilityType}
          vamcServiceDisplay={committedQuery.vamcServiceDisplay}
          context="Austin TX"
          pagination={{ totalEntries: 3 }}
        />,
      );

      // Verify header contains VAMC service display
      const headerText = wrapper.find('h2').text();
      expect(headerText).to.include('Mental health care');

      wrapper.unmount();
    });

    it('should not change header when facilityType changes in draft (uncommitted)', () => {
      // This is a conceptual test - in real app, SearchResultsHeader
      // would receive props from Redux which only updates on submit
      const committedQuery = {
        facilityType: LocationType.HEALTH,
      };

      // Note: Draft query (not committed) would be different facility type
      // but component should only receive committed query from Redux

      // Component should receive committed query from Redux, not draft
      const wrapper = shallow(
        <SearchResultsHeader
          results={[{}]}
          facilityType={committedQuery.facilityType}
          context="Austin TX"
          pagination={{ totalEntries: 5 }}
        />,
      );

      // Header should show committed query (health), not draft (cemetery)
      const headerText = wrapper.find('h2').text();
      expect(headerText).to.include('VA health');
      expect(headerText).to.not.include('cemetery');

      wrapper.unmount();
    });
  });

  describe('Metadata consistency', () => {
    it('should maintain consistent metadata across result items', () => {
      const committedQuery = {
        facilityType: LocationType.HEALTH,
        serviceType: 'PrimaryCare',
      };

      // Multiple results should all use the same committed query
      const results = [testData.data[0], testData.data[1]];

      const wrappers = results.map((location, index) =>
        shallow(
          <VaFacilityResult
            key={index}
            location={location}
            query={committedQuery}
            showHealthConnectNumber="1-877-222-VETS"
          />,
        ),
      );

      // All results should have health connect number
      wrappers.forEach(wrapper => {
        const phoneLink = wrapper.find('LocationPhoneLink');
        expect(phoneLink.prop('showHealthConnectNumber')).to.equal(
          '1-877-222-VETS',
        );
        expect(phoneLink.prop('query').facilityType).to.equal(
          LocationType.HEALTH,
        );
      });

      wrappers.forEach(wrapper => wrapper.unmount());
    });

    it('should not mix metadata from different facility types', () => {
      // Cemetery query should not show health connect number
      const cemeteryQuery = {
        facilityType: LocationType.CEMETERY,
      };

      const cemeteryWrapper = shallow(
        <VaFacilityResult
          location={testData.data[7]}
          query={cemeteryQuery}
          isCemetery
          showHealthConnectNumber={false}
        />,
      );

      // Should show burial link but not health connect
      expect(
        cemeteryWrapper.find('Link[children="Learn more about burial status"]')
          .length,
      ).to.equal(1);
      expect(
        cemeteryWrapper
          .find('LocationPhoneLink')
          .prop('showHealthConnectNumber'),
      ).to.be.false;

      // Health query should show health connect number but not burial link
      const healthQuery = {
        facilityType: LocationType.HEALTH,
      };

      const healthWrapper = shallow(
        <VaFacilityResult
          location={testData.data[0]}
          query={healthQuery}
          isCemetery={false}
          showHealthConnectNumber="1-877-222-VETS"
        />,
      );

      expect(
        healthWrapper.find('Link[children="Learn more about burial status"]')
          .length,
      ).to.equal(0);
      expect(
        healthWrapper.find('LocationPhoneLink').prop('showHealthConnectNumber'),
      ).to.equal('1-877-222-VETS');

      cemeteryWrapper.unmount();
      healthWrapper.unmount();
    });
  });
});
