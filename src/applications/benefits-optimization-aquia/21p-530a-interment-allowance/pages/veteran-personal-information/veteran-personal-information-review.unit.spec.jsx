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
            first: 'Anakin',
            middle: '',
            last: 'Skywalker',
          },
          ssn: '501-66-7138',
          serviceNumber: 'JT87563',
          vaFileNumber: '22387563',
        },
      };

      const { container } = render(
        <VeteranPersonalInformationReviewPage
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
