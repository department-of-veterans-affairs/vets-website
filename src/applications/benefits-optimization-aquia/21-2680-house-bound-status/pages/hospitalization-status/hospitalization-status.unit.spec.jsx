/**
 * @module tests/pages/hospitalization-status.unit.spec
 * @description Unit tests for HospitalizationStatusPage component
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { HospitalizationStatusPage } from './hospitalization-status';

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

describe('HospitalizationStatusPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <HospitalizationStatusPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should render page title with default claimant name', () => {
      const { container } = render(
        <HospitalizationStatusPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Is the claimant hospitalized?');
    });

    it('should render page title with claimant first name', () => {
      const data = {
        claimantFullName: {
          first: 'John',
          last: 'Smith',
        },
      };

      const { container } = render(
        <HospitalizationStatusPage
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Is John hospitalized?');
    });
  });

  describe('Field Rendering', () => {
    it('should render radio group for hospitalization status', async () => {
      const { container } = render(
        <HospitalizationStatusPage
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
        <HospitalizationStatusPage
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
        claimantFullName: {
          first: 'Jane',
          last: 'Doe',
        },
      };

      const { container } = render(
        <HospitalizationStatusPage
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(findByLabel(container, 'va-radio', 'Is Jane hospitalized?')).to
          .exist;
      });
    });
  });

  describe('Data Handling', () => {
    it('should render with hospitalized status yes', () => {
      const existingData = {
        isCurrentlyHospitalized: 'yes',
        claimantFullName: {
          first: 'Bob',
        },
      };

      const { container } = render(
        <HospitalizationStatusPage
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
        isCurrentlyHospitalized: 'no',
        claimantFullName: {
          first: 'Alice',
        },
      };

      const { container } = render(
        <HospitalizationStatusPage
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
        <HospitalizationStatusPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-radio')).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <HospitalizationStatusPage
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
        <HospitalizationStatusPage
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
        <HospitalizationStatusPage
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
        <HospitalizationStatusPage
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
        <HospitalizationStatusPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should accept optional props', () => {
      const { container } = render(
        <HospitalizationStatusPage
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
