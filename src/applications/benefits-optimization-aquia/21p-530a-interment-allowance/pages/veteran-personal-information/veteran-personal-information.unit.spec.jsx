/**
 * @module tests/pages/veteran-personal-information.unit.spec
 * @description Unit tests for VeteranPersonalInformationPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranPersonalInformationPage } from './veteran-personal-information';

describe('VeteranPersonalInformationPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranPersonalInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Personal information');
    });

    it('should render all form fields', () => {
      const { container } = render(
        <VeteranPersonalInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

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
          'va-text-input[label="Social Security number"]',
        ),
      ).to.exist;

      // Check for service number field
      expect(
        container.querySelector('va-text-input[label="VA service number"]'),
      ).to.exist;

      // Check for VA file number field
      expect(container.querySelector('va-text-input[label="VA file number"]'))
        .to.exist;
    });
  });

  describe('Data Handling', () => {
    it('should render with existing personal data', () => {
      const existingData = {
        fullName: {
          first: 'John',
          middle: 'M',
          last: 'Smith',
        },
        ssn: '123-45-6789',
        serviceNumber: 'ABC123456',
        vaFileNumber: '12345678',
      };

      const { container } = render(
        <VeteranPersonalInformationPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranPersonalInformationPage
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
        <VeteranPersonalInformationPage
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
        <VeteranPersonalInformationPage
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
        <VeteranPersonalInformationPage
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
