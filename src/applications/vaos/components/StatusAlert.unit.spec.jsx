import { fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { addBusinessDays, format } from 'date-fns';
import React from 'react';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import { MockAppointment } from '../tests/fixtures/MockAppointment';
import { Facility } from '../tests/mocks/unit-test-helpers';
import StatusAlert from './StatusAlert';

const facilityData = new Facility();

describe('VAOS Component: StatusAlert', () => {
  const initialState = {};
  it('Should display confirmation of VA appointment alert message', () => {
    const mockAppointment = new MockAppointment();
    mockAppointment.setKind('clinic');
    mockAppointment.setStatus('booked');

    const screen = renderWithStoreAndRouter(
      <StatusAlert appointment={mockAppointment} facility={facilityData} />,
      {
        initialState,
        path: `/${mockAppointment.id}?confirmMsg=true`,
      },
    );
    expect(screen.baseElement).to.contain('.usa-alert-success');
    expect(screen.baseElement).to.contain.text(
      'We’ve scheduled and confirmed your appointment',
    );

    expect(screen.queryByTestId('review-appointments-link')).to.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;
    // record GA when review appointments link is clicked
    fireEvent.click(screen.queryByTestId('review-appointments-link'));
    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-view-your-appointments-button-clicked',
    });
  });
  it('Should display creation date on VA request alert', () => {
    const today = new Date();
    const mockAppointment = new MockAppointment();
    mockAppointment.setKind('cc');
    mockAppointment.setStatus('proposed');
    mockAppointment.setCreated(today);
    const createdDate = format(new Date(today), 'MMMM dd, yyyy');
    const screen = renderWithStoreAndRouter(
      <StatusAlert appointment={mockAppointment} facility={facilityData} />,
      {
        initialState,
        path: `/${mockAppointment.id}`,
      },
    );
    expect(screen.baseElement).to.contain('.usa-alert-info');
    expect(screen.baseElement).to.contain.text(
      'We’ll try to schedule your appointment in the next 2',
    );
    expect(screen.baseElement).to.contain.text(
      'You requested this appointment on ',
      createdDate,
    ).to.exist;
  });
  it('Should display VA request alert message for over due pending', () => {
    const today = new Date();
    const PAST_DUE = -Math.abs(4);
    // created date is 4 business days ago from today
    const createdDate = addBusinessDays(new Date(today), PAST_DUE);
    const mockAppointment = new MockAppointment();
    mockAppointment.setKind('clinic');
    mockAppointment.setStatus('proposed');
    mockAppointment.setCreated(createdDate);
    const screen = renderWithStoreAndRouter(
      <StatusAlert appointment={mockAppointment} facility={facilityData} />,
      {
        initialState,
        path: `/${mockAppointment.id}`,
      },
    );
    expect(screen.baseElement).to.contain.text(
      'Call your facility to finish scheduling',
    );
    expect(
      screen.container.querySelector('va-telephone[contact="509-434-7000"'),
    ).to.be.ok;
  });

  it('Should record google analytics when schedule link is clicked ', () => {
    const mockAppointment = new MockAppointment();
    mockAppointment.setKind('clinic');
    mockAppointment.setStatus('booked');

    const screen = renderWithStoreAndRouter(
      <StatusAlert appointment={mockAppointment} facility={facilityData} />,
      {
        initialState,
        path: `/${mockAppointment.id}?confirmMsg=true`,
      },
    );
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;
    fireEvent.click(screen.queryByTestId('schedule-appointment-link'));
    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-schedule-appointment-button-clicked',
    });
  });

  describe('Cancellation alert', () => {
    it('Should display for canceled VA appointments', () => {
      const mockAppointment = new MockAppointment();
      mockAppointment.setStatus('cancelled');
      mockAppointment.setCancelationReason('pat');

      const screen = renderWithStoreAndRouter(
        <StatusAlert appointment={mockAppointment} facility={facilityData} />,
        {
          initialState,
          path: `/${mockAppointment.id}`,
        },
      );
      expect(screen.baseElement).to.contain('.usa-alert-error');
      expect(screen.baseElement).to.contain.text(
        'You canceled this appointment',
      );
      expect(screen.baseElement).to.contain.text(
        'If you still want this appointment, call your VA health facility to schedule.',
      );

      expect(screen.queryByTestId('review-appointments-link')).to.not.exist;
      expect(screen.queryByTestId('schedule-appointment-link')).to.not.exist;
    });

    it('Should display schedule link for canceled VA appointments when showScheduleLink=true', () => {
      const mockAppointment = new MockAppointment();
      mockAppointment.setStatus('cancelled');
      mockAppointment.setCancelationReason('pat');
      mockAppointment.setShowScheduleLink(true);

      const screen = renderWithStoreAndRouter(
        <StatusAlert appointment={mockAppointment} facility={facilityData} />,
        {
          initialState,
          path: `/${mockAppointment.id}`,
        },
      );
      expect(screen.baseElement).to.contain('.usa-alert-error');
      expect(screen.baseElement).to.contain.text(
        'You canceled this appointment',
      );
      expect(screen.baseElement).to.contain.text(
        'If you still want this appointment, call your VA health facility to schedule.',
      );
      expect(
        screen.container.querySelector(
          'va-link[text="Schedule a new appointment"]',
        ),
      ).to.be.ok;

      expect(screen.queryByTestId('review-appointments-link')).to.not.exist;
      expect(screen.queryByTestId('schedule-appointment-link')).to.exist;
    });

    it('Should display for canceled CC appointments with referral link', () => {
      const mockAppointment = new MockAppointment();
      mockAppointment.setType('COMMUNITY_CARE_APPOINTMENT');
      mockAppointment.setStatus('cancelled');
      mockAppointment.setCancelationReason('pat');
      mockAppointment.setReferralId('VA0000009999');

      const screen = renderWithStoreAndRouter(
        <StatusAlert appointment={mockAppointment} facility={facilityData} />,
        {
          initialState,
          path: `/${mockAppointment.id}`,
        },
      );
      expect(screen.baseElement).to.contain('.usa-alert-error');
      expect(screen.baseElement).to.contain.text(
        'You canceled this appointment.',
      );
      expect(screen.baseElement).to.contain.text(
        'If you want to reschedule, call us or schedule a new appointment online.',
      );

      // Should have referral link
      const referralLink = screen.container.querySelector(
        'va-link[text="Go to your referral to schedule an appointment"]',
      );
      expect(referralLink).to.exist;
      expect(referralLink.getAttribute('href')).to.equal(
        '/my-health/appointments/schedule-referral?id=VA0000009999&referrer=referrals-requests',
      );
      expect(screen.queryByTestId('referral-link')).to.exist;

      expect(screen.queryByTestId('review-appointments-link')).to.not.exist;
      expect(screen.queryByTestId('schedule-appointment-link')).to.not.exist;
    });

    it('Should display for canceled CC appointments without referral link fallback', () => {
      const mockAppointment = new MockAppointment();
      mockAppointment.setType('COMMUNITY_CARE_APPOINTMENT');
      mockAppointment.setStatus('cancelled');
      mockAppointment.setCancelationReason('pat');
      // No referralId set

      const screen = renderWithStoreAndRouter(
        <StatusAlert appointment={mockAppointment} facility={facilityData} />,
        {
          initialState,
          path: `/${mockAppointment.id}`,
        },
      );
      expect(screen.baseElement).to.contain('.usa-alert-error');
      expect(screen.baseElement).to.contain.text(
        'You canceled this appointment.',
      );

      // Should fall back to general referrals list
      const referralLink = screen.container.querySelector(
        'va-link[text="Go to your referral to schedule an appointment"]',
      );
      expect(referralLink).to.exist;
      expect(referralLink.getAttribute('href')).to.equal(
        '/my-health/appointments/referrals-requests',
      );

      expect(screen.queryByTestId('review-appointments-link')).to.not.exist;
      expect(screen.queryByTestId('schedule-appointment-link')).to.not.exist;
    });

    it('Should display facility cancellation for CC appointments', () => {
      const mockAppointment = new MockAppointment();
      mockAppointment.setType('COMMUNITY_CARE_APPOINTMENT');
      mockAppointment.setStatus('cancelled');
      mockAppointment.setCancelationReason('clinic');
      mockAppointment.setReferralId('VA0000009999');

      const screen = renderWithStoreAndRouter(
        <StatusAlert appointment={mockAppointment} facility={facilityData} />,
        {
          initialState,
          path: `/${mockAppointment.id}`,
        },
      );
      expect(screen.baseElement).to.contain('.usa-alert-error');
      expect(screen.baseElement).to.contain.text(
        `${facilityData.name} canceled this appointment.`,
      );
      expect(screen.queryByTestId('referral-link')).to.exist;

      expect(screen.queryByTestId('review-appointments-link')).to.not.exist;
      expect(screen.queryByTestId('schedule-appointment-link')).to.not.exist;
    });

    it('Should display for canceled C&P appointments', () => {
      const mockAppointment = new MockAppointment();
      mockAppointment.setIsCompAndPenAppointment(true);
      mockAppointment.setStatus('cancelled');
      mockAppointment.setCancelationReason('pat');

      const screen = renderWithStoreAndRouter(
        <StatusAlert appointment={mockAppointment} facility={facilityData} />,
        {
          initialState,
          path: `/${mockAppointment.id}`,
        },
      );
      expect(screen.baseElement).to.contain('.usa-alert-error');
      expect(screen.baseElement).to.contain.text(
        'You canceled this appointment',
      );
      expect(screen.baseElement).to.contain.text(
        'If you still want this appointment, call your VA health facility’s compensation and pension office to schedule.',
      );

      expect(screen.queryByTestId('review-appointments-link')).to.not.exist;
      expect(screen.queryByTestId('schedule-appointment-link')).to.not.exist;
    });

    it('Should display for canceled appointment requests', () => {
      const mockAppointment = new MockAppointment();
      mockAppointment.setIsPendingAppointment(true);
      mockAppointment.setStatus('cancelled');
      mockAppointment.setCancelationReason('pat');
      mockAppointment.showScheduleLink = true;

      const screen = renderWithStoreAndRouter(
        <StatusAlert appointment={mockAppointment} facility={facilityData} />,
        {
          initialState,
          path: `/${mockAppointment.id}`,
        },
      );
      expect(screen.baseElement).to.contain('.usa-alert-error');
      expect(screen.baseElement).to.contain.text('You canceled this request');
      expect(screen.baseElement).to.contain.text(
        'If you still want this appointment, call your VA health facility or submit another request online.',
      );
      expect(
        screen.container.querySelector(
          'va-link[text="Request a new appointment"]',
        ),
      ).to.be.ok;

      expect(screen.queryByTestId('review-appointments-link')).to.not.exist;
      expect(screen.queryByTestId('schedule-appointment-link')).to.exist;
    });
  });
});
