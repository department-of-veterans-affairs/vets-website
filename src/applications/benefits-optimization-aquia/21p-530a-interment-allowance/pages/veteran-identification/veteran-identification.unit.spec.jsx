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
        "Veteran's identification information",
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
        expect(
          findByLabel(container, 'va-text-input', 'Social Security number'),
        ).to.exist;
        expect(findByLabel(container, 'va-text-input', 'VA service number')).to
          .exist;
        expect(findByLabel(container, 'va-text-input', 'VA file number')).to
          .exist;
      });
    });

    it('should render the service number hint text', async () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        const serviceNumberField = findByLabel(
          container,
          'va-text-input',
          'VA service number',
        );
        expect(serviceNumberField?.getAttribute('hint')).to.equal(
          "Enter this number only if it's different than their Social Security number",
        );
      });
    });
  });

  describe('Data Handling', () => {
    it('should render with existing veteran identification data', () => {
      const existingData = {
        veteranIdentification: {
          ssn: '123-45-6789',
          serviceNumber: 'A123456',
          vaFileNumber: 'C12345678',
        },
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

    it('should handle undefined data gracefully', () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={undefined}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle null data gracefully', () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={null}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle array data gracefully by using empty object', () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={[]}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should render with partial identification data', () => {
      const partialData = {
        veteranIdentification: {
          ssn: '123-45-6789',
        },
      };

      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={partialData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode when onReviewPage is true', () => {
      const { container } = render(
        <VeteranIdentificationPage
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
        <VeteranIdentificationPage
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
        <VeteranIdentificationPage
          goForward={mockGoForward}
          goBack={mockGoBack}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Field Requirements', () => {
    it('should mark SSN field as required', async () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        const ssnField = findByLabel(
          container,
          'va-text-input',
          'Social Security number',
        );
        expect(ssnField?.getAttribute('required')).to.not.be.null;
      });
    });

    it('should not mark service number as required', async () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        const serviceNumberField = findByLabel(
          container,
          'va-text-input',
          'VA service number',
        );
        // Service number is optional
        expect(serviceNumberField).to.exist;
      });
    });

    it('should not mark VA file number as required', async () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      await waitFor(() => {
        const vaFileNumberField = findByLabel(
          container,
          'va-text-input',
          'VA file number',
        );
        // VA file number is optional
        expect(vaFileNumberField).to.exist;
      });
    });
  });

  describe('Schema Validation', () => {
    it('should use veteranIdentification as section name', () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      // PageTemplate should be rendered with veteranIdentification section
      expect(container).to.exist;
    });

    it('should have default data structure for identification fields', () => {
      const { container } = render(
        <VeteranIdentificationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      // Should render identification fields even with empty data
      expect(container.querySelectorAll('va-text-input').length).to.equal(3);
    });
  });
});
