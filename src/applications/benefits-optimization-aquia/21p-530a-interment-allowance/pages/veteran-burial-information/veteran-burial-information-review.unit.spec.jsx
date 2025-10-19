/**
 * @module tests/pages/veteran-burial-information-review.unit.spec
 * @description Unit tests for VeteranBurialInformationReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranBurialInformationReviewPage } from './veteran-burial-information-review';

describe('VeteranBurialInformationReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Burial information';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranBurialInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <VeteranBurialInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Burial information');
    });
  });

  describe('Data Display', () => {
    it('should display burial information', () => {
      const data = {
        veteranBurialInformation: {
          dateOfDeath: '1984-05-04',
          dateOfBurial: '1984-05-05',
          cemeteryName: 'Endor Forest Sanctuary',
          cemeteryLocation: {
            city: 'Bright Tree Village',
            state: 'CA',
          },
        },
      };

      const { container } = render(
        <VeteranBurialInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Endor Forest Sanctuary');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranBurialInformationReviewPage
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
        <VeteranBurialInformationReviewPage
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
