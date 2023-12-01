import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';

import HealthCareCTA from '../../../components/health-care/HealthCareCTA';

describe('<HealthCareCTA />', () => {
  // delete instances of Toggler when new appts URL is launched
  const initialState = {
    featureToggles: {
      [Toggler.TOGGLE_NAMES.myVaNotificationDotIndicator]: true,
    },
  };

  it("should render when user isn't a VA patient", () => {
    const tree = renderWithStoreAndRouter(<HealthCareCTA />, {
      initialState,
    });

    tree.getByText('Popular actions for Health Care');
    tree.getByTestId('apply-va-healthcare-link-from-cta');
  });

  context('user is a VA patient', () => {
    it('should render', () => {
      const tree = renderWithStoreAndRouter(<HealthCareCTA isVAPatient />, {
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

    it('should render a CTA link to MHV on VA.gov', () => {
      const tree = renderWithStoreAndRouter(
        <HealthCareCTA isVAPatient noCerner />,
        {
          initialState: {
            featureToggles: {
              [Toggler.TOGGLE_NAMES.myVaEnableMhvLink]: true,
            },
          },
        },
      );

      tree.getByTestId('visit-mhv-on-va-gov');
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

    context('renders "Go to your inbox" CTA', () => {
      it('when the unread message count is 0', () => {
        const tree = renderWithStoreAndRouter(
          <HealthCareCTA isVAPatient unreadMessagesCount={0} />,
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

      it('when user has unread messages', () => {
        const tree = renderWithStoreAndRouter(
          <HealthCareCTA isVAPatient unreadMessagesCount={3} />,
          { initialState },
        );

        expect(
          tree.getByLabelText('You have unread messages. Go to your inbox.', {
            selector: 'a',
          }),
        ).to.exist;
      });

      it('when there is an inbox error', () => {
        const tree = renderWithStoreAndRouter(
          <HealthCareCTA isVAPatient hasInboxError />,
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
          <HealthCareCTA isVAPatient hasInboxError unreadMessagesCount={0} />,
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
