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
          facilityName: 'Lothal Medical Center',
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

      expect(container.textContent).to.include('Lothal Medical Center');
      expect(container.textContent).to.include('123 Medical Plaza');
      expect(container.textContent).to.include('Boston');
    });

    it('should display facility name only', () => {
      const data = {
        hospitalizationFacility: {
          facilityName: 'Mos Eisley Cantina Clinic',
        },
      };

      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Mos Eisley Cantina Clinic');
    });

    it('should format address with all fields', () => {
      const data = {
        hospitalizationFacility: {
          facilityName: 'Coruscant General Hospital',
          facilityStreetAddress: '456 Healthcare Drive',
          facilityCity: 'Coruscant',
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

      expect(container.textContent).to.include('Coruscant General Hospital');
      expect(container.textContent).to.include('456 Healthcare Drive');
      expect(container.textContent).to.include('Coruscant');
    });

    it('should format address without zip code', () => {
      const data = {
        hospitalizationFacility: {
          facilityName: 'Naboo Royal Medical Center',
          facilityStreetAddress: '789 Health Ave',
          facilityCity: 'Naboo',
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

      expect(container.textContent).to.include('Naboo Royal Medical Center');
      expect(container.textContent).to.include('789 Health Ave');
      expect(container.textContent).to.include('Naboo');
    });

    it('should format address without street address', () => {
      const data = {
        hospitalizationFacility: {
          facilityName: 'Hoth Rebel Base Medical',
          facilityCity: 'Hoth',
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

      expect(container.textContent).to.include('Hoth Rebel Base Medical');
      expect(container.textContent).to.include('Hoth');
    });

    it('should handle partial address data', () => {
      const data = {
        hospitalizationFacility: {
          facilityName: 'Kamino Cloning Facility',
          facilityCity: 'Kamino',
        },
      };

      const { container } = render(
        <HospitalizationFacilityReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Kamino Cloning Facility');
      expect(container.textContent).to.include('Kamino');
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
          facilityName: 'Dagobah Swamp Clinic',
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

      expect(container.textContent).to.include('Dagobah Swamp Clinic');
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
