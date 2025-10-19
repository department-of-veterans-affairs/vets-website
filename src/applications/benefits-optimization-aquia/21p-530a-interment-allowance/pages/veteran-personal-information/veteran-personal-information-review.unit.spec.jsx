/**
 * @module tests/pages/veteran-personal-information-review.unit.spec
 * @description Unit tests for VeteranPersonalInformationReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranPersonalInformationReviewPage } from './veteran-personal-information-review';

describe('VeteranPersonalInformationReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Personal information';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranPersonalInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <VeteranPersonalInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Personal information');
    });
  });

  describe('Data Display', () => {
    it('should display personal information', () => {
      const data = {
        veteranPersonalInformation: {
          fullName: {
            first: 'John',
            middle: 'M',
            last: 'Smith',
          },
          ssn: '123-45-6789',
          serviceNumber: 'ABC123456',
          vaFileNumber: '12345678',
        },
      };

      const { container } = render(
        <VeteranPersonalInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('John');
      expect(container.textContent).to.include('Smith');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranPersonalInformationReviewPage
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
        <VeteranPersonalInformationReviewPage
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
