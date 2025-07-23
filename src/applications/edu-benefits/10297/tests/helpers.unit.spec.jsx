import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import {
  ConfirmationGoBackLink,
  ConfirmationPrintThisPage,
  ConfirmationSubmissionAlert,
  ConfirmationWhatsNextProcessList,
  trainingProviderArrayOptions,
  getCardDescription,
} from '../helpers';

describe('10297 Helpers', () => {
  describe('<ConfirmationSubmissionAlert />', () => {
    it('should render the submission alert inner message', () => {
      const { container } = render(<ConfirmationSubmissionAlert />);

      expect(container.querySelector('p').innerHTML).to.contain(
        'We’ve received your application. We’ll review it and email you a decision soon.',
      );
    });
  });

  describe('<ConfirmationPrintThisPage />', () => {
    it('should handle rendering summary box when no details are provided', () => {
      const data = { fullName: {} };
      const submission = {};
      const { getByTestId } = render(
        <ConfirmationPrintThisPage data={data} submission={submission} />,
      );

      expect(getByTestId('full-name').innerHTML).to.contain('---');
      expect(getByTestId('data-submitted').innerHTML).to.contain('---');
    });

    it('should render summary box with provided details', () => {
      const data = {
        fullName: {
          first: 'John',
          middle: 'Test',
          last: 'Doe',
        },
      };
      const submitDate = new Date('07/11/2025');
      const { getByTestId } = render(
        <ConfirmationPrintThisPage data={data} submitDate={submitDate} />,
      );

      expect(getByTestId('full-name').innerHTML).to.contain('John Test Doe');
      expect(getByTestId('data-submitted').innerHTML).to.contain(
        'Jul 11, 2025',
      );
    });
  });

  describe('<ConfirmationWhatsNextProcessList />', () => {
    it('shows process list section', () => {
      const { container } = render(<ConfirmationWhatsNextProcessList />);

      expect(container.querySelector('va-process-list')).to.exist;
      expect(
        container.querySelectorAll('va-process-list-item').length,
      ).to.equal(3);
    });
  });

  describe('<ConfirmationGoBackLink />', () => {
    it('should render an action link to go back to the VA.gov homepage', () => {
      const { container } = render(<ConfirmationGoBackLink />);

      expect(container.querySelector('va-link-action')).to.have.attribute(
        'text',
        'Go back to VA.gov',
      );
    });
  });

  describe('trainingProvierArrayOptions', () => {
    it('should return correct isItemComplete', () => {
      const item = {
        name: 'Training Provider Example',
        address: {
          country: 'USA',
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          postalCode: '12345',
        },
      };
      const emptyItem = {};
      expect(trainingProviderArrayOptions.isItemIncomplete(item)).to.equal(
        false,
      );
      expect(trainingProviderArrayOptions.isItemIncomplete(emptyItem)).to.equal(
        true,
      );
    });

    it('should return correct card title using getItemName', () => {
      const item = {
        name: 'Training Provider Example',
      };
      const emptyItem = {};
      expect(trainingProviderArrayOptions.text.getItemName(item)).to.equal(
        'Training Provider Example',
      );
      expect(trainingProviderArrayOptions.text.getItemName(emptyItem)).to.equal(
        'null',
      );
    });

    it('should have text fields set for custom messages', () => {
      expect(trainingProviderArrayOptions.text.cancelAddYes).to.equal(
        'Yes, cancel',
      );
      expect(trainingProviderArrayOptions.text.cancelAddNo).to.equal(
        'No, continue adding information',
      );
      expect(trainingProviderArrayOptions.text.summaryTitle).to.equal(
        'Review your training provider information',
      );
      expect(trainingProviderArrayOptions.text.cancelAddButtonText).to.equal(
        "Cancel adding this training provider's information",
      );
    });
  });
  describe('getCardDescription', () => {
    it('should return a full description of details from the given card details', () => {
      const card = {
        address: {
          country: 'USA',
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          postalCode: '12345',
        },
      };

      const description = getCardDescription(card);
      const { getByTestId } = render(description);

      expect(getByTestId('card-street').innerHTML).to.include('123 Main St');
      expect(getByTestId('card-address').innerHTML).to.include(
        'Anytown, CA 12345',
      );
    });
  });
});
