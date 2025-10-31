/**
 * @module tests/pages/claimant-information.unit.spec
 * @description Unit tests for ClaimantInformationPage component
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { ClaimantInformationPage } from './claimant-information';

/**
 * Helper function to find web component by tag and label attribute
 * Works around Node 22 limitation with CSS attribute selectors on custom elements
 */
const findByLabel = (container, tagName, labelText) => {
  return Array.from(container.querySelectorAll(tagName)).find(
    el => el.getAttribute('label') === labelText,
  );
};

/**
 * Helper function to find web component by tag and text attribute
 * Works around Node 22 limitation with CSS attribute selectors on custom elements
 */
const findByText = (container, tagName, textValue) => {
  return Array.from(container.querySelectorAll(tagName)).find(
    el => el.getAttribute('text') === textValue,
  );
};

describe('ClaimantInformationPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ClaimantInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Claimant information');
    });

    it('should render page title', () => {
      const { container } = render(
        <ClaimantInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Claimant information');
    });

    it('should render instruction text', () => {
      const { container } = render(
        <ClaimantInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        'Enter your information as the person filing on behalf of the Veteran',
      );
    });
  });

  describe('Field Rendering', () => {
    it('should render name fields', async () => {
      const { container } = render(
        <ClaimantInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(findByLabel(container, 'va-text-input', 'First name')).to.exist;
        expect(findByLabel(container, 'va-text-input', 'Middle name')).to.exist;
        expect(findByLabel(container, 'va-text-input', 'Last name')).to.exist;
      });
    });

    it('should render full name field label', () => {
      const { container } = render(
        <ClaimantInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include("Claimant's full name");
    });

    it('should render date of birth field', async () => {
      const { container } = render(
        <ClaimantInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(findByLabel(container, 'va-memorable-date', 'Date of birth')).to
          .exist;
      });
    });
  });

  describe('Data Handling', () => {
    it('should render with existing claimant data', () => {
      const existingData = {
        claimantFullName: {
          first: 'Ahsoka',
          middle: 'Fulcrum',
          last: 'Tano',
        },
        claimantDOB: '1970-01-15',
      };

      const { container } = render(
        <ClaimantInformationPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
      expect(container.querySelector('va-memorable-date')).to.exist;
    });

    it('should handle partial name data', () => {
      const existingData = {
        claimantFullName: {
          first: 'Ahsoka',
          middle: '',
          last: 'Tano',
        },
        claimantDOB: '',
      };

      const { container } = render(
        <ClaimantInformationPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <ClaimantInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
      expect(container.querySelector('va-memorable-date')).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <ClaimantInformationPage
          goForward={mockGoForward}
          data={null}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <ClaimantInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const continueButton = findByText(container, 'va-button', 'Continue');
      expect(continueButton).to.exist;
    });

    it('should render back button when goBack is provided', () => {
      const { container } = render(
        <ClaimantInformationPage
          goForward={mockGoForward}
          goBack={mockGoBack}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const backButton = findByText(container, 'va-button', 'Back');
      expect(backButton).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render save button instead of continue in review mode', () => {
      const { container } = render(
        <ClaimantInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      const saveButton = findByText(container, 'va-button', 'Save');
      const continueButton = findByText(container, 'va-button', 'Continue');

      expect(saveButton).to.exist;
      expect(continueButton).to.not.exist;
    });
  });

  describe('Props Handling', () => {
    it('should accept required props', () => {
      const { container } = render(
        <ClaimantInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should accept optional props', () => {
      const { container } = render(
        <ClaimantInformationPage
          goForward={mockGoForward}
          goBack={mockGoBack}
          data={{}}
          setFormData={mockSetFormData}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      expect(container).to.exist;
    });
  });
});
