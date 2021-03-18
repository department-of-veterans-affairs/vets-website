import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';

import {
  setFetchJSONFailure,
  mockFetch,
  resetFetch,
} from 'platform/testing/unit/helpers';
import environment from 'platform/utilities/environment';

import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';

import ReviewPage from '../../../project-cheetah/components/ReviewPage';
import { onCalendarChange } from '../../../project-cheetah/redux/actions';
import { mockAppointmentSubmit, mockFacilityFetch } from '../../mocks/helpers';
import { getVAFacilityMock } from '../../mocks/v0';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS vaccine flow <ReviewPage>', () => {
  let store;
  let start;

  beforeEach(() => {
    mockFetch();
    start = moment();
    store = createTestStore({
      ...initialState,
      projectCheetah: {
        newBooking: {
          pages: {},
          data: {
            vaFacility: '983',
            clinicId: '455',
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
                line: ['2360 East Pershing Boulevard'],
              },
            },
          ],
          availableSlots: [
            {
              start: start.format(),
              end: start
                .clone()
                .add(30, 'minutes')
                .format(),
            },
          ],
          clinics: {
            983: [
              {
                id: '455',
                serviceName: 'Some VA clinic',
                characteristic: [
                  {
                    text: 'clinicFriendlyLocationName',
                    value: 'Some VA clinic',
                  },
                  {
                    text: 'institutionName',
                    value: 'Cheyenne VA Medical Center',
                  },
                  {
                    text: 'institutionCode',
                    value: '983',
                  },
                ],
                identifier: [
                  {
                    system: 'http://med.va.gov/fhir/urn',
                    value: 'urn:va:facility:983:983:455',
                  },
                ],
              },
            ],
          },
        },
      },
    });
    store.dispatch(onCalendarChange([start.format()]));
  });
  afterEach(() => resetFetch());

  it('should show form information for review', async () => {
    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/COVID-19 vaccine/i);
    const [pageHeading, descHeading, facilityHeading] = screen.getAllByRole(
      'heading',
    );
    expect(pageHeading).to.contain.text('Review your appointment details');
    expect(descHeading).to.contain.text('COVID-19 vaccine');
    expect(descHeading).to.have.tagName('h2');

    expect(screen.baseElement).to.contain.text(
      start.format('dddd, MMMM DD, YYYY [at] h:mm a'),
    );

    expect(facilityHeading).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('Some VA clinic');

    // expect(contactHeading).to.contain.text('Your contact details');
    // expect(screen.baseElement).to.contain.text('joeblow@gmail.com');
    // expect(screen.baseElement).to.contain.text('1234567890');
    // expect(screen.baseElement).to.contain.text('Call anytime during the day');

    const editLinks = screen.getAllByText(/^Edit/, { selector: 'a' });
    const uniqueLinks = new Set();
    editLinks.forEach(link => {
      expect(link).to.have.attribute('aria-label');
      uniqueLinks.add(link.getAttribute('aria-label'));
    });
    expect(uniqueLinks.size).to.equal(editLinks.length);
  });

  it('should submit successfully', async () => {
    mockAppointmentSubmit({});

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/COVID-19 vaccine/i);

    userEvent.click(screen.getByText(/Confirm appointment/i));
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/new-covid-19-vaccine-booking/confirmation',
      );
    });
    const submitData = JSON.parse(global.fetch.getCall(0).args[1].body);

    expect(submitData.clinic.siteCode).to.equal('983');
    expect(submitData.clinic.clinicId).to.equal('455');
    expect(submitData.dateTime).to.equal(`${start.format()}+00:00`);
  });

  it('should show appropriate message on bad request submit error', async () => {
    mockFacilityFetch('vha_442', {
      id: 'vha_442',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442',
        name: 'Cheyenne VA Medical Center',
        address: {
          physical: {
            zip: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            address1: '2360 East Pershing Boulevard',
          },
        },
        phone: {
          main: '307-778-7550',
        },
      },
    });
    setFetchJSONFailure(
      global.fetch.withArgs(`${environment.API_URL}/vaos/v0/appointments`),
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
      'Something went wrong when we tried to submit your appointment and you’ll',
    );

    // Not sure of a better way to search for test just within the alert
    const alert = screen.baseElement.querySelector('.usa-alert');
    expect(alert).contain.text('Cheyenne VA Medical Center');
    expect(alert).contain.text('2360 East Pershing Boulevard');
    expect(alert).contain.text('Cheyenne, WY 82001-5356');
    expect(screen.history.push.called).to.be.false;
  });
});
