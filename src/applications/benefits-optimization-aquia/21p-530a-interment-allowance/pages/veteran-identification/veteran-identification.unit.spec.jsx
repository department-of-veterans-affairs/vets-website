/**
 * @module tests/pages/veteran-identification.unit.spec
 * @description Unit tests for VeteranIdentificationPage component
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranIdentificationPage } from './veteran-identification';

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

describe('VeteranIdentificationPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include(
        "Deceased veteran's information",
      );
    });

    it('should render all identification fields', async () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(findByLabel(container, 'va-text-input', 'First name')).to.exist;
        expect(findByLabel(container, 'va-text-input', 'Middle name')).to.exist;
        expect(findByLabel(container, 'va-text-input', 'Last name')).to.exist;

        expect(
          findByLabel(
            container,
            'va-text-input',
            "Veteran's Social Security Number",
          ),
        ).to.exist;

        expect(
          findByLabel(container, 'va-text-input', "Veteran's VA file number"),
        ).to.exist;

        expect(
          findByLabel(
            container,
            'va-memorable-date',
            "Veteran's date of birth",
          ),
        ).to.exist;
        expect(
          findByLabel(
            container,
            'va-memorable-date',
            "Veteran's date of death",
          ),
        ).to.exist;
      });
    });

    it('should render place of birth fields', () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Place of birth');
      expect(findByLabel(container, 'va-text-input', 'City')).to.exist;
      expect(findByLabel(container, 'va-text-input', 'State')).to.exist;
    });

    it('should show instruction text', () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        'Please provide the following information about the deceased veteran',
      );
    });
  });

  describe('Data Handling', () => {
    it('should render with existing veteran data', () => {
      const existingData = {
        fullName: {
          first: 'Anakin',
          middle: '',
          last: 'Skywalker',
        },
        ssn: '501-66-7138',
        serviceNumber: 'JT87563',
        vaFileNumber: '22387563',
        dateOfBirth: '1941-05-04',
        placeOfBirth: {
          city: 'Mos Espa',
          state: 'AZ',
        },
        dateOfDeath: '1984-05-04',
      };

      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <VeteranIdentificationPage
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
        <VeteranIdentificationPage
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
        <VeteranIdentificationPage
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
});
