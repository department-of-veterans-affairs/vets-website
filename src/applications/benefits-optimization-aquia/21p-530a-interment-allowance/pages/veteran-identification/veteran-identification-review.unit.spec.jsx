/**
 * @module tests/pages/veteran-identification-review.unit.spec
 * @description Unit tests for VeteranIdentificationReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranIdentificationReviewPage } from './veteran-identification-review';

describe('VeteranIdentificationReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = "Deceased veteran's information";

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranIdentificationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <VeteranIdentificationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include(
        "Deceased veteran's information",
      );
    });
  });

  describe('Data Display', () => {
    it('should display veteran identification data', () => {
      const data = {
        veteranIdentification: {
          fullName: {
            first: 'John',
            middle: 'M',
            last: 'Smith',
          },
          ssn: '123-45-6789',
          serviceNumber: 'ABC123456',
          vaFileNumber: '12345678',
          dateOfBirth: '1950-05-15',
          placeOfBirth: {
            city: 'Arlington',
            state: 'VA',
          },
          dateOfDeath: '2023-01-15',
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('John');
      expect(container.textContent).to.include('Smith');
      expect(container.textContent).to.include('Arlington, VA');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranIdentificationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Edit Functionality', () => {
    it('should render edit button', () => {
      const { container } = render(
        <VeteranIdentificationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });
});
