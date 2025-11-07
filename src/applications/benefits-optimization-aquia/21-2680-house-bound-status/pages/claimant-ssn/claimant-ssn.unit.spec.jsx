/**
 * @module tests/pages/claimant-ssn.unit.spec
 * @description Unit tests for ClaimantSSNPage component
 */

import React from 'react';
import PropTypes from 'prop-types';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { PageTemplateCore } from '@bio-aquia/shared/components/templates';
import { SSNField } from '@bio-aquia/shared/components/atoms';
import {
  claimantSSNSchema,
  claimantSSNPageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

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

// Test component using PageTemplateCore directly
const ClaimantSSNPageContent = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Migrate old field names to new field names for backward compatibility
  const migratedData = {
    ...formDataToUse,
    claimantSSN: {
      claimantSSN:
        formDataToUse?.claimantSSN?.claimantSSN ||
        formDataToUse?.claimantSSN?.claimantSsn ||
        formDataToUse?.claimantSsn?.claimantSSN ||
        formDataToUse?.claimantSsn?.claimantSsn ||
        '',
    },
  };

  // Get claimant's name from form data
  const claimantName = migratedData?.claimantInformation?.claimantFullName;
  const firstName = claimantName?.first || '';
  const lastName = claimantName?.last || '';

  // Format the name for display
  const formattedName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || 'Claimant';

  const pageTitle = `${formattedName}'s Social Security number`;

  return (
    <PageTemplateCore
      title={pageTitle}
      data={migratedData}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantSSNPageSchema}
      sectionName="claimantSSN"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        claimantSSN: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <SSNField
            label="Social Security number"
            name="claimantSSN"
            value={localData.claimantSSN || ''}
            onChange={handleFieldChange}
            error={errors.claimantSSN}
            forceShowError={formSubmitted}
            required
            schema={claimantSSNSchema}
          />
        </>
      )}
    </PageTemplateCore>
  );
};

ClaimantSSNPageContent.propTypes = {
  data: PropTypes.object,
  setFormData: PropTypes.func,
  goForward: PropTypes.func,
  goBack: PropTypes.func,
  onReviewPage: PropTypes.bool,
  updatePage: PropTypes.func,
};

describe('ClaimantSSNPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ClaimantSSNPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Social Security number');
    });

    it('should render page title', () => {
      const { container } = render(
        <ClaimantSSNPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Social Security number');
    });
  });

  describe('Field Rendering', () => {
    it('should render SSN field', async () => {
      const { container } = render(
        <ClaimantSSNPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(
          findByLabel(container, 'va-text-input', 'Social Security number'),
        ).to.exist;
      });
    });

    it('should render SSN field with correct label', () => {
      const { container } = render(
        <ClaimantSSNPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Social Security number');
    });
  });

  describe('Data Handling', () => {
    it('should render with existing SSN data', () => {
      const existingData = {
        claimantSSN: '123-45-6789',
      };

      const { container } = render(
        <ClaimantSSNPageContent
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <ClaimantSSNPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <ClaimantSSNPageContent
          goForward={mockGoForward}
          data={null}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty SSN string', () => {
      const existingData = {
        claimantSSN: '',
      };

      const { container } = render(
        <ClaimantSSNPageContent
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <ClaimantSSNPageContent
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
        <ClaimantSSNPageContent
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
        <ClaimantSSNPageContent
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
        <ClaimantSSNPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should accept optional props', () => {
      const { container } = render(
        <ClaimantSSNPageContent
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
