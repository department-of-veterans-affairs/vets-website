/**
 * @module tests/pages/mailing-address-review.unit.spec
 * @description Unit tests for MailingAddressReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MailingAddressReviewPage } from './mailing-address-review';

describe('MailingAddressReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Mailing address';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <MailingAddressReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <MailingAddressReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Mailing address');
    });
  });

  describe('Data Display', () => {
    it('should display mailing address', () => {
      const data = {
        mailingAddress: {
          address: {
            street: '123 Main St',
            city: 'Arlington',
            state: 'VA',
            postalCode: '22201',
          },
        },
      };

      const { container } = render(
        <MailingAddressReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('123 Main St');
      expect(container.textContent).to.include('Arlington');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <MailingAddressReviewPage
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
        <MailingAddressReviewPage
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
