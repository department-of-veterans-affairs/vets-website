/**
 * @module tests/pages/veteran-birth-information.unit.spec
 * @description Unit tests for VeteranBirthInformationPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranBirthInformationPage } from './veteran-birth-information';

describe('VeteranBirthInformationPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranBirthInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Birth information');
    });

    it('should render all form fields', () => {
      const { container } = render(
        <VeteranBirthInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(
        container.querySelector('va-memorable-date[label="Date of birth"]'),
      ).to.exist;
      expect(container.querySelector('va-text-input[label="City of birth"]')).to
        .exist;
      expect(container.querySelector('va-select[label="State of birth"]')).to
        .exist;
    });
  });

  describe('Data Handling', () => {
    it('should render with existing birth data', () => {
      const existingData = {
        dateOfBirth: '1941-05-04',
        placeOfBirth: {
          city: 'Mos Espa',
          state: 'AZ',
        },
      };

      const { container } = render(
        <VeteranBirthInformationPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-memorable-date')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranBirthInformationPage
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
        <VeteranBirthInformationPage
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
        <VeteranBirthInformationPage
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
        <VeteranBirthInformationPage
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
