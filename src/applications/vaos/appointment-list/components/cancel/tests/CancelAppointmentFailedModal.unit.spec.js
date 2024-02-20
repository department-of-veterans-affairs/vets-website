import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Facility } from '../../../../tests/mocks/unit-test-helpers';
import CancelAppointmentFailedModal from '../CancelAppointmentFailedModal';

describe('Cancel appointment failed modal component', () => {
  const initialState = {
    featureToggles: {},
  };

  const facilityData = new Facility();

  it('should display message when there is an invalid api call to cancel an appointment', async () => {
    const screen = render(
      <CancelAppointmentFailedModal
        facility={facilityData}
        isConfirmed
        isBadRequest
        onClose
      />,
      {
        initialState,
      },
    );
    await screen.findByRole('alertdialog');
    expect(screen.baseElement).to.contain.text(
      'We’re sorry. You can’t cancel your appointment',
    );
    // facility name
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    // facility address
    expect(screen.baseElement).to.contain.text('2360 East Pershing Boulevard');
    // facility phone
    expect(await screen.findByTestId('facility-telephone')).to.exist;
  });
  it('should display message for valid api call but failed to cancel a request', async () => {
    const screen = render(
      <CancelAppointmentFailedModal
        isConfirmed={false}
        isBadRequest={false}
        onClose
      />,
      {
        initialState,
      },
    );
    await screen.findByRole('alertdialog');
    expect(screen.baseElement).to.contain.text(
      'Something went wrong when we tried to cancel this request.',
    );
    // find locations link
    expect(
      screen.getByRole('link', { name: /Find facility contact information/i }),
    ).to.have.attribute('href', '/find-locations');
  });
});
