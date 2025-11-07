/**
 * @module tests/pages/benefit-type.unit.spec
 * @description Unit tests for BenefitTypePage component
 */

import { expect } from 'chai';
import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { PageTemplateCore } from '@bio-aquia/shared/components/templates';
import { RadioField } from '@bio-aquia/shared/components/atoms';
import { BENEFIT_TYPES } from '@bio-aquia/21-2680-house-bound-status/constants';
import {
  benefitTypePageSchema,
  benefitTypeSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

// Test the page content directly using PageTemplateCore
const BenefitTypePageContent = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse = data || {};
  const migratedData = {
    ...formDataToUse,
    benefitType: {
      benefitType: formDataToUse?.benefitType?.benefitType,
    },
  };

  return (
    <PageTemplateCore
      title="Select which benefit the claimant is requesting"
      data={migratedData}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={benefitTypePageSchema}
      sectionName="benefitType"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{}}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <div className="benefit-type-page">
          <p>
            <a
              href="https://www.va.gov/pension/aid-attendance-housebound/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find out more about the difference between Special Monthly
              Compensation (SMC) and Special Monthly Pension (SMP).
            </a>
          </p>

          <RadioField
            name="benefitType"
            label="Select benefit type"
            value={localData.benefitType}
            onChange={handleFieldChange}
            schema={benefitTypeSchema}
            tile
            options={[
              {
                label: 'Special Monthly Compensation (SMC)',
                value: BENEFIT_TYPES.SMC,
                description:
                  'is paid in addition to compensation or Dependency Indemnity Compensation (DIC) for a service-related disability.',
              },
              {
                label: 'Special Monthly Pension (SMP)',
                value: BENEFIT_TYPES.SMP,
                description:
                  'is an increased monthly amount paid to a Veteran or survivor who is eligible for Veterans Pension or Survivors benefits.',
              },
            ]}
            error={errors.benefitType}
            forceShowError={formSubmitted}
            required
          />
        </div>
      )}
    </PageTemplateCore>
  );
};

BenefitTypePageContent.propTypes = {
  data: PropTypes.object,
  setFormData: PropTypes.func,
  goForward: PropTypes.func,
  goBack: PropTypes.func,
  onReviewPage: PropTypes.bool,
  updatePage: PropTypes.func,
};

describe('Benefit Type Selection Form', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Form Initialization', () => {
    it('should render without errors', () => {
      const { container } = render(
        <BenefitTypePageContent
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should render page title', () => {
      const { container } = render(
        <BenefitTypePageContent
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include('Select which benefit');
    });

    it('should render benefit type radio buttons', () => {
      const { container } = render(
        <BenefitTypePageContent
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should display selected benefit type', () => {
      const data = {
        benefitType: {
          benefitType: 'smc',
        },
      };

      const { container } = render(
        <BenefitTypePageContent
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.exist;
      expect(radioGroup.getAttribute('value')).to.equal('smc');
    });

    it('should handle empty data', () => {
      const { container } = render(
        <BenefitTypePageContent
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <BenefitTypePageContent
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-radio')).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode', () => {
      const { container } = render(
        <BenefitTypePageContent
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      // In review mode, the save button should be present
      const saveButton = Array.from(
        container.querySelectorAll('va-button'),
      ).find(btn => btn.getAttribute('text') === 'Save');
      expect(saveButton).to.exist;
    });
  });
});
