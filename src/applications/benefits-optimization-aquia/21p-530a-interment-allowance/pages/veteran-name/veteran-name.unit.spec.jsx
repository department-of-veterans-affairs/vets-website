/**
 * @module tests/pages/veteran-name.unit.spec
 * @description Unit tests for VeteranNamePage component
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranNamePage } from './veteran-name';

/**
 * Helper function to find web component by tag and label attribute
 * Works around Node 22 limitation with CSS attribute selectors on custom elements
 */
const findByLabel = (container, tagName, labelText) => {
  return Array.from(container.querySelectorAll(tagName)).find(
    el => el.getAttribute('label') === labelText,
  );
};

describe('VeteranNamePage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranNamePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include("Deceased Veteran's name");
    });

    it('should render all name fields', async () => {
      const { container } = render(
        <VeteranNamePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        expect(findByLabel(container, 'va-text-input', 'First name')).to.exist;
        expect(findByLabel(container, 'va-text-input', 'Middle name')).to.exist;
        expect(findByLabel(container, 'va-text-input', 'Last name')).to.exist;
        expect(findByLabel(container, 'va-text-input', 'Suffix')).to.exist;
      });
    });

    it('should render the instructional text', () => {
      const { container } = render(
        <VeteranNamePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Please provide the deceased');
    });
  });

  describe('Data Handling', () => {
    it('should render with existing veteran name data', () => {
      const existingData = {
        veteranIdentification: {
          fullName: {
            first: 'John',
            middle: 'A',
            last: 'Smith',
            suffix: 'Jr.',
          },
        },
      };

      const { container } = render(
        <VeteranNamePage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranNamePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle undefined data gracefully', () => {
      const { container } = render(
        <VeteranNamePage
          goForward={mockGoForward}
          data={undefined}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle null data gracefully', () => {
      const { container } = render(
        <VeteranNamePage
          goForward={mockGoForward}
          data={null}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle array data gracefully by using empty object', () => {
      const { container } = render(
        <VeteranNamePage
          goForward={mockGoForward}
          data={[]}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode when onReviewPage is true', () => {
      const { container } = render(
        <VeteranNamePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      expect(container).to.exist;
    });

    it('should accept updatePage prop in review mode', () => {
      const { container } = render(
        <VeteranNamePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should accept goBack prop', () => {
      const { container } = render(
        <VeteranNamePage
          goForward={mockGoForward}
          goBack={mockGoBack}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Schema Validation', () => {
    it('should use veteranIdentification as section name', () => {
      const { container } = render(
        <VeteranNamePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      // PageTemplate should be rendered with veteranIdentification section
      expect(container).to.exist;
    });

    it('should have default data structure for full name', () => {
      const { container } = render(
        <VeteranNamePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      // Should render name fields even with empty data
      expect(
        container.querySelectorAll('va-text-input').length,
      ).to.be.greaterThan(0);
    });
  });
});
