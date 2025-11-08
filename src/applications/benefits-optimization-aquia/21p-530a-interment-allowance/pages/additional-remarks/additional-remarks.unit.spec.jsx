/**
 * @module tests/pages/additional-remarks.unit.spec
 * @description Unit tests for AdditionalRemarksPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { AdditionalRemarksPage } from './additional-remarks';

describe('AdditionalRemarksPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <AdditionalRemarksPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Additional remarks');
    });

    it('should render textarea field', () => {
      const { container } = render(
        <AdditionalRemarksPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const textarea = container.querySelector(
        'va-textarea[label="Provide any additional remarks about your application"]',
      );
      expect(textarea).to.exist;
    });

    it('should render textarea with character limit', () => {
      const { container } = render(
        <AdditionalRemarksPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const textarea = container.querySelector('va-textarea[maxlength="1000"]');
      expect(textarea).to.exist;
    });
  });

  describe('Data Handling', () => {
    it('should render with existing remarks', () => {
      const existingData = {
        additionalRemarks:
          'May the Force be with him. General Skywalker served the Republic with honor.',
      };

      const { container } = render(
        <AdditionalRemarksPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      const textarea = container.querySelector('va-textarea');
      expect(textarea).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <AdditionalRemarksPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const textarea = container.querySelector('va-textarea');
      expect(textarea).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <AdditionalRemarksPage
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
        <AdditionalRemarksPage
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
        <AdditionalRemarksPage
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
        <AdditionalRemarksPage
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
