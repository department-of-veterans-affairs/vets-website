/**
 * @module tests/pages/claimant-relationship.unit.spec
 * @description Unit tests for ClaimantRelationshipPage component
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { ClaimantRelationshipPage } from './claimant-relationship';

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

describe('ClaimantRelationshipPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ClaimantRelationshipPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Who is the claim for?');
    });

    it('should render page title', () => {
      const { container } = render(
        <ClaimantRelationshipPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Who is the claim for?');
    });

    it('should render radio group with label', async () => {
      const { container } = render(
        <ClaimantRelationshipPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(findByLabel(container, 'va-radio', 'Who is the claim for?')).to
          .exist;
      });
    });
  });

  describe('Field Rendering', () => {
    it('should render all relationship options', () => {
      const { container } = render(
        <ClaimantRelationshipPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.exist;

      const radioOptions = container.querySelectorAll('va-radio-option');
      expect(radioOptions.length).to.equal(4);

      const values = Array.from(radioOptions).map(opt =>
        opt.getAttribute('value'),
      );
      expect(values).to.include('veteran');
      expect(values).to.include('spouse');
      expect(values).to.include('child');
      expect(values).to.include('parent');
    });
  });

  describe('Data Handling', () => {
    it('should render with existing relationship data', () => {
      const existingData = {
        claimantRelationship: 'veteran',
      };

      const { container } = render(
        <ClaimantRelationshipPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.exist;

      const radioOptions = container.querySelectorAll('va-radio-option');
      const veteranOption = Array.from(radioOptions).find(
        opt => opt.getAttribute('value') === 'veteran',
      );
      expect(veteranOption).to.exist;
      expect(veteranOption.hasAttribute('checked')).to.be.true;
    });

    it('should render with spouse relationship selected', () => {
      const existingData = {
        claimantRelationship: 'spouse',
      };

      const { container } = render(
        <ClaimantRelationshipPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.exist;

      const radioOptions = container.querySelectorAll('va-radio-option');
      const spouseOption = Array.from(radioOptions).find(
        opt => opt.getAttribute('value') === 'spouse',
      );
      expect(spouseOption).to.exist;
      expect(spouseOption.hasAttribute('checked')).to.be.true;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <ClaimantRelationshipPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-radio')).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <ClaimantRelationshipPage
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
        <ClaimantRelationshipPage
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
        <ClaimantRelationshipPage
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
        <ClaimantRelationshipPage
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
        <ClaimantRelationshipPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should accept optional props', () => {
      const { container } = render(
        <ClaimantRelationshipPage
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
