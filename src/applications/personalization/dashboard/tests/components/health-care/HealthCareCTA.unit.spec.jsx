import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';
import * as recordEventModule from '~/platform/monitoring/record-event';

import HealthCareCTA from '../../../components/health-care/HealthCareCTA';

describe('<HealthCareCTA />', () => {
  // delete instances of Toggler when new appts URL is launched
  const initialState = {
    featureToggles: {
      [Toggler.TOGGLE_NAMES.myVaNotificationDotIndicator]: true,
      [Toggler.TOGGLE_NAMES.travelPaySubmitMileageExpense]: false,
    },
  };

  it("should render when user isn't a VA patient", () => {
    const tree = renderWithStoreAndRouter(<HealthCareCTA />, {
      initialState,
    });

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
          initialState,
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

    it('renders modified travel reimbursement link with Travel Pay SMOC feature flag', () => {
      const tree = renderWithStoreAndRouter(
        <HealthCareCTA isVAPatient noCerner />,
        {
          initialState: {
            featureToggles: {
              [Toggler.TOGGLE_NAMES.travelPaySubmitMileageExpense]: true,
            },
          },
        },
      );

      const travelReimbursementLink = tree.getByTestId(
        'request-travel-reimbursement-link-from-cta',
      );
      expect(travelReimbursementLink).to.exist;
      expect(travelReimbursementLink.getAttribute('href')).to.contain(
        '/my-health/travel-pay/claims',
      );
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

  context('user is LOA1', () => {
    it('should show apply for health care and hide other links', () => {
      const tree = renderWithStoreAndRouter(
        <HealthCareCTA isLOA1 isVAPatient />,
        { initialState },
      );

      tree.getByTestId('apply-va-healthcare-link-from-cta');
      expect(tree.queryByTestId('view-your-messages-link-from-cta')).to.be.null;
      expect(tree.queryByTestId('visit-mhv-on-va-gov')).to.be.null;
    });
  });

  context('hides schedule appointments link', () => {
    it('when user has upcoming appointment', () => {
      const tree = renderWithStoreAndRouter(
        <HealthCareCTA isVAPatient hasUpcomingAppointment />,
        { initialState },
      );

      expect(tree.queryByTestId('view-manage-appointments-link-from-cta')).to.be
        .null;
      tree.getByTestId('view-your-messages-link-from-cta');
    });

    it('when there is an appointments error', () => {
      const tree = renderWithStoreAndRouter(
        <HealthCareCTA isVAPatient hasAppointmentsError />,
        { initialState },
      );

      expect(tree.queryByTestId('view-manage-appointments-link-from-cta')).to.be
        .null;
    });
  });

  context('recordEvent on click', () => {
    let recordEventStub;

    beforeEach(() => {
      recordEventStub = sinon.stub(recordEventModule, 'default');
    });

    afterEach(() => {
      recordEventStub.restore();
    });

    it('fires recordEvent when Apply for VA health care is clicked', () => {
      const tree = renderWithStoreAndRouter(<HealthCareCTA />, {
        initialState,
      });

      fireEvent.click(tree.getByTestId('apply-va-healthcare-link-from-cta'));
      expect(recordEventStub.called).to.be.true;
    });

    it('fires recordEvent when Visit MHV link is clicked', () => {
      const tree = renderWithStoreAndRouter(<HealthCareCTA isVAPatient />, {
        initialState,
      });

      fireEvent.click(tree.getByTestId('visit-mhv-on-va-gov'));
      expect(recordEventStub.called).to.be.true;
    });

    it('fires recordEvent when inbox link is clicked', () => {
      const tree = renderWithStoreAndRouter(<HealthCareCTA isVAPatient />, {
        initialState,
      });

      fireEvent.click(tree.getByTestId('view-your-messages-link-from-cta'));
      expect(recordEventStub.called).to.be.true;
    });

    it('fires recordEvent when appointments link is clicked', () => {
      const tree = renderWithStoreAndRouter(<HealthCareCTA isVAPatient />, {
        initialState,
      });

      fireEvent.click(
        tree.getByTestId('view-manage-appointments-link-from-cta'),
      );
      expect(recordEventStub.called).to.be.true;
    });

    it('fires recordEvent when prescriptions link is clicked', () => {
      const tree = renderWithStoreAndRouter(<HealthCareCTA isVAPatient />, {
        initialState,
      });

      fireEvent.click(tree.getByTestId('refill-prescriptions-link-from-cta'));
      expect(recordEventStub.called).to.be.true;
    });

    it('fires recordEvent when travel reimbursement link is clicked', () => {
      const tree = renderWithStoreAndRouter(<HealthCareCTA isVAPatient />, {
        initialState,
      });

      fireEvent.click(
        tree.getByTestId('request-travel-reimbursement-link-from-cta'),
      );
      expect(recordEventStub.called).to.be.true;
    });

    it('fires recordEvent when medical records link is clicked', () => {
      const tree = renderWithStoreAndRouter(<HealthCareCTA isVAPatient />, {
        initialState,
      });

      fireEvent.click(tree.getByTestId('get-medical-records-link-from-cta'));
      expect(recordEventStub.called).to.be.true;
    });
  });
});
