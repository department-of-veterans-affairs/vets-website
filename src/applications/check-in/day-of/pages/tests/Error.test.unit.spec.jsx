import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';
import Error from '../Error';

describe('check-in', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('Error component', () => {
    it('renders without the phone number', () => {
      const component = render(
        <CheckInProvider>
          <Error />
        </CheckInProvider>,
      );
      expect(component.getByTestId('error-message-default-error')).to.exist;
      expect(component.getByTestId('error-message-default-error')).to.have.text(
        'We’re sorry. Something went wrong on our end. Check in with a staff member.',
      );
    });
  });
  it('renders the correct error on max-validation', () => {
    const component = render(
      <CheckInProvider store={{ error: 'max-validation' }}>
        <Error />
      </CheckInProvider>,
    );
    expect(component.getByTestId('error-message-max-validation')).to.exist;
    expect(component.getByTestId('error-message-max-validation')).to.have.text(
      'We’re sorry. We couldn’t match your information to our records. Please ask a staff member for help.',
    );
  });
  it('renders the correct error on uuid-not-found', () => {
    const component = render(
      <CheckInProvider store={{ error: 'uuid-not-found' }}>
        <Error />
      </CheckInProvider>,
    );
    expect(component.getByTestId('error-message-trying-to-check-in')).to.exist;
    expect(
      component.getByTestId('error-message-trying-to-check-in'),
    ).to.have.text('Trying to check in for an appointment? Text check in to .');
    expect(component.getByTestId('error-message-sms')).to.exist;
  });
  it('renders the correct error on check-in-post-error', () => {
    const component = render(
      <CheckInProvider store={{ error: 'check-in-post-error' }}>
        <Error />
      </CheckInProvider>,
    );
    expect(component.queryAllByTestId('message-subheading').length).to.eq(2);
    expect(component.getByTestId('error-message-checkin-error')).to.exist;
    expect(component.getByTestId('error-message-checkin-error')).to.have.text(
      'We’re sorry. Something went wrong on our end. Check in with a staff member.',
    );
  });
  it('renders the correct error on check-in-post-error with yes to travel', () => {
    const component = render(
      <CheckInProvider
        store={{
          error: 'check-in-post-error',
          features: {
            /* eslint-disable-next-line camelcase */
            check_in_experience_travel_reimbursement: true,
          },
          travelQuestion: 'yes',
          travelAddress: 'yes',
          travelMileage: 'yes',
          travelVehicle: 'yes',
        }}
      >
        <Error />
      </CheckInProvider>,
    );
    expect(component.queryAllByTestId('message-subheading').length).to.eq(2);
    expect(component.getByTestId('error-message-checkin-error')).to.exist;
    expect(component.getByTestId('error-message-checkin-error')).to.have.text(
      'We’re sorry. Something went wrong on our end. Check in with a staff member.',
    );
    // get second va alert and check for status attribute of warning
    expect(component.getByTestId('check-in-failed-file-later')).to.contain.text(
      'We’re sorry. We can’t file a travel reimbursement claim for you now. But you can still file within 30 days of the appointment.',
    );
  });
  it('renders the correct error on check-in-post-error with no to travel', () => {
    const component = render(
      <CheckInProvider
        store={{
          error: 'check-in-post-error',
          features: {
            /* eslint-disable-next-line camelcase */
            check_in_experience_travel_reimbursement: true,
          },
          travelQuestion: 'no',
        }}
      >
        <Error />
      </CheckInProvider>,
    );
    expect(component.queryAllByTestId('message-subheading').length).to.eq(2);
    expect(component.getByTestId('error-message-checkin-error')).to.exist;
    expect(component.getByTestId('error-message-checkin-error')).to.have.text(
      'We’re sorry. Something went wrong on our end. Check in with a staff member.',
    );
    // get second va alert and check for status attribute of warning
    expect(component.getByTestId('check-in-failed-find-out')).to.contain.text(
      'VA travel pay reimbursement pays eligible Veterans and caregivers back for mileage and other travel expenses to and from approved health care appointments.Find out if you’re eligible and how to file for travel reimbursement',
    );
  });
  it('renders the correct error on check-in-post-error with no to any travel question', () => {
    const component = render(
      <CheckInProvider
        store={{
          error: 'check-in-post-error',
          features: {
            /* eslint-disable-next-line camelcase */
            check_in_experience_travel_reimbursement: true,
          },
          travelQuestion: 'yes',
          travelAddress: 'yes',
          travelMileage: 'no',
        }}
      >
        <Error />
      </CheckInProvider>,
    );
    expect(component.queryAllByTestId('message-subheading').length).to.eq(2);
    expect(component.getByTestId('error-message-checkin-error')).to.exist;
    expect(component.getByTestId('error-message-checkin-error')).to.have.text(
      'We’re sorry. Something went wrong on our end. Check in with a staff member.',
    );
    // get second va alert and check for status attribute of warning
    expect(component.getByTestId('check-in-failed-cant-file')).to.contain.text(
      'We’re sorry. We can’t file this type of travel reimbursement claim for you now. But you can still file within 30 days of the appointment.Find out how to file for travel reimbursement',
    );
  });
});
