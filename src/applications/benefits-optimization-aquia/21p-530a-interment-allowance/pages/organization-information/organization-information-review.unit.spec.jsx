/**
 * @module tests/pages/organization-information-review.unit.spec
 * @description Unit tests for OrganizationInformationReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { OrganizationInformationReviewPage } from './organization-information-review';

describe('OrganizationInformationReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Organization information';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <OrganizationInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <OrganizationInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Organization information');
    });
  });

  describe('Data Display', () => {
    it('should display organization information', () => {
      const data = {
        organizationInformation: {
          organizationName: 'State Cemetery of Virginia',
          representativeName: 'John Doe',
          representativeTitle: 'Director',
          phoneNumber: '5551234567',
          emailAddress: 'john@example.com',
        },
      };

      const { container } = render(
        <OrganizationInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('State Cemetery of Virginia');
      expect(container.textContent).to.include('John Doe');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <OrganizationInformationReviewPage
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
        <OrganizationInformationReviewPage
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
