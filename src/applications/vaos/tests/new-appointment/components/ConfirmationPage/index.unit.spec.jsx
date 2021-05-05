import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { expect } from 'chai';
import moment from 'moment';
import React from 'react';
import sinon from 'sinon';
import ConfirmationPage, * as noConnect from '../../../../new-appointment/components/ConfirmationPage';
import { FETCH_STATUS, FLOW_TYPES } from '../../../../utils/constants';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

const closeConfirmationPage = sinon.spy();
const fetchFacilityDetails = sinon.spy();
const startNewAppointmentFlow = sinon.spy();

describe('VAOS <ConfirmationPage>', () => {
  it('should render appointment direct schedule view', async () => {
    const start = moment();
    const store = createTestStore({
      newAppointment: {
        submitStatus: FETCH_STATUS.succeeded,
        flowType: FLOW_TYPES.DIRECT,
        data: {
          typeOfCareId: '323',
          phoneNumber: '1234567890',
          email: 'joeblow@gmail.com',
          reasonForAppointment: 'routine-follow-up',
          reasonAdditionalInfo: 'Additional info',
          vaParent: '983',
          vaFacility: '983',
          clinicId: '455',
          selectedDates: [start.format()],
        },
        availableSlots: [
          {
            start: start.format(),
            end: start
              .clone()
              .add(30, 'minutes')
              .format(),
          },
        ],
        parentFacilities: [
          {
            id: '983',
            identifier: [
              { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
              {
                system: 'http://med.va.gov/fhir/urn',
                value: 'urn:va:facility:983',
              },
            ],
          },
        ],
        clinics: {
          '983_323': [
            {
              id: '455',
            },
          ],
        },
        facilities: {
          '323': [
            {
              id: '983',
              name: 'Cheyenne VA Medical Center',
              identifier: [
                { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
              ],
              address: {
                postalCode: '82001-5356',
                city: 'Cheyenne',
                state: 'WY',
                line: ['2360 East Pershing Boulevard'],
              },
              telecom: [{ system: 'phone', value: '307-778-7550' }],
            },
          ],
        },
      },
    });

    const screen = renderWithStoreAndRouter(<ConfirmationPage />, {
      store,
    });

    expect(await screen.findByText(/Your appointment is confirmed/i)).to.be.ok;
    expect(
      screen.getByText(
        new RegExp(start.format('MMMM D, YYYY [at] h:mm a'), 'i'),
      ),
    ).to.be.ok;

    expect(screen.getByText(/Cheyenne VA Medical Center/i)).to.be.ok;
    expect(screen.getByText(/2360 East Pershing Boulevard/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text('Cheyenne, WY 82001-5356');
    expect(screen.getByText(/Follow-up\/Routine/i)).to.be.ok;
    expect(screen.getByText(/Additional info/i)).to.be.ok;

    expect(
      screen.getByRole('link', {
        name: start.format('[Add] MMMM D, YYYY [appointment to your calendar]'),
      }),
    ).to.be.ok;
  });

  it('should render VA appointment request view', async () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {
      typeOfCareId: '323',
      bestTimeToCall: {
        morning: true,
        afternoon: true,
      },
      selectedDates: ['2019-12-20T00:00:00.000'],
      vaFacility: '983',
    };
    const facilityDetails = {
      name: 'CHYSHR-Sidney VA Clinic',
      id: '983',
      address: {
        postalCode: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        line: ['2360 East Pershing Boulevard'],
      },
    };

    const screen = renderWithStoreAndRouter(
      <noConnect.ConfirmationPage
        submitStatus={FETCH_STATUS.succeeded}
        facilityDetails={facilityDetails}
        flowType={flowType}
        data={data}
      />,
      {
        initialState,
      },
    );

    expect(screen.getByText(/We’re reviewing your request/i)).to.be.ok;
    expect(screen.getByText(/VA appointment/i)).to.be.ok;
    expect(screen.getByText(/Primary care appointment/i)).to.be.ok;
    expect(screen.getByText(/Pending/i)).to.be.ok;
    expect(screen.getByText(/CHYSHR-Sidney VA Clinic/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text('Cheyenne, WY');
    expect(screen.getByText(/December 20, 2019 in the morning/i)).to.be.ok;
  });

  it('should render CC appointment request view', async () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {
      typeOfCareId: '323',
      facilityType: 'communityCare',
      distanceWillingToTravel: '25',
      preferredLanguage: 'english',
      visitType: 'office',
      bestTimeToCall: {
        morning: true,
        afternoon: true,
      },
      hasCommunityCareProvider: true,
      communityCareProvider: {
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '5555555555',
        address: {
          street: '123 Test',
          city: 'Northampton',
          state: 'MA',
          postalCode: '01060',
        },
      },
      selectedDates: ['2019-12-20T00:00:00.000'],
    };
    const facilityDetails = {
      name: 'CHYSHR-Sidney VA Clinic',
      id: '983',
      address: {
        postalCode: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        line: ['2360 East Pershing Boulevard'],
      },
    };

    const screen = renderWithStoreAndRouter(
      <noConnect.ConfirmationPage
        submitStatus={FETCH_STATUS.succeeded}
        facilityDetails={facilityDetails}
        flowType={flowType}
        data={data}
      />,
      {
        initialState,
      },
    );

    expect(screen.getByText(/We’re reviewing your request/i)).to.be.ok;
    expect(screen.getByText(/Community Care/i)).to.be.ok;
    expect(screen.getByText(/Primary care appointment/i)).to.be.ok;
    expect(screen.getByText(/Pending/i)).to.be.ok;
    expect(screen.getByText(/Jane Doe/i)).to.be.ok;
    expect(screen.getByText(/555555555/i)).to.be.ok;
    expect(screen.getByText(/123 Test/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text('Northampton, MA 01060');
    expect(screen.getByText(/December 20, 2019 in the morning/i)).to.be.ok;
  });

  it('should render CC appointment request view without provider', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {
      typeOfCareId: '323',
      facilityType: 'communityCare',
      distanceWillingToTravel: '25',
      preferredLanguage: 'english',
      visitType: 'office',
      bestTimeToCall: {
        morning: true,
        afternoon: true,
      },
      hasCommunityCareProvider: false,
      selectedDates: ['2019-12-20T00:00:00.000'],
    };
    const facilityDetails = {
      name: 'CHYSHR-Sidney VA Clinic',
      id: '983',
      address: {
        postalCode: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        line: ['2360 East Pershing Boulevard'],
      },
    };

    const screen = renderWithStoreAndRouter(
      <noConnect.ConfirmationPage
        submitStatus={FETCH_STATUS.succeeded}
        facilityDetails={facilityDetails}
        flowType={flowType}
        data={data}
      />,
      {
        initialState,
      },
    );

    expect(screen.getByText(/We’re reviewing your request/i)).to.be.ok;
    expect(screen.getByText(/Community Care/i)).to.be.ok;
    expect(screen.getByText(/Primary care appointment/i)).to.be.ok;
    expect(screen.getByText(/Pending/i)).to.be.ok;
    expect(screen.getByText(/No preference/i)).to.be.ok;

    expect(screen.queryByText(/CHYSHR-Sidney VA Clinic/i)).to.be.null;
  });

  it('should render addtional information when "Show more" button is clicked', async () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {
      typeOfCareId: '323',
      phoneNumber: '1234567890',
      email: 'joeblow@gmail.com',
      reasonForAppointment: 'routine-follow-up',
      reasonAdditionalInfo: 'Additional info',
      bestTimeToCall: {
        evening: true,
        morning: false,
        afternoon: false,
      },
    };
    const facilityDetails = {
      name: 'CHYSHR-Sidney VA Clinic',
      id: '983',
      address: {
        postalCode: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        line: ['2360 East Pershing Boulevard'],
      },
    };

    const screen = renderWithStoreAndRouter(
      <noConnect.ConfirmationPage
        submitStatus={FETCH_STATUS.succeeded}
        facilityDetails={facilityDetails}
        flowType={flowType}
        data={data}
      />,
      {
        initialState,
      },
    );

    // Simulate user clicking the "Show more" button
    const button = screen.getByRole('button', { name: 'Show more' });
    userEvent.click(button);

    // Button text should change to "Show less"
    await screen.findByRole('button', { name: 'Show less' });

    // The following additional information should be displayed
    expect(screen.getByText(/Follow-up\/Routine/i)).to.be.ok;
    expect(screen.getByText(/Additional info/i)).to.be.ok;
    expect(screen.getByText(/joeblow@gmail.com/i)).to.be.ok;
    expect(screen.getByText(/1234567890/i)).to.be.ok;
    expect(screen.getByText(/Evening/i)).to.be.ok;
  });

  it('should format the best time to call correctly when 2 times are selected', async () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {
      typeOfCareId: '323',
      bestTimeToCall: {
        evening: true,
        morning: true,
        afternoon: false,
      },
    };
    const facilityDetails = {
      address: {},
    };
    const screen = renderWithStoreAndRouter(
      <noConnect.ConfirmationPage
        submitStatus={FETCH_STATUS.succeeded}
        facilityDetails={facilityDetails}
        flowType={flowType}
        data={data}
      />,
      {
        initialState,
      },
    );

    // Simulate user clicking the "Show more" button
    const button = screen.getByRole('button', { name: 'Show more' });
    userEvent.click(button);

    // Button text should change to "Show less"
    await screen.findByRole('button', { name: 'Show less' });

    expect(screen.getByText(/Morning or Evening/i)).to.be.ok;
  });

  it('should format the best time to call correctly when 3 times are selected', async () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {
      typeOfCareId: '323',
      bestTimeToCall: {
        evening: true,
        morning: true,
        afternoon: true,
      },
    };
    const facilityDetails = {
      address: {},
    };
    const screen = renderWithStoreAndRouter(
      <noConnect.ConfirmationPage
        submitStatus={FETCH_STATUS.succeeded}
        facilityDetails={facilityDetails}
        flowType={flowType}
        data={data}
      />,
      {
        initialState,
      },
    );

    // Simulate user clicking the "Show more" button
    const button = screen.getByRole('button', { name: 'Show more' });
    userEvent.click(button);

    // Button text should change to "Show less"
    await screen.findByRole('button', { name: 'Show less' });

    expect(screen.getByText(/Anytime during the day/i)).to.be.ok;
  });

  it('should render new appointment page when "New appointment" button is clicked', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {
      typeOfCareId: '323',
      vaFacility: '983',
    };

    const screen = renderWithStoreAndRouter(
      <noConnect.ConfirmationPage
        submitStatus={FETCH_STATUS.succeeded}
        fetchFacilityDetails={fetchFacilityDetails}
        startNewAppointmentFlow={startNewAppointmentFlow}
        flowType={flowType}
        data={data}
      />,
      {
        initialState,
      },
    );

    // Simulate user clicking button
    const button = screen.getByText(/New appointment/i);
    userEvent.click(button);

    // Expect router to route to new appointment page
    expect(screen.history.push.called).to.be.true;
    expect(screen.history.push.getCall(0).args[0]).to.equal('new-appointment');
  });

  it('should render appointment list page when "View your appointments" button is clicked', () => {
    const start = moment().tz('America/Denver');
    const end = start;
    const flowType = FLOW_TYPES.DIRECT;
    const data = {
      typeOfCareId: '323',
      vaFacility: '983',
    };

    const screen = renderWithStoreAndRouter(
      <noConnect.ConfirmationPage
        submitStatus={FETCH_STATUS.succeeded}
        fetchFacilityDetails={fetchFacilityDetails}
        closeConfirmationPage={closeConfirmationPage}
        flowType={flowType}
        data={data}
        startNewAppointmentFlow={startNewAppointmentFlow}
        slot={{ start, end }}
      />,
      {
        initialState,
      },
    );

    // Simulate user clicking button
    const button = screen.getByText(/View your appointments/i);
    userEvent.click(button);

    // Expect router to route to new appointment page
    expect(screen.history.push.called).to.be.true;
    expect(screen.history.push.getCall(0).args[0]).to.equal('/');
  });

  it('should redirect to new appointment page if no form data', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ConfirmationPage />, {
      store,
    });

    // Expect router to route to new appointment page
    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal('/new-appointment');
    });
  });
});
