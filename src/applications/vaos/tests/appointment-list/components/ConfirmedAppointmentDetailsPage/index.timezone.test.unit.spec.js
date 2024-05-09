import React from 'react';
import { expect } from 'chai';
import moment from 'moment-timezone';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor } from '@testing-library/react';

import { renderWithStoreAndRouter } from '../../../mocks/setup';

import { AppointmentList } from '../../../../appointment-list';
import { mockAppointmentApi, mockClinicsApi } from '../../../mocks/helpers.v2';
import {
  mockFacilitiesFetchByVersion,
  mockFacilityFetchByVersion,
} from '../../../mocks/fetch';
import MockAppointmentResponse from '../../../e2e/fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../../../e2e/fixtures/MockFacilityResponse';
import MockClinicResponse from '../../../e2e/fixtures/MockClinicResponse';

describe('VAOS Page: ConfirmedAppointmentDetailsPage with VAOS service', () => {
  process.env.TZ = 'UTC';
  const initialState = {
    featureToggles: {
      // eslint-disable-next-line camelcase
      show_new_schedule_view_appointments_page: true,
      vaOnlineSchedulingBreadcrumbUrlUpdate: true,
      vaOnlineSchedulingCancel: true,
      vaOnlineSchedulingPast: true,
      vaOnlineSchedulingRequests: true,
      vaOnlineSchedulingStatusImprovement: true,
      vaOnlineSchedulingVAOSServiceRequests: true,
      vaOnlineSchedulingVAOSServiceVAAppointments: true,
      vaOnlineSchedulingAppointmentDetailsRedesign: false,
    },
  };

  beforeEach(() => {
    mockFetch();
    mockFacilitiesFetchByVersion();

    console.log(
      `[LOG] TZ: ${new Date().toLocaleString('en', { timeZoneName: 'long' })}`,
    );

    console.log(
      `[LOG] expect: ${moment()
        .tz('America/Denver')
        .format('dddd, MMMM D, YYYY')}`,
    );

    console.log(`[LOG] expect: ${moment().tz('America/Denver')}`);

    console.log(
      `[LOG] moment.now(): ${moment().format('YYYY-MM-DDTHH:mm:ss.000Z')}`,
    );
  });

  it('should show confirmed appointments detail page', async () => {
    // Arrange
    const response = new MockAppointmentResponse();
    response
      .setLocationId('983')
      .setClinicId('1')
      .setReasonCode({ text: 'I have a headache' });
    const clinicResponse = new MockClinicResponse({
      id: 1,
      locationId: '983',
    });
    const facilityResponse = new MockFacilityResponse({ id: '983' });

    mockAppointmentApi({ response });
    mockClinicsApi({
      clinicId: '1',
      locationId: '983',
      response: [clinicResponse],
    });
    mockFacilityFetchByVersion({ facility: facilityResponse });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/${response.id}`,
    });

    // Assert
    // Verify document title and content...
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: new RegExp(
          moment()
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY'),
          'i',
        ),
      }),
    ).to.be.ok;

    expect(screen.getByText('Primary care')).to.be.ok;
    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(await screen.findByText(/Cheyenne VA Medical Center/)).to.be.ok;
    expect(await screen.findByText(/Clinic 1/)).to.be.ok;
    expect(screen.getByTestId('facility-telephone')).to.exist;
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.ok;
    expect(screen.getByText(/I have a headache/)).to.be.ok;
    expect(
      screen.getByTestId('add-to-calendar-link', {
        name: new RegExp(
          moment()
            .tz('America/Denver')
            .format('[Add] MMMM D, YYYY [appointment to your calendar]'),
          'i',
        ),
      }),
    ).to.be.ok;
    expect(screen.getByText(/Print/)).to.be.ok;
    expect(screen.getByText(/Cancel appointment/)).to.be.ok;

    expect(screen.baseElement).not.to.contain.text(
      'This appointment occurred in the past.',
    );
  });
});
