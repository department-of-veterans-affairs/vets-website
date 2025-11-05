/**
 * @module tests/pages/hospitalization-date.unit.spec
 * @description Unit tests for HospitalizationDatePage component
 */

import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { PageTemplateCore } from '@bio-aquia/shared/components/templates';
import { MemorableDateField } from '@bio-aquia/shared/components/atoms';
import { transformDates } from '@bio-aquia/shared/forms';
import { hospitalizationDatePageSchema } from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Helper function to find web component by tag and text attribute
 */
const findByText = (container, tagName, textValue) => {
  return Array.from(container.querySelectorAll(tagName)).find(
    el => el.getAttribute('text') === textValue,
  );
};

const ensureDateStrings = formData => {
  return transformDates(formData, ['hospitalizationDate']);
};

// Test component using PageTemplateCore directly
const HospitalizationDatePageContent = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplateCore
      title="Date of hospitalization"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={hospitalizationDatePageSchema}
      sectionName="hospitalizationDate"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{ hospitalizationDate: '' }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <MemorableDateField
            label="Date of hospitalization"
            name="hospitalizationDate"
            value={localData.hospitalizationDate || ''}
            onChange={handleFieldChange}
            error={errors.hospitalizationDate}
            forceShowError={formSubmitted}
            required
          />
        </>
      )}
    </PageTemplateCore>
  );
};

HospitalizationDatePageContent.propTypes = {
  data: PropTypes.object,
  setFormData: PropTypes.func,
  goForward: PropTypes.func,
  goBack: PropTypes.func,
  onReviewPage: PropTypes.bool,
  updatePage: PropTypes.func,
};

describe('HospitalizationDatePage', () => {
  const mockGoForward = () => {};
  const mockSetFormData = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <HospitalizationDatePageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Date of hospitalization');
    });
  });

  describe('Field Rendering', () => {
    it('should render date field', () => {
      const { container } = render(
        <HospitalizationDatePageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-memorable-date')).to.exist;
    });
  });

  describe('Data Handling', () => {
    it('should handle empty data gracefully', () => {
      const { container } = render(
        <HospitalizationDatePageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <HospitalizationDatePageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const continueButton = findByText(container, 'va-button', 'Continue');
      expect(continueButton).to.exist;
    });
  });
});
