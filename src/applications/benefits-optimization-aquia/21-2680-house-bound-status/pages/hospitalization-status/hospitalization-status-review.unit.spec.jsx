/**
 * @module tests/pages/hospitalization-status-review.unit.spec
 * @description Unit tests for HospitalizationStatusReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { HospitalizationStatusReviewPage } from './hospitalization-status-review';

describe('HospitalizationStatusReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Hospitalization status';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <HospitalizationStatusReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <HospitalizationStatusReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Hospitalization status');
    });

    it('should render edit button', () => {
      const { container } = render(
        <HospitalizationStatusReviewPage
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
    it('should display "Yes" for currently hospitalized', () => {
      const data = {
        hospitalizationStatus: {
          isCurrentlyHospitalized: 'yes',
        },
      };

      const { container } = render(
        <HospitalizationStatusReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Yes');
    });

    it('should display "No" for not currently hospitalized', () => {
      const data = {
        hospitalizationStatus: {
          isCurrentlyHospitalized: 'no',
        },
      };

      const { container } = render(
        <HospitalizationStatusReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('No');
    });

    it('should display raw value when label not found', () => {
      const data = {
        hospitalizationStatus: {
          isCurrentlyHospitalized: 'unknown',
        },
      };

      const { container } = render(
        <HospitalizationStatusReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('unknown');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <HospitalizationStatusReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing hospitalizationStatus section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <HospitalizationStatusReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty hospitalizationStatus object', () => {
      const data = {
        hospitalizationStatus: {},
      };

      const { container } = render(
        <HospitalizationStatusReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage prop correctly', () => {
      const customEditPage = () => {};
      const { container } = render(
        <HospitalizationStatusReviewPage
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
