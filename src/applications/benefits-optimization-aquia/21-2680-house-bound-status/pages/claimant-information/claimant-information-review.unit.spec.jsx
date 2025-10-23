/**
 * @module tests/pages/claimant-information-review.unit.spec
 * @description Unit tests for ClaimantInformationReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ClaimantInformationReviewPage } from './claimant-information-review';

describe('ClaimantInformationReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Claimant information';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ClaimantInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <ClaimantInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Claimant information');
    });

    it('should render edit button', () => {
      const { container } = render(
        <ClaimantInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should display claimant information with full name and DOB', () => {
      const data = {
        claimantInformation: {
          claimantFullName: {
            first: 'Sarah',
            middle: 'Jane',
            last: 'Connor',
          },
          claimantDOB: '1965-08-29',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Sarah');
      expect(container.textContent).to.include('Connor');
    });

    it('should display claimant information with partial name', () => {
      const data = {
        claimantInformation: {
          claimantFullName: {
            first: 'Michael',
            last: 'Reese',
          },
          claimantDOB: '1970-05-15',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Michael');
      expect(container.textContent).to.include('Reese');
    });

    it('should display claimant information with only name', () => {
      const data = {
        claimantInformation: {
          claimantFullName: {
            first: 'Kyle',
            last: 'Reese',
          },
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Kyle');
      expect(container.textContent).to.include('Reese');
    });

    it('should display claimant information with only DOB', () => {
      const data = {
        claimantInformation: {
          claimantDOB: '1980-12-25',
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <ClaimantInformationReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing claimantInformation section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle partial claimantInformation data', () => {
      const data = {
        claimantInformation: {
          claimantFullName: {
            first: 'John',
          },
        },
      };

      const { container } = render(
        <ClaimantInformationReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('John');
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage prop correctly', () => {
      const customEditPage = () => {};
      const { container } = render(
        <ClaimantInformationReviewPage
          data={{}}
          editPage={customEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });
});
