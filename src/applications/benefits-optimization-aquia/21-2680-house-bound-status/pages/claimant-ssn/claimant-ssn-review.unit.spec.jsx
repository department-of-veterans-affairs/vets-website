/**
 * @module tests/pages/claimant-ssn-review.unit.spec
 * @description Unit tests for ClaimantSSNReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ClaimantSSNReviewPage } from './claimant-ssn-review';

describe('ClaimantSSNReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Claimant Social Security number';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ClaimantSSNReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <ClaimantSSNReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include(
        'Claimant Social Security number',
      );
    });

    it('should render edit button', () => {
      const { container } = render(
        <ClaimantSSNReviewPage
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
    it('should display claimant SSN', () => {
      const data = {
        claimantSSN: {
          claimantSSN: '123-45-6789',
        },
      };

      const { container } = render(
        <ClaimantSSNReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('123-45-6789');
    });

    it('should display claimant SSN with different format', () => {
      const data = {
        claimantSSN: {
          claimantSSN: '987-65-4321',
        },
      };

      const { container } = render(
        <ClaimantSSNReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('987-65-4321');
    });

    it('should display claimant SSN without hyphens', () => {
      const data = {
        claimantSSN: {
          claimantSSN: '111223333',
        },
      };

      const { container } = render(
        <ClaimantSSNReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('111223333');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <ClaimantSSNReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing claimantSSN section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <ClaimantSSNReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty claimantSSN object', () => {
      const data = {
        claimantSSN: {},
      };

      const { container } = render(
        <ClaimantSSNReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage prop correctly', () => {
      const customEditPage = () => {};
      const { container } = render(
        <ClaimantSSNReviewPage
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
