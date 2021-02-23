import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { Route } from 'react-router-dom';
import { fireEvent } from '@testing-library/react';
import environment from 'platform/utilities/environment';
import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

import RequestedAppointmentDetailsPage from '../../../appointment-list/components/RequestedAppointmentDetailsPage';
import {
  getTimezoneTestDate,
  renderWithStoreAndRouter,
} from '../../mocks/setup';
import {
  getVAFacilityMock,
  getVARequestMock,
  getCCRequestMock,
  getMessageMock,
} from '../../mocks/v0';
import { FETCH_STATUS } from '../../../utils/constants';
import reducers from '../../../redux/reducer';
import { transformPendingAppointments } from '../../../services/appointment/transformers';
import { transformFacility } from '../../../services/location/transformers';

const appointment = {
  id: '1234',
  ...getVARequestMock().attributes,
  typeOfCareId: '323',
  status: 'Submitted',
  appointmentType: 'Primary care',
  optionDate1: moment()
    .add(3, 'days')
    .format('MM/DD/YYYY'),
  optionTime1: 'AM',
  optionDate2: moment()
    .add(4, 'days')
    .format('MM/DD/YYYY'),
  optionTime2: 'AM',
  optionDate3: moment()
    .add(5, 'days')
    .format('MM/DD/YYYY'),
  optionTime3: 'PM',
  facility: {
    ...getVARequestMock().attributes.facility,
    facilityCode: '983GC',
  },
  bestTimetoCall: ['Morning'],
  purposeOfVisit: 'New Issue',
  email: 'patient.test@va.gov',
  phoneNumber: '(703) 652-0000',
  friendlyLocationName: 'Some facility name',
};

const ccAppointmentRequest = {
  id: '1234',

  ...getCCRequestMock().attributes,

  appointmentType: 'Audiology (hearing aid support)',
  bestTimetoCall: ['Morning'],

  ccAppointmentRequest: {
    preferredProviders: [
      {
        address: {
          city: 'Orlando',
          state: 'FL',
          street: '123 Main Street',
          zipCode: '32826',
        },
        practiceName: 'Atlantic Medical Care',
      },
    ],
  },

  email: 'joe.blow@va.gov',
  optionDate1: '02/21/2020',
  optionTime1: 'AM',
  purposeOfVisit: 'routine-follow-up',
  typeOfCareId: 'CCAUDHEAR',
};

const facility = {
  ...getVAFacilityMock().attributes,
  id: 'vha_442GC',
  uniqueId: '442GC',
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
};
const var983GC = transformFacility(facility);

let initialState = {
  appointments: {
    appointmentDetails: {},
    appointmentDetailsStatus: FETCH_STATUS.notStarted,
    requestMessages: {},
    requestMessagesStatus: FETCH_STATUS.notStarted,
    pendingStatus: FETCH_STATUS.succeeded,
    facilityData: {
      '983GC': var983GC,
    },
  },
};

describe('VAOS <RequestedAppointmentDetailsPage>', () => {
  beforeEach(() => {
    mockFetch();
    const message = getMessageMock();
    message.attributes = {
      ...message.attributes,
      messageText: 'A message from the patient',
    };

    setFetchJSONResponse(
      global.fetch.withArgs(
        `${environment.API_URL}/vaos/v0/appointment_requests/1234/messages`,
      ),
      { data: [message] },
    );
    MockDate.set(getTimezoneTestDate());
  });
  afterEach(() => {
    resetFetch();
    MockDate.reset();
  });

  it('should render VA request details', async () => {
    const pending = transformPendingAppointments([appointment]);
    initialState = {
      ...initialState,
      appointments: {
        ...initialState.appointments,
        pending,
      },
    };

    const screen = renderWithStoreAndRouter(
      <Route path="/requests/:id">
        <RequestedAppointmentDetailsPage />
      </Route>,
      {
        initialState,
        reducers,
        path: '/requests/1234',
      },
    );

    expect(await screen.findByText('Pending primary care appointment')).to.be
      .ok;
    expect(screen.baseElement).to.contain.text('VA Appointment');
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('2360 East Pershing Boulevard');
    expect(screen.baseElement).to.contain.text('Cheyenne, WY 82001-5356');
    expect(screen.baseElement).to.contain.text('Main phone:');
    expect(screen.baseElement).to.contain.text('307-778-7550');
    expect(screen.baseElement).to.contain.text('Preferred date and time');
    expect(screen.baseElement).to.contain.text(
      `${moment(appointment.optionDate1).format(
        'ddd, MMMM D, YYYY',
      )} in the morning`,
    );
    expect(screen.baseElement).to.contain.text(
      `${moment(appointment.optionDate2).format(
        'ddd, MMMM D, YYYY',
      )} in the morning`,
    );
    expect(screen.baseElement).to.contain.text(
      `${moment(appointment.optionDate3).format(
        'ddd, MMMM D, YYYY',
      )} in the afternoon`,
    );
    expect(screen.baseElement).to.contain.text('New issue');

    expect(await screen.findByText(/A message from the patient/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text('patient.test@va.gov');
    expect(screen.baseElement).to.contain.text('(703) 652-0000');
    expect(screen.baseElement).to.contain.text('Call morning');
  });

  it('should go back to requests page when clicking top link', async () => {
    const pending = transformPendingAppointments([appointment]);
    initialState = {
      ...initialState,
      appointments: {
        ...initialState.appointments,
        pending,
      },
    };

    const screen = renderWithStoreAndRouter(
      <Route path="/requests/:id">
        <RequestedAppointmentDetailsPage />
      </Route>,
      {
        initialState,
        reducers,
        path: '/requests/1234',
      },
    );

    expect(await screen.findByText('Pending primary care appointment')).to.be
      .ok;
    fireEvent.click(screen.getByText('Manage appointments'));
    expect(screen.history.push.lastCall.args[0]).to.equal('/requested');
  });

  it('should go back to requests page when clicking go back to appointments button', async () => {
    const pending = transformPendingAppointments([appointment]);
    initialState = {
      ...initialState,
      appointments: {
        ...initialState.appointments,
        pending,
      },
    };

    const screen = renderWithStoreAndRouter(
      <Route path="/requests/:id">
        <RequestedAppointmentDetailsPage />
      </Route>,
      {
        initialState,
        reducers,
        path: '/requests/1234',
      },
    );

    expect(await screen.findByText('Pending primary care appointment')).to.be
      .ok;
    fireEvent.click(await screen.findByText(/Go back to appointments/));
    expect(screen.history.push.lastCall.args[0]).to.equal('/requested');
  });

  it('should render CC request details', async () => {
    const pending = transformPendingAppointments([ccAppointmentRequest]);
    initialState = {
      ...initialState,
      appointments: {
        ...initialState.appointments,
        pending,
      },
    };

    const screen = renderWithStoreAndRouter(
      <Route path="/requests/:id">
        <RequestedAppointmentDetailsPage />
      </Route>,
      {
        initialState,
        reducers,
        path: '/requests/1234',
      },
    );

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Pending audiology (hearing aid support) appointment',
      }),
    ).to.be.ok;

    // Should be able to cancel appointment
    expect(screen.getByRole('button', { name: /Cancel request/ })).to.be.ok;
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Preferred community care provider',
      }),
    ).to.be.ok;
    expect(screen.getByText('Atlantic Medical Care')).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Preferred date and time',
      }),
    ).to.be.ok;
    expect(screen.getByText('Fri, February 21, 2020 in the morning')).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Follow-up/Routine',
      }),
    ).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Your contact details',
      }),
    ).to.be.ok;
    expect(screen.getByText('joe.blow@va.gov')).to.be.ok;
    expect(screen.getByText('Call morning')).to.be.ok;

    expect(screen.queryByText('Community Care')).not.to.exist;
    expect(screen.queryByText('Reason for appointment')).not.to.exist;
  });
});
