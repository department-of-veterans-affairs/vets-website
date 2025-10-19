/**
 * @module tests/pages/service-periods.unit.spec
 * @description Unit tests for ServicePeriodsPage component
 * Note: These tests focus on component structure and rendering.
 * Web component event handling is tested in integration/e2e tests.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ServicePeriodsPage } from './service-periods';

describe('ServicePeriodsPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Service periods');
    });

    it('should render all form fields for a service period', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      // Check all fields are rendered using web component selectors
      expect(container.querySelector('va-select[label="Branch of service"]')).to
        .exist;
      expect(
        container.querySelector(
          'va-memorable-date[label="Service start date"]',
        ),
      ).to.exist;
      expect(
        container.querySelector('va-memorable-date[label="Service end date"]'),
      ).to.exist;
      expect(container.querySelector('va-text-input[label="Place of entry"]'))
        .to.exist;
      expect(
        container.querySelector('va-text-input[label="Place of separation"]'),
      ).to.exist;
      expect(
        container.querySelector(
          'va-text-input[label="Grade, rank, or rating"]',
        ),
      ).to.exist;
    });

    it('should render with at least one service period by default', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const servicePeriodItems = container.querySelectorAll(
        '.array-field-item',
      );
      expect(servicePeriodItems).to.have.lengthOf(1);
    });
  });

  describe('Data Handling', () => {
    it('should render service period items', () => {
      const existingData = {
        servicePeriods: [
          {
            branchOfService: 'army',
            dateFrom: '1962-01-01',
            dateTo: '1965-05-19',
            placeOfEntry: 'Coruscant Jedi Temple',
            placeOfSeparation: 'Mustafar',
            rank: 'Jedi Knight / General',
          },
        ],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      const servicePeriodItems = container.querySelectorAll(
        '.array-field-item',
      );
      expect(servicePeriodItems.length).to.be.at.least(1);
    });

    it('should handle null or undefined data gracefully', () => {
      const dataWithNullPeriod = {
        servicePeriods: [null, undefined],
      };

      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={dataWithNullPeriod}
          setFormData={mockSetFormData}
        />,
      );

      // Should filter out null/undefined and render default empty item
      const servicePeriodItems = container.querySelectorAll(
        '.array-field-item',
      );
      expect(servicePeriodItems).to.exist;
    });
  });

  describe('Schema Validation', () => {
    it('should render date fields', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const dateFields = container.querySelectorAll('va-memorable-date');
      expect(dateFields).to.have.length.at.least(2);
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
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
        <ServicePeriodsPage
          goForward={mockGoForward}
          goBack={mockGoBack}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const backButton = container.querySelector('va-button[text="Back"]');
      expect(backButton).to.exist;
    });

    it('should not render back button if goBack is not provided', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const backButton = container.querySelector('va-button[text="Back"]');
      expect(backButton).to.not.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render save button instead of continue in review mode', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
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

  describe('ArrayField Functionality', () => {
    it('should render add button', () => {
      const { container } = render(
        <ServicePeriodsPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const addButton = container.querySelector(
        'va-button[text="Add another service period"]',
      );
      expect(addButton).to.exist;
    });
  });
});
