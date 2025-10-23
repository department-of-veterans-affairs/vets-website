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
            street: '1234 Dune Sea Road',
            street2: 'Cantina District',
            city: 'Mos Eisley',
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

      expect(container.textContent).to.include('1234 Dune Sea Road');
      expect(container.textContent).to.include('Mos Eisley');
    });

    it('should display claimant address without addressLine2', () => {
      const data = {
        claimantAddress: {
          claimantAddress: {
            street: '5678 Spaceport Way',
            city: 'Mos Eisley',
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

      expect(container.textContent).to.include('5678 Spaceport Way');
      expect(container.textContent).to.include('Mos Eisley');
    });

    it('should display claimant address with minimal data', () => {
      const data = {
        claimantAddress: {
          claimantAddress: {
            street: '999 Capital Plaza',
            city: 'Coruscant',
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

      expect(container.textContent).to.include('999 Capital Plaza');
      expect(container.textContent).to.include('Coruscant');
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
