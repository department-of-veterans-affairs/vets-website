/**
 * @module tests/pages/hospitalization-facility-review.unit.spec
 * @description Unit tests for HospitalizationFacilityReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { HospitalizationFacilityReviewPage } from './hospitalization-facility-review';

describe('HospitalizationFacilityReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Hospitalization facility';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Hospitalization facility');
    });

    it('should render edit button', () => {
      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should display complete facility information', () => {
      const data = {
        hospitalizationFacility: {
          facilityName: 'VA Medical Center',
          facilityStreetAddress: '123 Medical Plaza',
          facilityCity: 'Boston',
          facilityState: 'MA',
          facilityZip: '02101',
        },
      };

      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('VA Medical Center');
      expect(container.textContent).to.include('123 Medical Plaza');
      expect(container.textContent).to.include('Boston');
    });

    it('should display facility name only', () => {
      const data = {
        hospitalizationFacility: {
          facilityName: 'General Hospital',
        },
      };

      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('General Hospital');
    });

    it('should format address with all fields', () => {
      const data = {
        hospitalizationFacility: {
          facilityName: 'City Hospital',
          facilityStreetAddress: '456 Healthcare Drive',
          facilityCity: 'New York',
          facilityState: 'NY',
          facilityZip: '10001',
        },
      };

      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('City Hospital');
      expect(container.textContent).to.include('456 Healthcare Drive');
      expect(container.textContent).to.include('New York');
    });

    it('should format address without zip code', () => {
      const data = {
        hospitalizationFacility: {
          facilityName: 'Regional Medical',
          facilityStreetAddress: '789 Health Ave',
          facilityCity: 'Seattle',
          facilityState: 'WA',
        },
      };

      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Regional Medical');
      expect(container.textContent).to.include('789 Health Ave');
      expect(container.textContent).to.include('Seattle');
    });

    it('should format address without street address', () => {
      const data = {
        hospitalizationFacility: {
          facilityName: 'Community Hospital',
          facilityCity: 'Portland',
          facilityState: 'OR',
          facilityZip: '97201',
        },
      };

      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Community Hospital');
      expect(container.textContent).to.include('Portland');
    });

    it('should handle partial address data', () => {
      const data = {
        hospitalizationFacility: {
          facilityName: 'Metro Hospital',
          facilityCity: 'Chicago',
        },
      };

      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Metro Hospital');
      expect(container.textContent).to.include('Chicago');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing hospitalizationFacility section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty hospitalizationFacility object', () => {
      const data = {
        hospitalizationFacility: {},
      };

      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null address fields', () => {
      const data = {
        hospitalizationFacility: {
          facilityName: 'Test Hospital',
          facilityStreetAddress: null,
          facilityCity: null,
          facilityState: null,
          facilityZip: null,
        },
      };

      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Test Hospital');
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage prop correctly', () => {
      const customEditPage = () => {};
      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={{}}
          editPage={customEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });
});
