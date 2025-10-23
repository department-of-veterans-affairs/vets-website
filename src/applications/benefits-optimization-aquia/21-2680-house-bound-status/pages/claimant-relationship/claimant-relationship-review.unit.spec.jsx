/**
 * @module tests/pages/claimant-relationship-review.unit.spec
 * @description Unit tests for ClaimantRelationshipReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ClaimantRelationshipReviewPage } from './claimant-relationship-review';

describe('ClaimantRelationshipReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Claimant relationship';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ClaimantRelationshipReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <ClaimantRelationshipReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Claimant relationship');
    });

    it('should render edit button', () => {
      const { container } = render(
        <ClaimantRelationshipReviewPage
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
    it('should display veteran relationship with full label', () => {
      const data = {
        claimantRelationship: {
          claimantRelationship: 'veteran',
        },
      };

      const { container } = render(
        <ClaimantRelationshipReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Myself (I am the Veteran)');
    });

    it('should display spouse relationship with full label', () => {
      const data = {
        claimantRelationship: {
          claimantRelationship: 'spouse',
        },
      };

      const { container } = render(
        <ClaimantRelationshipReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Spouse');
    });

    it('should display child relationship with full label', () => {
      const data = {
        claimantRelationship: {
          claimantRelationship: 'child',
        },
      };

      const { container } = render(
        <ClaimantRelationshipReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Child');
    });

    it('should display parent relationship with full label', () => {
      const data = {
        claimantRelationship: {
          claimantRelationship: 'parent',
        },
      };

      const { container } = render(
        <ClaimantRelationshipReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Parent');
    });

    it('should display other relationship with full label', () => {
      const data = {
        claimantRelationship: {
          claimantRelationship: 'other',
        },
      };

      const { container } = render(
        <ClaimantRelationshipReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Other');
    });

    it('should display raw value when label not found', () => {
      const data = {
        claimantRelationship: {
          claimantRelationship: 'unknown',
        },
      };

      const { container } = render(
        <ClaimantRelationshipReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('unknown');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <ClaimantRelationshipReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing claimantRelationship section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <ClaimantRelationshipReviewPage
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
        <ClaimantRelationshipReviewPage
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
