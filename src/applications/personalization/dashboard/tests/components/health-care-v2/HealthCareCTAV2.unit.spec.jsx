import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import HealthCareCTAV2 from '../../../components/health-care-v2/HealthCareCTAV2';

describe('<HealthCareCTAV2 />', () => {
  it("should render when user isn't a VA patient", () => {
    const tree = render(<HealthCareCTAV2 />);

    tree.getByText('Popular actions for Health Care');
    tree.getByTestId('apply-va-healthcare-link-from-cta');
  });

  context('user is a VA patient', () => {
    it('should render', () => {
      const tree = render(<HealthCareCTAV2 isVAPatient />);

      expect(tree.queryByText('Apply for VA health care')).to.be.null;
      expect(tree.queryByTestId('apply-va-healthcare-link-from-cta')).to.be
        .null;
      tree.queryByTestId('view-your-messages-link-from-cta');
      tree.getByTestId('view-manage-appointments-link-from-cta');
      tree.getByTestId('refill-prescriptions-link-from-cta');
      tree.getByTestId('request-travel-reimbursement-link-from-cta');
      tree.getByTestId('get-medical-records-link-from-cta');
    });

    context('renders the send a secure message to your health team CTA', () => {
      it('when the unread message count is 0', () => {
        const tree = render(
          <HealthCareCTAV2 isVAPatient unreadMessagesCount={0} />,
        );

        tree.getByTestId('view-your-messages-link-from-cta');
      });

      it('when there is an inbox error', () => {
        const tree = render(<HealthCareCTAV2 isVAPatient hasInboxError />);

        tree.getByTestId('view-your-messages-link-from-cta');
      });

      it('when there is an inbox error and the unread message count is 0', () => {
        const tree = render(
          <HealthCareCTAV2 isVAPatient hasInboxError unreadMessagesCount={0} />,
        );

        tree.getByTestId('view-your-messages-link-from-cta');
      });
    });
  });
});
