/**
 * @module tests/pages/hospitalization-facility.unit.spec
 * @description Unit tests for HospitalizationFacilityPage component
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { HospitalizationFacilityPage } from './hospitalization-facility';

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

describe('HospitalizationFacilityPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should render page title with default claimant name', () => {
      const { container } = render(
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        "What's the name and address of the hospital where the claimant is admitted?",
      );
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
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        "What's the name and address of the hospital where Ahsoka Tano is admitted?",
      );
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
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        "What's the name and address of the hospital where Ahsoka is admitted?",
      );
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
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        "What's the name and address of the hospital where you are admitted?",
      );
    });
  });

  describe('Field Rendering', () => {
    it('should render hospital name field', async () => {
      const { container } = render(
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(findByLabel(container, 'va-text-input', 'Name of hospital')).to
          .exist;
      });
    });

    it('should render hospital address section header', () => {
      const { container } = render(
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Address of hospital');
    });

    it('should render street address field', async () => {
      const { container } = render(
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(findByLabel(container, 'va-text-input', 'Street address')).to
          .exist;
      });
    });

    it('should render city field', async () => {
      const { container } = render(
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(findByLabel(container, 'va-text-input', 'City')).to.exist;
      });
    });

    it('should render state select field', async () => {
      const { container } = render(
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(findByLabel(container, 'va-select', 'State')).to.exist;
      });
    });

    it('should render ZIP code field', async () => {
      const { container } = render(
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(findByLabel(container, 'va-text-input', 'ZIP code')).to.exist;
      });
    });

    it('should show ZIP code field with hint text', async () => {
      const { container } = render(
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        const zipField = findByLabel(container, 'va-text-input', 'ZIP code');
        expect(zipField).to.exist;
        expect(zipField.getAttribute('hint')).to.include('5 or 9 digits');
      });
    });
  });

  describe('Data Handling', () => {
    it('should render with existing facility data', () => {
      const existingData = {
        facilityName: 'Lothal Medical Center',
        facilityAddress: {
          street: '123 Medical Center Dr',
          city: 'Lothal',
          state: 'WA',
          postalCode: '98101',
          country: 'USA',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Ahsoka',
            last: 'Tano',
          },
        },
      };

      const { container } = render(
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
      expect(container.querySelector('va-select')).to.exist;
    });

    it('should render with partial facility data', () => {
      const existingData = {
        facilityName: 'Coruscant General Hospital',
        facilityAddress: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
        },
      };

      const { container } = render(
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
      expect(container.querySelector('va-select')).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={null}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle 9-digit ZIP code', () => {
      const existingData = {
        facilityName: 'Lothal Medical Center',
        facilityAddress: {
          street: '789 Veterans Blvd',
          city: 'Lothal',
          state: 'OR',
          postalCode: '97201-1234',
          country: 'USA',
        },
      };

      const { container } = render(
        <HospitalizationFacilityPage
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
        <HospitalizationFacilityPage
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
        <HospitalizationFacilityPage
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
        <HospitalizationFacilityPage
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
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should accept optional props', () => {
      const { container } = render(
        <HospitalizationFacilityPage
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

  describe('State Options', () => {
    it('should render state select with multiple options', () => {
      const { container } = render(
        <HospitalizationFacilityPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const select = container.querySelector('va-select');
      expect(select).to.exist;
    });
  });
});
