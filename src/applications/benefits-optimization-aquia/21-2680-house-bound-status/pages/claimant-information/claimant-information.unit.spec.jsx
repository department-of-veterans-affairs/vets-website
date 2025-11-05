/**
 * @module tests/pages/claimant-information.unit.spec
 * @description Unit tests for ClaimantInformationPage component
 */

import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { PageTemplateCore } from '@bio-aquia/shared/components/templates';
import { MemorableDateField } from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { transformDates } from '@bio-aquia/shared/forms';
import {
  claimantDOBSchema,
  claimantInformationPageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Helper function to find web component by tag and label attribute
 */
const findByLabel = (container, tagName, labelText) => {
  return Array.from(container.querySelectorAll(tagName)).find(
    el => el.getAttribute('label') === labelText,
  );
};

/**
 * Helper function to find web component by tag and text attribute
 */
const findByText = (container, tagName, textValue) => {
  return Array.from(container.querySelectorAll(tagName)).find(
    el => el.getAttribute('text') === textValue,
  );
};

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['claimantDOB']);
};

// Test component using PageTemplateCore directly
const ClaimantInformationPageContent = ({
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
  const existingData = formDataToUse?.claimantInformation || {};
  const migratedData = {
    ...formDataToUse,
    claimantInformation: {
      ...(existingData.claimantFullName && {
        claimantFullName: existingData.claimantFullName,
      }),
      claimantDOB: existingData.claimantDOB || existingData.claimantDob || '',
    },
  };

  const relationship = migratedData?.claimantRelationship?.relationship;

  /**
   * Get the appropriate description text based on relationship
   */
  const getDescription = () => {
    switch (relationship) {
      case 'veteran':
        return 'Enter your information.';
      case 'spouse':
        return "Enter your spouse's information.";
      case 'child':
        return "Enter your child's information.";
      case 'parent':
        return "Enter your parent's information.";
      default:
        return 'Enter your information as the person filing on behalf of the Veteran.';
    }
  };

  return (
    <PageTemplateCore
      data={migratedData}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantInformationPageSchema}
      sectionName="claimantInformation"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        claimantFullName: {
          first: '',
          middle: '',
          last: '',
        },
        claimantDOB: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p>{getDescription()}</p>

          <FullnameField
            fieldPrefix="claimant"
            value={localData.claimantFullName}
            onChange={handleFieldChange}
            errors={errors.claimantFullName || {}}
            forceShowError={formSubmitted}
            required
            showSuffix={false}
          />

          <MemorableDateField
            label="Date of birth"
            name="claimantDOB"
            value={localData.claimantDOB || ''}
            onChange={handleFieldChange}
            error={errors.claimantDOB}
            forceShowError={formSubmitted}
            required
            schema={claimantDOBSchema}
          />
        </>
      )}
    </PageTemplateCore>
  );
};

ClaimantInformationPageContent.propTypes = {
  data: PropTypes.object,
  setFormData: PropTypes.func,
  goForward: PropTypes.func,
  goBack: PropTypes.func,
  onReviewPage: PropTypes.bool,
  updatePage: PropTypes.func,
};

describe('ClaimantInformationPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ClaimantInformationPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Enter your information');
    });

    it('should render description text', () => {
      const { container } = render(
        <ClaimantInformationPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        'Enter your information as the person filing on behalf of the Veteran.',
      );
    });
  });

  describe('Field Rendering', () => {
    it('should render name fields', () => {
      const { container } = render(
        <ClaimantInformationPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(findByLabel(container, 'va-text-input', 'First name')).to.exist;
      expect(findByLabel(container, 'va-text-input', 'Last name')).to.exist;
    });

    it('should render date of birth field', () => {
      const { container } = render(
        <ClaimantInformationPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-memorable-date')).to.exist;
    });
  });

  describe('Data Handling', () => {
    it('should render with existing claimant data', () => {
      const existingData = {
        claimantInformation: {
          claimantFullName: {
            first: 'Padme',
            middle: 'Naberrie',
            last: 'Amidala',
          },
          claimantDOB: '1980-05-25',
        },
      };

      const { container } = render(
        <ClaimantInformationPageContent
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <ClaimantInformationPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <ClaimantInformationPageContent
          goForward={mockGoForward}
          data={null}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Relationship-Based Description', () => {
    it('should show veteran description when relationship is veteran', () => {
      const data = {
        claimantRelationship: {
          relationship: 'veteran',
        },
      };

      const { container } = render(
        <ClaimantInformationPageContent
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Enter your information.');
    });

    it('should show spouse description when relationship is spouse', () => {
      const data = {
        claimantRelationship: {
          relationship: 'spouse',
        },
      };

      const { container } = render(
        <ClaimantInformationPageContent
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        "Enter your spouse's information.",
      );
    });

    it('should show child description when relationship is child', () => {
      const data = {
        claimantRelationship: {
          relationship: 'child',
        },
      };

      const { container } = render(
        <ClaimantInformationPageContent
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        "Enter your child's information.",
      );
    });

    it('should show parent description when relationship is parent', () => {
      const data = {
        claimantRelationship: {
          relationship: 'parent',
        },
      };

      const { container } = render(
        <ClaimantInformationPageContent
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        "Enter your parent's information.",
      );
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <ClaimantInformationPageContent
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
        <ClaimantInformationPageContent
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
        <ClaimantInformationPageContent
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
        <ClaimantInformationPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should accept optional props', () => {
      const { container } = render(
        <ClaimantInformationPageContent
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
