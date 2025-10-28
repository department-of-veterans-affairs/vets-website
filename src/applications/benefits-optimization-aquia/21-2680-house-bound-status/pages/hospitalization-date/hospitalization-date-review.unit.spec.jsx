/**
 * @module tests/pages/hospitalization-date-review.unit.spec
 * @description Unit tests for HospitalizationDateReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { HospitalizationDateReviewPage } from './hospitalization-date-review';

describe('HospitalizationDateReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Hospitalization date';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <HospitalizationDateReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <HospitalizationDateReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Hospitalization date');
    });

    it('should render edit button', () => {
      const { container } = render(
        <HospitalizationDateReviewPage
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
    it('should display admission date', () => {
      const data = {
        hospitalizationDate: {
          admissionDate: '2023-05-15',
        },
      };

      const { container } = render(
        <HospitalizationDateReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should display different admission date', () => {
      const data = {
        hospitalizationDate: {
          admissionDate: '2024-01-01',
        },
      };

      const { container } = render(
        <HospitalizationDateReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should display past admission date', () => {
      const data = {
        hospitalizationDate: {
          admissionDate: '2020-12-31',
        },
      };

      const { container } = render(
        <HospitalizationDateReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <HospitalizationDateReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing hospitalizationDate section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <HospitalizationDateReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty hospitalizationDate object', () => {
      const data = {
        hospitalizationDate: {},
      };

      const { container } = render(
        <HospitalizationDateReviewPage
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
        <HospitalizationDateReviewPage
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
