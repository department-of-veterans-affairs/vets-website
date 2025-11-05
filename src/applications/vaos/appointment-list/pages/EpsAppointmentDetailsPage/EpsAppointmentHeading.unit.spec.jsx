import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import {
  renderWithStoreAndRouter,
  createTestStore,
} from '../../../tests/mocks/setup';
import EpsAppointmentHeading from './EpsAppointmentHeading';

describe('EpsAppointmentHeading', () => {
  const defaultProps = {
    isPastAppointment: false,
    cancellingAppointment: false,
    cancelSuccess: false,
    onAbortCancellation: () => {},
    referralId: 'test-referral-id',
  };

  describe('Normal state (not cancelling)', () => {
    it('should render back link with "Back to appointments" for upcoming appointments', () => {
      const store = createTestStore({});
      const { getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentHeading {...defaultProps} />,
        { store },
      );

      const backLink = getByTestId('back-link');
      expect(backLink).to.exist;
      expect(backLink).to.have.attribute('text', 'Back to appointments');
      expect(backLink).to.have.attribute('href', '/my-health/appointments');
    });

    it('should render back link with "Back to past appointments" for past appointments', () => {
      const store = createTestStore({});
      const { getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentHeading {...defaultProps} isPastAppointment />,
        { store },
      );

      const backLink = getByTestId('back-link');
      expect(backLink).to.exist;
      expect(backLink).to.have.attribute('text', 'Back to past appointments');
      expect(backLink).to.have.attribute(
        'href',
        '/my-health/appointments/past',
      );
    });

    it('should navigate to appointments list when back link is clicked', async () => {
      const store = createTestStore({});
      const { getByTestId, history } = renderWithStoreAndRouter(
        <EpsAppointmentHeading {...defaultProps} />,
        { store },
      );

      const backLink = getByTestId('back-link');
      await userEvent.click(backLink);

      expect(history.push.calledWith('/')).to.be.true;
    });

    it('should navigate to past appointments when back link is clicked for past appointments', async () => {
      const store = createTestStore({});
      const { getByTestId, history } = renderWithStoreAndRouter(
        <EpsAppointmentHeading {...defaultProps} isPastAppointment />,
        { store },
      );

      const backLink = getByTestId('back-link');
      await userEvent.click(backLink);

      expect(history.push.calledWith('/past')).to.be.true;
    });

    it('should not render heading or info text in normal state', () => {
      const store = createTestStore({});
      const { container } = renderWithStoreAndRouter(
        <EpsAppointmentHeading {...defaultProps} />,
        { store },
      );

      const heading = container.querySelector('h1');
      const paragraph = container.querySelector('p');
      expect(heading).to.not.exist;
      expect(paragraph).to.not.exist;
    });
  });

  describe('Cancelling state (cancellingAppointment=true, cancelSuccess=false)', () => {
    it('should render cancellation heading and info text', () => {
      const store = createTestStore({});
      const { getByText } = renderWithStoreAndRouter(
        <EpsAppointmentHeading {...defaultProps} cancellingAppointment />,
        { store },
      );

      expect(getByText('Would you like to cancel this appointment?')).to.exist;
      expect(getByText(/If you want to reschedule.*schedule a new appointment/))
        .to.exist;
    });

    it('should render back link with "Back to community care details"', () => {
      const store = createTestStore({});
      const { getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentHeading {...defaultProps} cancellingAppointment />,
        { store },
      );

      const backLink = getByTestId('back-link');
      expect(backLink).to.exist;
      expect(backLink).to.have.attribute(
        'text',
        'Back to community care details',
      );
    });

    it('should call onAbortCancellation when back link is clicked', async () => {
      const store = createTestStore({});
      let abortCalled = false;
      const onAbortCancellation = () => {
        abortCalled = true;
      };

      const { getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentHeading
          {...defaultProps}
          cancellingAppointment
          onAbortCancellation={onAbortCancellation}
        />,
        { store },
      );

      const backLink = getByTestId('back-link');
      await userEvent.click(backLink);

      expect(abortCalled).to.be.true;
    });

    it('should use current pathname as href for back link', () => {
      const store = createTestStore({});
      const { getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentHeading {...defaultProps} cancellingAppointment />,
        { store, path: '/test-appointment-id' },
      );

      const backLink = getByTestId('back-link');
      expect(backLink).to.have.attribute('href', '/test-appointment-id');
    });
  });

  describe('Cancel success state (cancellingAppointment=true, cancelSuccess=true)', () => {
    it('should render success heading and info text', () => {
      const store = createTestStore({});
      const { getByText } = renderWithStoreAndRouter(
        <EpsAppointmentHeading
          {...defaultProps}
          cancellingAppointment
          cancelSuccess
        />,
        { store },
      );

      expect(getByText('You have canceled your appointment')).to.exist;
      expect(
        getByText(
          'If you still need an appointment, call us or go to your referral to schedule a new appointment online.',
        ),
      ).to.exist;
    });

    it('should render "Go to your referral" link', () => {
      const store = createTestStore({});
      const { getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentHeading
          {...defaultProps}
          cancellingAppointment
          cancelSuccess
        />,
        { store },
      );

      const referralLink = getByTestId('go-to-referral-link');
      expect(referralLink).to.exist;
      expect(referralLink).to.have.attribute(
        'text',
        'Go to your referral to schedule',
      );
      expect(referralLink).to.have.attribute(
        'href',
        '/my-health/appointments/schedule-referral?id=test-referral-id',
      );
      expect(referralLink).to.have.attribute('active');
    });

    it('should navigate to referral when "Go to your referral" link is clicked', async () => {
      const store = createTestStore({});
      const { getByTestId, history } = renderWithStoreAndRouter(
        <EpsAppointmentHeading
          {...defaultProps}
          cancellingAppointment
          cancelSuccess
        />,
        { store },
      );

      const referralLink = getByTestId('go-to-referral-link');
      await userEvent.click(referralLink);

      expect(history.push.calledWith('/schedule-referral?id=test-referral-id'))
        .to.be.true;
    });

    it('should render back link with "Back to appointments" text', () => {
      const store = createTestStore({});
      const { getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentHeading
          {...defaultProps}
          cancellingAppointment
          cancelSuccess
        />,
        { store },
      );

      const backLink = getByTestId('back-link');
      expect(backLink).to.exist;
      expect(backLink).to.have.attribute('text', 'Back to appointments');
      expect(backLink).to.have.attribute('href', '/my-health/appointments');
    });

    it('should render back link with "Back to past appointments" for past appointments', () => {
      const store = createTestStore({});
      const { getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentHeading
          {...defaultProps}
          isPastAppointment
          cancellingAppointment
          cancelSuccess
        />,
        { store },
      );

      const backLink = getByTestId('back-link');
      expect(backLink).to.have.attribute('text', 'Back to past appointments');
      expect(backLink).to.have.attribute(
        'href',
        '/my-health/appointments/past',
      );
    });

    it('should navigate to appointments list when back link is clicked', async () => {
      const store = createTestStore({});
      const { getByTestId, history } = renderWithStoreAndRouter(
        <EpsAppointmentHeading
          {...defaultProps}
          cancellingAppointment
          cancelSuccess
        />,
        { store },
      );

      const backLink = getByTestId('back-link');
      await userEvent.click(backLink);

      expect(history.push.calledWith('/')).to.be.true;
    });

    it('should navigate to past appointments when back link is clicked for past appointments', async () => {
      const store = createTestStore({});
      const { getByTestId, history } = renderWithStoreAndRouter(
        <EpsAppointmentHeading
          {...defaultProps}
          isPastAppointment
          cancellingAppointment
          cancelSuccess
        />,
        { store },
      );

      const backLink = getByTestId('back-link');
      await userEvent.click(backLink);

      expect(history.push.calledWith('/past')).to.be.true;
    });
  });

  describe('Edge cases', () => {
    it('should handle different referralId values', () => {
      const store = createTestStore({});
      const { getByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentHeading
          {...defaultProps}
          referralId="different-referral-123"
          cancellingAppointment
          cancelSuccess
        />,
        { store },
      );

      const referralLink = getByTestId('go-to-referral-link');
      expect(referralLink).to.have.attribute(
        'href',
        '/my-health/appointments/schedule-referral?id=different-referral-123',
      );
    });

    it('should not show referral link when cancelSuccess is false', () => {
      const store = createTestStore({});
      const { queryByTestId } = renderWithStoreAndRouter(
        <EpsAppointmentHeading {...defaultProps} cancellingAppointment />,
        { store },
      );

      expect(queryByTestId('go-to-referral-link')).to.not.exist;
    });

    it('should not show cancellation heading in normal state', () => {
      const store = createTestStore({});
      const { queryByText } = renderWithStoreAndRouter(
        <EpsAppointmentHeading {...defaultProps} />,
        { store },
      );

      expect(queryByText('Would you like to cancel this appointment?')).to.not
        .exist;
      expect(queryByText('You have canceled your appointment')).to.not.exist;
    });
  });
});
