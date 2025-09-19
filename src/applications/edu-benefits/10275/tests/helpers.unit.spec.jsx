import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import {
  ConfirmationGoBackLink,
  ConfirmationPrintThisPage,
  ConfirmationSubmissionAlert,
  ConfirmationWhatsNextProcessList,
} from '../helpers';

describe('10275 Helpers', () => {
  describe('<ConfirmationSubmissionAlert />', () => {
    it('shows process list section', () => {
      const { getByText } = render(<ConfirmationSubmissionAlert />);

      expect(getByText(/If we have any further questions/)).to.exist;
    });
  });

  describe('<ConfirmationPrintThisPage />', () => {
    it('should handle rendering summary box when no details are provided', () => {
      const data = { authorizedOfficial: {} };
      const submission = {};
      const { getByTestId } = render(
        <ConfirmationPrintThisPage data={data} submission={submission} />,
      );

      expect(getByTestId('full-name').innerHTML).to.contain('---');
      expect(getByTestId('data-submitted').innerHTML).to.contain('---');
    });

    it('should render summary box with provided details', () => {
      const data = {
        authorizedOfficial: {
          fullName: {
            first: 'John',
            middle: 'Test',
            last: 'Doe',
          },
        },
      };
      const submitDate = new Date('09/18/2025');
      const { getByTestId } = render(
        <ConfirmationPrintThisPage data={data} submitDate={submitDate} />,
      );

      expect(getByTestId('full-name').innerHTML).to.contain('John Test Doe');
      expect(getByTestId('data-submitted').innerHTML).to.contain(
        'Sep 18, 2025',
      );
    });
  });

  describe('<ConfirmationWhatsNextProcessList />', () => {
    it('shows process list section', () => {
      const { getByText } = render(<ConfirmationWhatsNextProcessList />);

      expect(getByText(/What to expect next/)).to.exist;
      expect(getByText(/Your form will be evaluated/)).to.exist;
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
