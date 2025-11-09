/**
 * @module tests/pages/service-dates.unit.spec
 * @description Unit tests for ServiceDatesPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ServiceDatesPage, ensureDateStrings } from './service-dates';

describe('ServiceDatesPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockGoToPath = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ServiceDatesPage
          goForward={mockGoForward}
          data={{ tempServicePeriod: { branchOfService: 'army' } }}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should render service start date field', () => {
      const { container } = render(
        <ServiceDatesPage
          goForward={mockGoForward}
          data={{ tempServicePeriod: { branchOfService: 'army' } }}
          setFormData={mockSetFormData}
        />,
      );

      expect(
        container.querySelector(
          'va-memorable-date[label="Service start date"]',
        ),
      ).to.exist;
    });

    it('should render service end date field', () => {
      const { container } = render(
        <ServiceDatesPage
          goForward={mockGoForward}
          data={{ tempServicePeriod: { branchOfService: 'army' } }}
          setFormData={mockSetFormData}
        />,
      );

      expect(
        container.querySelector('va-memorable-date[label="Service end date"]'),
      ).to.exist;
    });

    it('should render required date fields', () => {
      const { container } = render(
        <ServiceDatesPage
          goForward={mockGoForward}
          data={{ tempServicePeriod: { branchOfService: 'army' } }}
          setFormData={mockSetFormData}
        />,
      );

      const startDate = container.querySelector(
        'va-memorable-date[label="Service start date"]',
      );
      const endDate = container.querySelector(
        'va-memorable-date[label="Service end date"]',
      );

      expect(startDate.getAttribute('required')).to.exist;
      expect(endDate.getAttribute('required')).to.exist;
    });

    it('should display branch name in title', () => {
      const { container } = render(
        <ServiceDatesPage
          goForward={mockGoForward}
          data={{ tempServicePeriod: { branchOfService: 'army' } }}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Army');
    });
  });

  describe('Data Handling', () => {
    it('should render with existing date data', () => {
      const existingData = {
        tempServicePeriod: {
          branchOfService: 'navy',
          dateFrom: '2000-01-01',
          dateTo: '2004-12-31',
        },
      };

      const { container } = render(
        <ServiceDatesPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-memorable-date')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <ServiceDatesPage
          goForward={mockGoForward}
          data={{ tempServicePeriod: {} }}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-memorable-date')).to.exist;
    });

    it('should handle minimal tempServicePeriod', () => {
      const dataWithMinimal = {
        tempServicePeriod: {
          branchOfService: '',
        },
      };

      const { container } = render(
        <ServiceDatesPage
          goForward={mockGoForward}
          data={dataWithMinimal}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-memorable-date')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <ServiceDatesPage
          goForward={mockGoForward}
          data={{ tempServicePeriod: { branchOfService: 'army' } }}
          setFormData={mockSetFormData}
        />,
      );

      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );
      expect(continueButton).to.exist;
    });

    it('should render back button when goBack is provided', () => {
      const { container } = render(
        <ServiceDatesPage
          goForward={mockGoForward}
          goBack={mockGoBack}
          data={{ tempServicePeriod: { branchOfService: 'army' } }}
          setFormData={mockSetFormData}
        />,
      );

      const backButton = container.querySelector('va-button[text="Back"]');
      expect(backButton).to.exist;
    });

    it('should show cancel button when editing existing service period', () => {
      const editingData = {
        servicePeriods: [{ branchOfService: 'army' }],
        editingServicePeriodIndex: 0,
        tempServicePeriod: { branchOfService: 'navy' },
      };

      const { container } = render(
        <ServiceDatesPage
          goForward={mockGoForward}
          goBack={mockGoBack}
          goToPath={mockGoToPath}
          data={editingData}
          setFormData={mockSetFormData}
        />,
      );

      const cancelButton = container.querySelector('va-button[text="Cancel"]');
      expect(cancelButton).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render save button instead of continue in review mode', () => {
      const { container } = render(
        <ServiceDatesPage
          goForward={mockGoForward}
          data={{ tempServicePeriod: { branchOfService: 'army' } }}
          setFormData={mockSetFormData}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      const saveButton = container.querySelector('va-button[text="Save"]');
      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );

      expect(saveButton).to.exist;
      expect(continueButton).to.not.exist;
    });
  });

  describe('ensureDateStrings utility', () => {
    it('should return form data unchanged if no dates need transformation', () => {
      const formData = {
        tempServicePeriod: {
          dateFrom: '2000-01-01',
          dateTo: '2004-12-31',
        },
      };

      const result = ensureDateStrings(formData);
      expect(result).to.deep.equal(formData);
    });

    it('should handle null or undefined data', () => {
      expect(ensureDateStrings(null)).to.equal(null);
      expect(ensureDateStrings(undefined)).to.equal(undefined);
    });

    it('should handle empty object', () => {
      const result = ensureDateStrings({});
      expect(result).to.deep.equal({});
    });
  });
});
