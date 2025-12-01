import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import VaFacilityResult from '../../../components/search-results-items/VaFacilityResult';
import { SearchResultsHeader } from '../../../components/SearchResultsHeader';
import LocationPhoneLink from '../../../components/search-results-items/common/LocationPhoneLink';
import { LocationType } from '../../../constants';
import testData from '../../../constants/mock-facility-data-v1.json';

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

      const headerText = wrapper.find('h2').text();
      expect(headerText).to.include('Mental health care');

      wrapper.unmount();
    });

    it('should not change header when facilityType changes in draft (uncommitted)', () => {
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

      expect(
        cemeteryWrapper.find('Link[children="Learn more about burial status"]')
          .length,
      ).to.equal(1);
      expect(
        cemeteryWrapper
          .find('LocationPhoneLink')
          .prop('showHealthConnectNumber'),
      ).to.be.false;

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
