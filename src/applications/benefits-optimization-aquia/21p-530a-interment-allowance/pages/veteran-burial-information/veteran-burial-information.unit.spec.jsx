/**
 * @module tests/pages/veteran-burial-information.unit.spec
 * @description Unit tests for VeteranBurialInformationPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranBurialInformationPage } from './veteran-burial-information';

describe('VeteranBurialInformationPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranBurialInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Veteran');
      expect(container.textContent).to.include('burial information');
    });

    it('should render all form fields', () => {
      const { container } = render(
        <VeteranBurialInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(
        container.querySelector('va-memorable-date[label="Date of death"]'),
      ).to.exist;
      expect(
        container.querySelector('va-memorable-date[label="Date of burial"]'),
      ).to.exist;
      expect(container.querySelector('va-text-input[label="Name"]')).to.exist;
      expect(container.querySelector('va-text-input[label="City"]')).to.exist;
      expect(container.querySelector('va-select[label="State"]')).to.exist;
    });

    it('should show cemetery information section', () => {
      const { container } = render(
        <VeteranBurialInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Cemetery information');
    });
  });

  describe('Data Handling', () => {
    it('should render with existing burial data', () => {
      const existingData = {
        dateOfDeath: '1984-05-04',
        dateOfBurial: '1984-05-05',
        cemeteryName: 'Endor Forest Sanctuary',
        cemeteryLocation: {
          city: 'Bright Tree Village',
          state: 'CA',
        },
      };

      const { container } = render(
        <VeteranBurialInformationPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-memorable-date')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranBurialInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-memorable-date')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <VeteranBurialInformationPage
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
        <VeteranBurialInformationPage
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
        <VeteranBurialInformationPage
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
