/**
 * @module tests/pages/veteran-address.unit.spec
 * @description Unit tests for VeteranAddressPage component
 */

import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { PageTemplateCore } from '@bio-aquia/shared/components/templates';
import { AddressField } from '@bio-aquia/shared/components/molecules';
import {
  veteranAddressPageSchema,
  veteranAddressSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Helper function to find web component by tag and text attribute
 */
const findByText = (container, tagName, textValue) => {
  return Array.from(container.querySelectorAll(tagName)).find(
    el => el.getAttribute('text') === textValue,
  );
};

// Test component using PageTemplateCore directly
const VeteranAddressPageContent = ({
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
      title=""
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={veteranAddressPageSchema}
      sectionName="veteranAddress"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        veteranAddress: {
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
            name="veteranAddress"
            label="Veteran's current address"
            description="We'll send any important information about this claim to this address."
            value={localData.veteranAddress}
            onChange={handleFieldChange}
            schema={veteranAddressSchema}
            errors={
              formSubmitted && errors.veteranAddress
                ? errors.veteranAddress
                : {}
            }
            touched={
              formSubmitted
                ? { street: true, city: true, state: true, postalCode: true }
                : {}
            }
            required
          />
        </>
      )}
    </PageTemplateCore>
  );
};

VeteranAddressPageContent.propTypes = {
  data: PropTypes.object,
  setFormData: PropTypes.func,
  goForward: PropTypes.func,
  goBack: PropTypes.func,
  onReviewPage: PropTypes.bool,
  updatePage: PropTypes.func,
};

describe('VeteranAddressPage', () => {
  const mockGoForward = () => {};
  const mockSetFormData = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranAddressPageContent
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('current address');
    });
  });

  describe('Field Rendering', () => {
    it('should render address field component', () => {
      const { container } = render(
        <VeteranAddressPageContent
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
    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranAddressPageContent
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
        <VeteranAddressPageContent
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
