import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import {
  ConfirmationGoBackLink,
  ConfirmationPrintThisPage,
  ConfirmationSubmissionAlert,
  ConfirmationWhatsNextProcessList,
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
});
