/**
 * @module tests/pages/claimant-contact.unit.spec
 * @description Unit tests for ClaimantContactPage component
 */

import React from 'react';
import PropTypes from 'prop-types';
import { waitFor, render } from '@testing-library/react';
import { expect } from 'chai';
import { PageTemplateCore } from '@bio-aquia/shared/components/templates';
import { PhoneField, TextInputField } from '@bio-aquia/shared/components/atoms';
import {
  claimantPhoneNumberSchema,
  claimantMobilePhoneSchema,
  claimantEmailSchema,
  claimantContactPageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

// Test component using PageTemplateCore directly
const ClaimantContactPageTest = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Get claimant's name from form data
  const claimantName = formDataToUse?.claimantInformation?.claimantFullName;
  const firstName = claimantName?.first || '';
  const lastName = claimantName?.last || '';

  // Format the name for display
  const formattedName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || 'Claimant';

  const pageTitle = `${formattedName}'s phone number and email address`;

  return (
    <PageTemplateCore
      title={pageTitle}
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantContactPageSchema}
      sectionName="claimantContact"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        claimantPhoneNumber: '',
        claimantMobilePhone: '',
        claimantEmail: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p>
            We may use their contact information to contact them if we have
            questions about their application or if we need more information.
          </p>

          <PhoneField
            label={`${formattedName}'s home phone number`}
            name="claimantPhoneNumber"
            value={localData.claimantPhoneNumber || ''}
            onChange={handleFieldChange}
            error={errors.claimantPhoneNumber}
            forceShowError={formSubmitted}
            required
            schema={claimantPhoneNumberSchema}
          />

          <PhoneField
            label={`${formattedName}'s mobile phone number`}
            name="claimantMobilePhone"
            value={localData.claimantMobilePhone || ''}
            onChange={handleFieldChange}
            error={errors.claimantMobilePhone}
            forceShowError={formSubmitted}
            schema={claimantMobilePhoneSchema}
          />

          <TextInputField
            label={`${formattedName}'s email address`}
            name="claimantEmail"
            type="email"
            value={localData.claimantEmail || ''}
            onChange={handleFieldChange}
            error={errors.claimantEmail}
            forceShowError={formSubmitted}
            required
            schema={claimantEmailSchema}
          />
        </>
      )}
    </PageTemplateCore>
  );
};

ClaimantContactPageTest.propTypes = {
  data: PropTypes.object,
  setFormData: PropTypes.func,
  goForward: PropTypes.func,
  goBack: PropTypes.func,
  onReviewPage: PropTypes.bool,
  updatePage: PropTypes.func,
};

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

describe('ClaimantContactPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ClaimantContactPageTest
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('phone number and email');
    });

    it('should render page title', () => {
      const { container } = render(
        <ClaimantContactPageTest
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('phone number and email');
    });

    it('should render instruction text', () => {
      const { container } = render(
        <ClaimantContactPageTest
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        'contact them if we have questions',
      );
    });
  });

  describe('Field Rendering', () => {
    it('should render phone number field', async () => {
      const { container } = render(
        <ClaimantContactPageTest
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(
          findByLabel(
            container,
            'va-telephone-input',
            "Claimant's home phone number",
          ),
        ).to.exist;
      });
    });

    it('should render mobile phone number field', async () => {
      const { container } = render(
        <ClaimantContactPageTest
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(
          findByLabel(
            container,
            'va-telephone-input',
            "Claimant's mobile phone number",
          ),
        ).to.exist;
      });
    });

    it('should render email address field', async () => {
      const { container } = render(
        <ClaimantContactPageTest
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(
          findByLabel(container, 'va-text-input', "Claimant's email address"),
        ).to.exist;
      });
    });

    it('should show optional hint for mobile phone', async () => {
      const { container } = render(
        <ClaimantContactPageTest
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        const mobileField = findByLabel(
          container,
          'va-telephone-input',
          "Claimant's mobile phone number",
        );
        expect(mobileField).to.exist;
        expect(mobileField.getAttribute('required')).to.equal('false');
      });
    });
  });

  describe('Data Handling', () => {
    it('should render with existing contact data', () => {
      const existingData = {
        claimantPhoneNumber: '555-123-4567',
        claimantMobilePhone: '555-987-6543',
        claimantEmail: 'ahsoka.tano@rebellion.org',
      };

      const { container } = render(
        <ClaimantContactPageTest
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-telephone-input')).to.exist;
    });

    it('should render with partial contact data', () => {
      const existingData = {
        claimantPhoneNumber: '555-123-4567',
        claimantMobilePhone: '',
        claimantEmail: 'jane.doe@example.com',
      };

      const { container } = render(
        <ClaimantContactPageTest
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-telephone-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <ClaimantContactPageTest
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-telephone-input')).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <ClaimantContactPageTest
          goForward={mockGoForward}
          data={null}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-telephone-input')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <ClaimantContactPageTest
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
        <ClaimantContactPageTest
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
        <ClaimantContactPageTest
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
        <ClaimantContactPageTest
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should accept optional props', () => {
      const { container } = render(
        <ClaimantContactPageTest
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
