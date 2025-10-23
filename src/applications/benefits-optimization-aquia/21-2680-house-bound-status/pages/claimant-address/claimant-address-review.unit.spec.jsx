/**
 * @module tests/pages/claimant-address-review.unit.spec
 * @description Unit tests for ClaimantAddressReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ClaimantAddressReviewPage } from './claimant-address-review';

describe('ClaimantAddressReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Claimant address';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ClaimantAddressReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <ClaimantAddressReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Claimant address');
    });

    it('should render edit button', () => {
      const { container } = render(
        <ClaimantAddressReviewPage
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
    it('should display claimant address with complete data', () => {
      const data = {
        claimantAddress: {
          claimantAddress: {
            street: '1234 Main Street',
            street2: 'Suite 100',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90001',
          },
        },
      };

      const { container } = render(
        <ClaimantAddressReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('1234 Main Street');
      expect(container.textContent).to.include('Los Angeles');
    });

    it('should display claimant address without addressLine2', () => {
      const data = {
        claimantAddress: {
          claimantAddress: {
            street: '5678 Oak Avenue',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94102',
          },
        },
      };

      const { container } = render(
        <ClaimantAddressReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('5678 Oak Avenue');
      expect(container.textContent).to.include('San Francisco');
    });

    it('should display claimant address with minimal data', () => {
      const data = {
        claimantAddress: {
          claimantAddress: {
            street: '999 Elm Drive',
            city: 'Sacramento',
            state: 'CA',
            postalCode: '95814',
          },
        },
      };

      const { container } = render(
        <ClaimantAddressReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('999 Elm Drive');
      expect(container.textContent).to.include('Sacramento');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <ClaimantAddressReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing claimantAddress section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <ClaimantAddressReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty address object', () => {
      const data = {
        claimantAddress: {
          claimantAddress: {},
        },
      };

      const { container } = render(
        <ClaimantAddressReviewPage
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
        <ClaimantAddressReviewPage
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
