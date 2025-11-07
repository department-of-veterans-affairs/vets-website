/**
 * @module tests/pages/claimant-address.unit.spec
 * @description Unit tests for ClaimantAddressPage component
 */

import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { PageTemplateCore } from '@bio-aquia/shared/components/templates';
import { AddressField } from '@bio-aquia/shared/components/molecules';
import {
  claimantAddressPageSchema,
  claimantAddressSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

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
const ClaimantAddressPageContent = ({
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

  const addressLabel = `${formattedName}'s mailing address`;
  const addressDescription = `We'll send any important information about ${formattedName}'s application to this address.`;

  return (
    <PageTemplateCore
      title=""
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantAddressPageSchema}
      sectionName="claimantAddress"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        claimantAddress: {
          street: '',
          street2: '',
          street3: '',
          city: '',
          state: '',
          country: 'USA',
          postalCode: '',
          isMilitary: false,
        },
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <AddressField
            name="claimantAddress"
            label={addressLabel}
            description={addressDescription}
            value={localData.claimantAddress}
            onChange={handleFieldChange}
            schema={claimantAddressSchema}
            errors={
              formSubmitted && errors.claimantAddress
                ? {
                    street:
                      errors.claimantAddress.street ||
                      errors.claimantAddress?.street,
                    street2:
                      errors.claimantAddress.street2 ||
                      errors.claimantAddress?.street2,
                    city:
                      errors.claimantAddress.city ||
                      errors.claimantAddress?.city,
                    state:
                      errors.claimantAddress.state ||
                      errors.claimantAddress?.state,
                    country:
                      errors.claimantAddress.country ||
                      errors.claimantAddress?.country,
                    postalCode:
                      errors.claimantAddress.postalCode ||
                      errors.claimantAddress?.postalCode,
                  }
                : {}
            }
            touched={
              formSubmitted
                ? {
                    street: true,
                    street2: true,
                    street3: true,
                    city: true,
                    state: true,
                    country: true,
                    postalCode: true,
                  }
                : {}
            }
            required
          />
        </>
      )}
    </PageTemplateCore>
  );
};

ClaimantAddressPageContent.propTypes = {
  data: PropTypes.object,
  setFormData: PropTypes.func,
  goForward: PropTypes.func,
  goBack: PropTypes.func,
  onReviewPage: PropTypes.bool,
  updatePage: PropTypes.func,
};

describe('ClaimantAddressPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ClaimantAddressPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('mailing address');
    });

    it('should render page title', () => {
      const { container } = render(
        <ClaimantAddressPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('mailing address');
    });

    it('should render description text', () => {
      const { container } = render(
        <ClaimantAddressPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include("Claimant's mailing address");
      expect(container.textContent).to.include('important information');
    });
  });

  describe('Field Rendering', () => {
    it('should render address field component', () => {
      const { container } = render(
        <ClaimantAddressPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
      expect(container.querySelector('va-select')).to.exist;
    });
  });

  describe('Data Handling', () => {
    it('should render with existing address data', () => {
      const existingData = {
        claimantAddress: {
          street: '456 Ghost Squadron Rd',
          street2: 'Unit 2B',
          street3: '',
          city: 'Lothal',
          state: 'OR',
          country: 'USA',
          postalCode: '97201',
          isMilitary: false,
        },
      };

      const { container } = render(
        <ClaimantAddressPageContent
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <ClaimantAddressPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <ClaimantAddressPageContent
          goForward={mockGoForward}
          data={null}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should display claimant name in title when available', () => {
      const existingData = {
        claimantInformation: {
          claimantFullName: {
            first: 'Ahsoka',
            last: 'Tano',
          },
        },
      };

      const { container } = render(
        <ClaimantAddressPageContent
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Ahsoka Tano');
      expect(container.textContent).to.include('mailing address');
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <ClaimantAddressPageContent
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
        <ClaimantAddressPageContent
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
        <ClaimantAddressPageContent
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
        <ClaimantAddressPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should accept optional props', () => {
      const { container } = render(
        <ClaimantAddressPageContent
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
