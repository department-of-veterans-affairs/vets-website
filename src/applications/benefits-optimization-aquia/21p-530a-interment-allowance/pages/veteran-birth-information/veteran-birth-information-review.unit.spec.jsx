/**
 * @module tests/pages/veteran-birth-information-review.unit.spec
 * @description Unit tests for VeteranBirthInformationReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranBirthInformationReviewPage } from './veteran-birth-information-review';

describe('VeteranBirthInformationReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Birth information';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranBirthInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <VeteranBirthInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Birth information');
    });
  });

  describe('Data Display', () => {
    it('should display birth information', () => {
      const data = {
        veteranBirthInformation: {
          dateOfBirth: '1941-05-04',
          placeOfBirth: {
            city: 'Mos Espa',
            state: 'AZ',
          },
        },
      };

      const { container } = render(
        <VeteranBirthInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Mos Espa');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranBirthInformationReviewPage
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
        <VeteranBirthInformationReviewPage
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
