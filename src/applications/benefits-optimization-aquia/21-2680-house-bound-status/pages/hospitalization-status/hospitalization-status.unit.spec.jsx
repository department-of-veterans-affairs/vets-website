/**
 * @module tests/pages/hospitalization-status.unit.spec
 * @description Unit tests for HospitalizationStatusPage component
 */

import React from 'react';
import PropTypes from 'prop-types';
import { waitFor, render } from '@testing-library/react';
import { expect } from 'chai';
import { PageTemplateCore } from '@bio-aquia/shared/components/templates';
import { RadioField } from '@bio-aquia/shared/components/atoms';
import {
  isCurrentlyHospitalizedSchema,
  hospitalizationStatusPageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

// Test component using PageTemplateCore directly
const HospitalizationStatusPageTest = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse = data || {};

  // Get claimant information for dynamic title
  const relationship = formDataToUse?.claimantRelationship?.relationship;
  const isVeteran = relationship === 'veteran';
  const claimantName = formDataToUse?.claimantInformation?.claimantFullName;
  const firstName = claimantName?.first || '';
  const lastName = claimantName?.last || '';

  // Format the name for display
  const formattedName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || 'the claimant';

  const pageTitle = isVeteran
    ? 'Are you hospitalized?'
    : `Is ${formattedName} hospitalized?`;

  return (
    <PageTemplateCore
      title={pageTitle}
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={hospitalizationStatusPageSchema}
      sectionName="hospitalizationStatus"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{}}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <RadioField
            label="Hospitalization status"
            name="isCurrentlyHospitalized"
            value={localData.isCurrentlyHospitalized}
            onChange={handleFieldChange}
            schema={isCurrentlyHospitalizedSchema}
            options={[
              {
                label: 'Yes',
                value: 'yes',
              },
              {
                label: 'No',
                value: 'no',
              },
            ]}
            error={errors.isCurrentlyHospitalized}
            forceShowError={formSubmitted}
            required
          />
        </>
      )}
    </PageTemplateCore>
  );
};

HospitalizationStatusPageTest.propTypes = {
  data: PropTypes.object,
  setFormData: PropTypes.func,
  goForward: PropTypes.func,
  goBack: PropTypes.func,
  onReviewPage: PropTypes.bool,
  updatePage: PropTypes.func,
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

describe('HospitalizationStatusPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <HospitalizationStatusPageTest
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should render page title with default claimant name', () => {
      const { container } = render(
        <HospitalizationStatusPageTest
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Is the claimant hospitalized?');
    });

    it('should render page title with claimant full name', () => {
      const data = {
        claimantInformation: {
          claimantFullName: {
            first: 'Ahsoka',
            last: 'Tano',
          },
        },
      };

      const { container } = render(
        <HospitalizationStatusPageTest
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Is Ahsoka Tano hospitalized?');
    });

    it('should render page title with only first name when last name is missing', () => {
      const data = {
        claimantInformation: {
          claimantFullName: {
            first: 'Ahsoka',
          },
        },
      };

      const { container } = render(
        <HospitalizationStatusPageTest
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Is Ahsoka hospitalized?');
    });

    it('should render page title for veteran relationship', () => {
      const data = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'John',
            last: 'Doe',
          },
        },
      };

      const { container } = render(
        <HospitalizationStatusPageTest
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Are you hospitalized?');
    });
  });

  describe('Field Rendering', () => {
    it('should render radio group for hospitalization status', async () => {
      const { container } = render(
        <HospitalizationStatusPageTest
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        const radioGroup = container.querySelector('va-radio');
        expect(radioGroup).to.exist;
      });
    });

    it('should render Yes and No options', () => {
      const { container } = render(
        <HospitalizationStatusPageTest
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.exist;

      const radioOptions = container.querySelectorAll('va-radio-option');
      expect(radioOptions.length).to.equal(2);

      const values = Array.from(radioOptions).map(opt =>
        opt.getAttribute('value'),
      );
      expect(values).to.include('yes');
      expect(values).to.include('no');
    });

    it('should render radio label with claimant name', async () => {
      const data = {
        claimantInformation: {
          claimantFullName: {
            first: 'Jane',
            last: 'Doe',
          },
        },
      };

      const { container } = render(
        <HospitalizationStatusPageTest
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(container.textContent).to.include('Is Jane Doe hospitalized?');
      });
    });
  });

  describe('Data Handling', () => {
    it('should render with hospitalized status yes', () => {
      const existingData = {
        hospitalizationStatus: {
          isCurrentlyHospitalized: 'yes',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Ahsoka',
          },
        },
      };

      const { container } = render(
        <HospitalizationStatusPageTest
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.exist;

      const radioOptions = container.querySelectorAll('va-radio-option');
      const yesOption = Array.from(radioOptions).find(
        opt => opt.getAttribute('value') === 'yes',
      );
      expect(yesOption).to.exist;
      expect(yesOption.hasAttribute('checked')).to.be.true;
    });

    it('should render with hospitalized status no', () => {
      const existingData = {
        hospitalizationStatus: {
          isCurrentlyHospitalized: 'no',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Ahsoka',
          },
        },
      };

      const { container } = render(
        <HospitalizationStatusPageTest
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.exist;

      const radioOptions = container.querySelectorAll('va-radio-option');
      const noOption = Array.from(radioOptions).find(
        opt => opt.getAttribute('value') === 'no',
      );
      expect(noOption).to.exist;
      expect(noOption.hasAttribute('checked')).to.be.true;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <HospitalizationStatusPageTest
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-radio')).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <HospitalizationStatusPageTest
          goForward={mockGoForward}
          data={null}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-radio')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <HospitalizationStatusPageTest
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
        <HospitalizationStatusPageTest
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
        <HospitalizationStatusPageTest
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
        <HospitalizationStatusPageTest
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should accept optional props', () => {
      const { container } = render(
        <HospitalizationStatusPageTest
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
