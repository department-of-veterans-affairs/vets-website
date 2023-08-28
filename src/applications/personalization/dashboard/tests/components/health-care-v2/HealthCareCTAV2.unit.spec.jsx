import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';

import HealthCareCTAV2 from '../../../components/health-care-v2/HealthCareCTAV2';

describe('<HealthCareCTAV2 />', () => {
  // delete instances of Toggler when new appts URL is launched
  const initialState = {
    featureToggles: {
      [Toggler.TOGGLE_NAMES.vaOnlineSchedulingBreadcrumbUrlUpdate]: true,
    },
  };

  it("should render when user isn't a VA patient", () => {
    const tree = renderWithStoreAndRouter(<HealthCareCTAV2 />, {
      initialState,
    });

    tree.getByText('Popular actions for Health Care');
    tree.getByTestId('apply-va-healthcare-link-from-cta');
  });

  context('user is a VA patient', () => {
    it('should render', () => {
      const tree = renderWithStoreAndRouter(<HealthCareCTAV2 isVAPatient />, {
        initialState,
      });

      expect(tree.queryByText('Apply for VA health care')).to.be.null;
      expect(tree.queryByTestId('apply-va-healthcare-link-from-cta')).to.be
        .null;
      tree.getByTestId('view-your-messages-link-from-cta');
      tree.getByTestId('view-manage-appointments-link-from-cta');
      expect(
        tree.getByRole('link', {
          name: /schedule and manage your appointments/i,
          value: {
            text: '/my-health/appointments',
          },
        }),
      ).to.exist;
      tree.getByTestId('refill-prescriptions-link-from-cta');
      tree.getByTestId('request-travel-reimbursement-link-from-cta');
      tree.getByTestId('get-medical-records-link-from-cta');
    });

    context('renders the send a secure message to your health team CTA', () => {
      it('when the unread message count is 0', () => {
        const tree = renderWithStoreAndRouter(
          <HealthCareCTAV2 isVAPatient unreadMessagesCount={0} />,
          { initialState },
        );

        tree.getByTestId('view-your-messages-link-from-cta');
        expect(
          tree.getByRole('link', {
            name: /schedule and manage your appointments/i,
            value: {
              text: '/my-health/appointments',
            },
          }),
        ).to.exist;
      });

      it('when there is an inbox error', () => {
        const tree = renderWithStoreAndRouter(
          <HealthCareCTAV2 isVAPatient hasInboxError />,
          { initialState },
        );

        tree.getByTestId('view-your-messages-link-from-cta');
        expect(
          tree.getByRole('link', {
            name: /schedule and manage your appointments/i,
            value: {
              text: '/my-health/appointments',
            },
          }),
        ).to.exist;
      });

      it('when there is an inbox error and the unread message count is 0', () => {
        const tree = renderWithStoreAndRouter(
          <HealthCareCTAV2 isVAPatient hasInboxError unreadMessagesCount={0} />,
          { initialState },
        );

        tree.getByTestId('view-your-messages-link-from-cta');
        expect(
          tree.getByRole('link', {
            name: /schedule and manage your appointments/i,
            value: {
              text: '/my-health/appointments',
            },
          }),
        ).to.exist;
      });
    });
  });
});
