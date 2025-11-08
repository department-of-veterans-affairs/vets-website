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
        },
      };

      const { container } = render(
        <VeteranIdentificationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Anakin');
      expect(container.textContent).to.include('Skywalker');
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
