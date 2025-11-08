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
          recipientAddress: {
            street: '1138 Temple Way',
            city: 'Coruscant City',
            state: 'DC',
            postalCode: '20001',
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

      expect(container.textContent).to.include('1138 Temple Way');
      expect(container.textContent).to.include('Coruscant City');
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
