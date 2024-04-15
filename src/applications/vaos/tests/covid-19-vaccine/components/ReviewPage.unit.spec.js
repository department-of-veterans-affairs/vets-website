import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';

import {
  setFetchJSONFailure,
  mockFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';

import ReviewPage from '../../../covid-19-vaccine/components/ReviewPage';
import { onCalendarChange } from '../../../covid-19-vaccine/redux/actions';
import { mockAppointmentSubmitV2 } from '../../mocks/helpers.v2';

describe('VAOS vaccine flow: ReviewPage', () => {
  let store;
  let start;
  const initialState = {
    featureToggles: {
      vaOnlineSchedulingVAOSServiceVAAppointments: true,
    },
  };

  beforeEach(() => {
    mockFetch();
    start = moment();
    store = createTestStore({
      ...initialState,
      covid19Vaccine: {
        newBooking: {
          pages: {},
          data: {
            phoneNumber: '2234567890',
            email: 'joeblow@gmail.com',
            vaFacility: '983',
            clinicId: '983_455',
          },
          facilityDetails: {
            983: {},
          },
          facilities: [
            {
              id: '983',
              name: 'Cheyenne VA Medical Center',
              address: {
                postalCode: '82001-5356',
                city: 'Cheyenne',
                state: 'WY',
                line: ['2360 East Pershing Boulevard', null, 'Suite 10'],
              },
            },
          ],
          availableSlots: [
            {
              start: start.format(),
              id: 'test',
              end: start
                .clone()
                .add(30, 'minutes')
                .format(),
            },
          ],
          clinics: {
            983: [
              {
                id: '983_455',
                serviceName: 'Some VA clinic',
                stationId: '983',
                stationName: 'Cheyenne VA Medical Center',
              },
            ],
          },
        },
      },
    });
    store.dispatch(onCalendarChange([start.format()]));
  });

  it('should submit successfully', async () => {
    // Given a fully filled out form
    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });
    await screen.findByText(/COVID-19 vaccine/i);
    mockAppointmentSubmitV2({
      id: 'fake_id',
      attributes: {
        reasonCode: {},
      },
    });
    expect(screen.baseElement).to.contain.text(
      'Make sure the information is correct. Then confirm your appointment.',
    );
    expect(screen.getByText(/2360 East Pershing Boulevard, Suite 10/i)).to.be;

    // When the user confirms their appointment
    userEvent.click(screen.getByText(/Confirm appointment/i));
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/new-covid-19-vaccine-appointment/confirmation',
      );
    });

    // Then the form data is submitted to the v2 endpoint and matches the form
    const submitData = JSON.parse(global.fetch.getCall(0).args[1].body);

    expect(submitData).to.deep.equal({
      kind: 'clinic',
      status: 'booked',
      locationId: '983',
      clinic: '455',
      // comment: '',
      extension: {
        desiredDate: store.getState().covid19Vaccine.newBooking
          .availableSlots[0].start,
      },
      slot: {
        id: store.getState().covid19Vaccine.newBooking.availableSlots[0].id,
      },
    });
  });

  it('should show form information for review', async () => {
    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/COVID-19 vaccine/i);
    const [
      pageHeading,
      descHeading,
      dateHeading,
      facilityHeading,
    ] = screen.getAllByRole('heading');
    expect(pageHeading).to.contain.text('Review your appointment details');
    expect(descHeading).to.contain.text('COVID-19 vaccine');
    expect(descHeading).to.have.tagName('h2');

    expect(dateHeading).to.contain.text(
      start.format('dddd, MMMM D, YYYY [at] h:mm a'),
    );
    expect(dateHeading).to.have.tagName('h3');

    expect(facilityHeading).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('Some VA clinic');

    // expect(contactHeading).to.contain.text('Your contact details');
    // expect(screen.baseElement).to.contain.text('joeblow@gmail.com');
    // expect(screen.baseElement).to.contain.text('1234567890');
    // expect(screen.baseElement).to.contain.text('Call anytime during the day');

    const editLinks = screen.getAllByTestId('edit-contact-information-link');
    const uniqueLinks = new Set();
    editLinks.forEach(link => {
      expect(link).to.have.attribute('aria-label');
      uniqueLinks.add(link.getAttribute('aria-label'));
    });
    expect(uniqueLinks.size).to.equal(editLinks.length);
  });

  it('should show appropriate message on bad request submit error', async () => {
    setFetchJSONFailure(
      global.fetch.withArgs(`${environment.API_URL}/vaos/v2/appointments`),
      {
        errors: [
          {
            code: 'VAOS_400',
          },
        ],
      },
    );

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/COVID-19 vaccine/i);

    userEvent.click(screen.getByText(/Confirm appointment/i));

    await screen.findByText('We couldn’t schedule this appointment');

    expect(screen.baseElement).contain.text(
      'You’ll need to call your local VA medical center',
    );

    // Not sure of a better way to search for test just within the alert
    const alert = screen.baseElement.querySelector('va-alert');
    expect(alert).contain.text('Cheyenne VA Medical Center');
    expect(alert).contain.text('2360 East Pershing Boulevard');
    expect(alert).contain.text('Cheyenne, WyomingWY 82001-5356');
    expect(screen.history.push.called).to.be.false;
  });

  it('should show appropriate message on regular submit error', async () => {
    setFetchJSONFailure(
      global.fetch.withArgs(`${environment.API_URL}/vaos/v2/appointments`),
      {
        errors: [
          {
            code: 'VAOS_500',
          },
        ],
      },
    );

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/COVID-19 vaccine/i);

    userEvent.click(screen.getByText(/Confirm appointment/i));

    await screen.findByText('We couldn’t schedule this appointment');

    expect(screen.baseElement).contain.text('you’ll need to start over');

    // Not sure of a better way to search for test just within the alert
    const alert = screen.baseElement.querySelector('va-alert');
    expect(alert).contain.text('Cheyenne VA Medical Center');
    expect(alert).contain.text('2360 East Pershing Boulevard');
    expect(alert).contain.text('Cheyenne, WyomingWY 82001-5356');
    expect(screen.history.push.called).to.be.false;
    waitFor(() => {
      expect(document.activeElement).to.be(alert);
    });
  });
});
