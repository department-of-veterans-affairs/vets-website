/**
 * @module tests/pages/veteran-identification.unit.spec
 * @description Unit tests for VeteranIdentificationPage component
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranIdentificationPage } from './veteran-identification';

describe('VeteranIdentificationPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include(
        "Deceased veteran's information",
      );
    });

    it('should render all identification fields', async () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        // Check for name fields (from FullnameField component)
        expect(container.querySelector('va-text-input[label="First name"]')).to
          .exist;
        expect(container.querySelector('va-text-input[label="Middle name"]')).to
          .exist;
        expect(container.querySelector('va-text-input[label="Last name"]')).to
          .exist;

        // Check for SSN field
        expect(
          container.querySelector(
            'va-text-input[label="Veteran\'s Social Security Number"]',
          ),
        ).to.exist;

        // Check for service number field
        expect(
          container.querySelector(
            'va-text-input[label="Veteran\'s service number (if different from SSN)"]',
          ),
        ).to.exist;

        // Check for VA file number field
        expect(
          container.querySelector(
            'va-text-input[label="Veteran\'s VA file number"]',
          ),
        ).to.exist;

        // Check for date fields
        expect(
          container.querySelector(
            'va-memorable-date[label="Veteran\'s date of birth"]',
          ),
        ).to.exist;
        expect(
          container.querySelector(
            'va-memorable-date[label="Veteran\'s date of death"]',
          ),
        ).to.exist;
      });
    });

    it('should render place of birth fields', () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Place of birth');
      expect(container.querySelector('va-text-input[label="City"]')).to.exist;
      expect(container.querySelector('va-text-input[label="State"]')).to.exist;
    });

    it('should show instruction text', () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        'Please provide the following information about the deceased veteran',
      );
    });
  });

  describe('Data Handling', () => {
    it('should render with existing veteran data', () => {
      const existingData = {
        fullName: {
          first: 'Anakin',
          middle: '',
          last: 'Skywalker',
        },
        ssn: '501-66-7138',
        serviceNumber: 'JT87563',
        vaFileNumber: '22387563',
        dateOfBirth: '1941-05-04',
        placeOfBirth: {
          city: 'Mos Espa',
          state: 'AZ',
        },
        dateOfDeath: '1984-05-04',
      };

      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <VeteranIdentificationPage
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
        <VeteranIdentificationPage
          goForward={mockGoForward}
          goBack={mockGoBack}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const backButton = container.querySelector('va-button[text="Back"]');
      expect(backButton).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render save button instead of continue in review mode', () => {
      const { container } = render(
        <VeteranIdentificationPage
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
});
