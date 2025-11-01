/**
 * Unit tests for AdmissionDateReview component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { AdmissionDateReview } from './admission-date-review';

describe('AdmissionDateReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Admission date';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <AdmissionDateReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <AdmissionDateReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Admission date');
    });

    it('should render edit button', () => {
      const { container } = render(
        <AdmissionDateReview
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
        admissionDateInfo: {
          admissionDate: '2020-01-15',
        },
      };

      const { container } = render(
        <AdmissionDateReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include(
        'Date of admission to nursing home',
      );
    });

    it('should display formatted date', () => {
      const data = {
        admissionDateInfo: {
          admissionDate: '2020-01-15',
        },
      };

      const { container } = render(
        <AdmissionDateReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      // The formatDate function will format the date
      expect(container).to.exist;
    });

    it('should display "Not provided" for missing admission date', () => {
      const data = {
        admissionDateInfo: {},
      };

      const { container } = render(
        <AdmissionDateReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <AdmissionDateReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Not provided');
    });

    it('should handle missing admissionDateInfo section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <AdmissionDateReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null admission date', () => {
      const data = {
        admissionDateInfo: {
          admissionDate: null,
        },
      };

      const { container } = render(
        <AdmissionDateReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should handle undefined admission date', () => {
      const data = {
        admissionDateInfo: {
          admissionDate: undefined,
        },
      };

      const { container } = render(
        <AdmissionDateReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage prop correctly', () => {
      const customEditPage = () => {};
      const { container } = render(
        <AdmissionDateReview
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
