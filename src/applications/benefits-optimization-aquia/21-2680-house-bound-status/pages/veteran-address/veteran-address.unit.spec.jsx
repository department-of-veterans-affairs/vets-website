/**
 * @module tests/pages/veteran-address.unit.spec
 * @description Unit tests for VeteranAddressPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranAddressPage } from './veteran-address';

/**
 * Helper function to find web component by tag and text attribute
 * Works around Node 22 limitation with CSS attribute selectors on custom elements
 */
const findByText = (container, tagName, textValue) => {
  return Array.from(container.querySelectorAll(tagName)).find(
    el => el.getAttribute('text') === textValue,
  );
};

describe('VeteranAddressPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranAddressPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Veteran address');
    });

    it('should render page title', () => {
      const { container } = render(
        <VeteranAddressPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Veteran address');
    });

    it('should render description text', () => {
      const { container } = render(
        <VeteranAddressPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include("Veteran's mailing address");
      expect(container.textContent).to.include(
        "Enter the Veteran's mailing address",
      );
    });
  });

  describe('Field Rendering', () => {
    it('should render address field component', () => {
      const { container } = render(
        <VeteranAddressPage
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
        veteranAddress: {
          street: '123 Moisture Farm Lane',
          street2: 'Sector 4',
          street3: '',
          city: 'Anchorhead',
          state: 'IL',
          country: 'USA',
          postalCode: '62701',
          isMilitary: false,
        },
      };

      const { container } = render(
        <VeteranAddressPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranAddressPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <VeteranAddressPage
          goForward={mockGoForward}
          data={null}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <VeteranAddressPage
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
        <VeteranAddressPage
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
        <VeteranAddressPage
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
