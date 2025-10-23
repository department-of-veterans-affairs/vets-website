/**
 * @module tests/pages/hospitalization-date.unit.spec
 * @description Unit tests for HospitalizationDatePage component
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { HospitalizationDatePage } from './hospitalization-date';

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

describe('HospitalizationDatePage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <HospitalizationDatePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should render page title with default claimant name', () => {
      const { container } = render(
        <HospitalizationDatePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        'When was the claimant admitted to the hospital?',
      );
    });

    it('should render page title with claimant first name', () => {
      const data = {
        claimantFullName: {
          first: 'Michael',
          last: 'Johnson',
        },
      };

      const { container } = render(
        <HospitalizationDatePage
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        'When was Michael admitted to the hospital?',
      );
    });
  });

  describe('Field Rendering', () => {
    it('should render admission date field', async () => {
      const { container } = render(
        <HospitalizationDatePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(findByLabel(container, 'va-memorable-date', 'Admission date')).to
          .exist;
      });
    });

    it('should render admission date field with label', () => {
      const { container } = render(
        <HospitalizationDatePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const dateField = container.querySelector('va-memorable-date');
      expect(dateField).to.exist;
      expect(dateField.getAttribute('label')).to.equal('Admission date');
    });
  });

  describe('Data Handling', () => {
    it('should render with existing admission date', () => {
      const existingData = {
        admissionDate: '2024-01-15',
        claimantFullName: {
          first: 'Sarah',
          last: 'Williams',
        },
      };

      const { container } = render(
        <HospitalizationDatePage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-memorable-date')).to.exist;
    });

    it('should handle date as string', () => {
      const existingData = {
        admissionDate: '2023-12-25',
      };

      const { container } = render(
        <HospitalizationDatePage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-memorable-date')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <HospitalizationDatePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-memorable-date')).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <HospitalizationDatePage
          goForward={mockGoForward}
          data={null}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-memorable-date')).to.exist;
    });

    it('should handle empty admission date string', () => {
      const existingData = {
        admissionDate: '',
      };

      const { container } = render(
        <HospitalizationDatePage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-memorable-date')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <HospitalizationDatePage
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
        <HospitalizationDatePage
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
        <HospitalizationDatePage
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
        <HospitalizationDatePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should accept optional props', () => {
      const { container } = render(
        <HospitalizationDatePage
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
