/**
 * @module tests/pages/veteran-address-review.unit.spec
 * @description Unit tests for VeteranAddressReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranAddressReviewPage } from './veteran-address-review';

describe('VeteranAddressReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Veteran address';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranAddressReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <VeteranAddressReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Veteran address');
    });

    it('should render edit button', () => {
      const { container } = render(
        <VeteranAddressReviewPage
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
    it('should display veteran address with complete data', () => {
      const data = {
        veteranAddress: {
          veteranAddress: {
            street: '123 Main St',
            street2: 'Apt 4B',
            city: 'Springfield',
            state: 'IL',
            postalCode: '62701',
          },
        },
      };

      const { container } = render(
        <VeteranAddressReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('123 Main St');
      expect(container.textContent).to.include('Springfield');
    });

    it('should display veteran address without addressLine2', () => {
      const data = {
        veteranAddress: {
          veteranAddress: {
            street: '456 Oak Ave',
            city: 'Chicago',
            state: 'IL',
            postalCode: '60601',
          },
        },
      };

      const { container } = render(
        <VeteranAddressReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('456 Oak Ave');
      expect(container.textContent).to.include('Chicago');
    });

    it('should display veteran address with minimal data', () => {
      const data = {
        veteranAddress: {
          veteranAddress: {
            street: '789 Elm St',
            city: 'Peoria',
            state: 'IL',
            postalCode: '61602',
          },
        },
      };

      const { container } = render(
        <VeteranAddressReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('789 Elm St');
      expect(container.textContent).to.include('Peoria');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <VeteranAddressReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing veteranAddress section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <VeteranAddressReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty address object', () => {
      const data = {
        veteranAddress: {
          veteranAddress: {},
        },
      };

      const { container } = render(
        <VeteranAddressReviewPage
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
        <VeteranAddressReviewPage
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
