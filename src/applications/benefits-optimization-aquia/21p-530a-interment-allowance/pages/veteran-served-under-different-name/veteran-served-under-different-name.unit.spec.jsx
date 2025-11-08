/**
 * @module tests/pages/veteran-served-under-different-name.unit.spec
 * @description Unit tests for VeteranServedUnderDifferentNamePage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranServedUnderDifferentNamePage } from './veteran-served-under-different-name';

describe('VeteranServedUnderDifferentNamePage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranServedUnderDifferentNamePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Previous names');
    });

    it('should render radio field', () => {
      const { container } = render(
        <VeteranServedUnderDifferentNamePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const radioField = container.querySelector('va-radio');
      expect(radioField).to.exist;
    });

    it('should render radio field with label attribute', () => {
      const { container } = render(
        <VeteranServedUnderDifferentNamePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const radioField = container.querySelector(
        'va-radio[label="Did the Veteran serve under another name?"]',
      );
      expect(radioField).to.exist;
    });
  });

  describe('Data Handling', () => {
    it('should render with yes selection', () => {
      const existingData = {
        veteranServedUnderDifferentName: 'yes',
      };

      const { container } = render(
        <VeteranServedUnderDifferentNamePage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      const radioField = container.querySelector('va-radio');
      expect(radioField).to.exist;
    });

    it('should render with no selection', () => {
      const existingData = {
        veteranServedUnderDifferentName: 'no',
      };

      const { container } = render(
        <VeteranServedUnderDifferentNamePage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      const radioField = container.querySelector('va-radio');
      expect(radioField).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <VeteranServedUnderDifferentNamePage
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
        <VeteranServedUnderDifferentNamePage
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
        <VeteranServedUnderDifferentNamePage
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
