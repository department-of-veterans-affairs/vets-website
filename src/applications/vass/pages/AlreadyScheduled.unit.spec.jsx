import React from 'react';
import { expect } from 'chai';
import { format } from 'date-fns';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';

import AlreadyScheduled from './AlreadyScheduled';
import { getDefaultRenderOptions } from '../utils/test-utils';
import { createAppointmentData } from '../utils/appointments';

describe('VASS Component: AlreadyScheduled', () => {
  it('should render all content', () => {
    // Use the same UTC timestamp as the component to compute expected values
    // This ensures the test works regardless of the timezone it runs in
    const appointmentData = createAppointmentData({
      startUTC: '2025-05-01T16:00:00.000Z',
    });
    const appointmentDate = new Date(appointmentData.startUTC);
    const expectedDate = format(appointmentDate, 'MM/dd/yyyy');
    const expectedTime = format(appointmentDate, 'hh:mm a');

    const { getByTestId } = renderWithStoreAndRouterV6(
      <AlreadyScheduled />,
      getDefaultRenderOptions(),
    );
    expect(getByTestId('already-scheduled-page')).to.exist;
    expect(getByTestId('already-scheduled-phone-number')).to.exist;
    const dateTimeElement = getByTestId('already-scheduled-date-time');
    expect(dateTimeElement.textContent).to.include(expectedDate);
    expect(dateTimeElement.textContent).to.include(expectedTime);
    expect(getByTestId('already-scheduled-reschedule-message')).to.exist;
    expect(getByTestId('already-scheduled-cancel-button')).to.exist;
  });
});
