import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VaFacilityResult from '../../../components/search-results-items/VaFacilityResult';
import { SearchResultsHeader } from '../../../components/SearchResultsHeader';
import LocationPhoneLink from '../../../components/search-results-items/common/LocationPhoneLink';
import { LocationType } from '../../../constants';
import testData from '../../../constants/mock-facility-data-v1.json';

const renderWithRouter = component => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('Result metadata stability during form edits', () => {
  describe('VaFacilityResult', () => {
    it('should render facility result with phone section for health facility', () => {
      const committedQuery = {
        facilityType: LocationType.HEALTH,
      };

      const { container } = renderWithRouter(
        <VaFacilityResult
          location={testData.data[0]}
          query={committedQuery}
          showHealthConnectNumber="1-877-222-VETS"
        />,
      );

      expect(container.querySelector('.facility-result')).to.exist;
      expect(container.querySelector('.facility-phone-group')).to.exist;
      expect(container.querySelector('[data-testid="Main phone"]')).to.exist;
    });

    it('should show burial link only for cemetery searches', () => {
      const committedQuery = {
        facilityType: LocationType.CEMETERY,
      };

      const { getByText } = renderWithRouter(
        <VaFacilityResult
          location={testData.data[7]}
          query={committedQuery}
          isCemetery
        />,
      );

      expect(getByText('Learn more about burial status')).to.exist;
    });

    it('should NOT show burial link for non-cemetery searches', () => {
      const committedQuery = {
        facilityType: LocationType.HEALTH,
      };

      const { container, queryByText } = renderWithRouter(
        <VaFacilityResult
          location={testData.data[0]}
          query={committedQuery}
          isCemetery={false}
        />,
      );

      expect(container.querySelector('.facility-result')).to.exist;
      expect(queryByText('Learn more about burial status')).to.not.exist;
    });

    it('should render facility result for benefits facility type', () => {
      const committedQuery = {
        facilityType: LocationType.BENEFITS,
      };

      const { container } = renderWithRouter(
        <VaFacilityResult
          location={testData.data[6]}
          query={committedQuery}
          showHealthConnectNumber={false}
        />,
      );

      expect(container.querySelector('.facility-result')).to.exist;
      expect(container.querySelector('.facility-phone-group')).to.exist;
    });
  });

  describe('LocationPhoneLink', () => {
    it('should display phone numbers for health facility', () => {
      const committedQuery = {
        facilityType: LocationType.HEALTH,
      };

      const { container } = render(
        <LocationPhoneLink
          location={testData.data[0]}
          query={committedQuery}
          showHealthConnectNumber="1-877-222-VETS"
          from="SearchResult"
        />,
      );

      expect(
        container.querySelectorAll('va-telephone').length,
      ).to.be.greaterThan(0);
      expect(container.querySelector('[data-testid="Main phone"]')).to.exist;
    });

    it('should display phone section without health connect for benefits facility', () => {
      const committedQuery = {
        facilityType: LocationType.BENEFITS,
      };

      const { container } = render(
        <LocationPhoneLink
          location={testData.data[6]}
          query={committedQuery}
          showHealthConnectNumber={false}
          from="SearchResult"
        />,
      );

      expect(container.querySelector('.facility-phone-group')).to.exist;
    });
  });

  describe('SearchResultsHeader', () => {
    it('should display header based on committed facilityType', () => {
      const committedQuery = {
        facilityType: LocationType.HEALTH,
      };

      const { container } = render(
        <SearchResultsHeader
          results={[{}]}
          facilityType={committedQuery.facilityType}
          context="Austin TX"
          pagination={{ totalEntries: 5 }}
        />,
      );

      const headerText = container.querySelector('h2').textContent;
      expect(headerText).to.include('VA health');
    });

    it('should display header based on committed serviceType', () => {
      const committedQuery = {
        facilityType: LocationType.HEALTH,
        serviceType: 'PrimaryCare',
      };

      const { container } = render(
        <SearchResultsHeader
          results={[{}]}
          facilityType={committedQuery.facilityType}
          serviceType={committedQuery.serviceType}
          context="Austin TX"
          pagination={{ totalEntries: 5 }}
        />,
      );

      const headerText = container.querySelector('h2').textContent;
      expect(headerText).to.include('Primary care');
    });

    it('should display header based on committed vamcServiceDisplay', () => {
      const committedQuery = {
        facilityType: LocationType.HEALTH,
        vamcServiceDisplay: 'Mental health care',
      };

      const { container } = render(
        <SearchResultsHeader
          results={[{}]}
          facilityType={committedQuery.facilityType}
          vamcServiceDisplay={committedQuery.vamcServiceDisplay}
          context="Austin TX"
          pagination={{ totalEntries: 3 }}
        />,
      );

      const headerText = container.querySelector('h2').textContent;
      expect(headerText).to.include('Mental health care');
    });

    it('should display correct facility type in header', () => {
      const committedQuery = {
        facilityType: LocationType.HEALTH,
      };

      const { container } = render(
        <SearchResultsHeader
          results={[{}]}
          facilityType={committedQuery.facilityType}
          context="Austin TX"
          pagination={{ totalEntries: 5 }}
        />,
      );

      const headerText = container.querySelector('h2').textContent;
      expect(headerText).to.include('VA health');
      expect(headerText).to.not.include('cemetery');
    });
  });

  describe('Metadata consistency', () => {
    it('should render consistent facility results across multiple items', () => {
      const committedQuery = {
        facilityType: LocationType.HEALTH,
        serviceType: 'PrimaryCare',
      };

      const results = [testData.data[0], testData.data[1]];

      results.forEach(location => {
        const { container } = renderWithRouter(
          <VaFacilityResult
            location={location}
            query={committedQuery}
            showHealthConnectNumber="1-877-222-VETS"
          />,
        );

        expect(container.querySelector('.facility-result')).to.exist;
        expect(container.querySelector('.facility-phone-group')).to.exist;
      });
    });

    it('should render burial link for cemetery facility type', () => {
      const cemeteryQuery = {
        facilityType: LocationType.CEMETERY,
      };

      const { container, getByText } = renderWithRouter(
        <VaFacilityResult
          location={testData.data[7]}
          query={cemeteryQuery}
          isCemetery
          showHealthConnectNumber={false}
        />,
      );

      expect(container.querySelector('.facility-result')).to.exist;
      expect(getByText('Learn more about burial status')).to.exist;
    });

    it('should NOT render burial link for health facility type', () => {
      const healthQuery = {
        facilityType: LocationType.HEALTH,
      };

      const { container } = renderWithRouter(
        <VaFacilityResult
          location={testData.data[0]}
          query={healthQuery}
          isCemetery={false}
          showHealthConnectNumber="1-877-222-VETS"
        />,
      );

      expect(container.querySelector('.facility-result')).to.exist;
      const allLinks = container.querySelectorAll('a');
      const burialLink = Array.from(allLinks).find(link =>
        link.textContent.includes('Learn more about burial status'),
      );
      expect(burialLink).to.be.undefined;
    });
  });
});
