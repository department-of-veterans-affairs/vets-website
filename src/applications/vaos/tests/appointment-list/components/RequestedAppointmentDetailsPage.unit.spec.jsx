import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { Route } from 'react-router-dom';
import { fireEvent } from '@testing-library/react';

import RequestedAppointmentDetailsPage from '../../../appointment-list/components/RequestedAppointmentDetailsPage';
import { renderWithStoreAndRouter } from '../../mocks/setup';
import { getVAFacilityMock, getVARequestMock } from '../../mocks/v0';
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

const pending = transformPendingAppointments([appointment]);

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

const initialState = {
  appointments: {
    appointmentDetails: {},
    appointmentDetailsStatus: FETCH_STATUS.notStarted,
    pendingStatus: FETCH_STATUS.succeeded,
    pending,
    facilityData: {
      var983GC,
    },
  },
};

describe('VAOS <RequestedAppointmentDetailsPage>', () => {
  it('should render VA request details', async () => {
    const { findByText, baseElement } = renderWithStoreAndRouter(
      <Route path="/request/:id">
        <RequestedAppointmentDetailsPage />
      </Route>,
      {
        initialState,
        reducers,
        path: '/request/var1234',
      },
    );

    expect(await findByText('Pending primary care appointment')).to.be.ok;
    expect(baseElement).to.contain.text('VA Appointment');
    expect(baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(baseElement).to.contain.text('2360 East Pershing Boulevard');
    expect(baseElement).to.contain.text('Cheyenne, WY 82001-5356');
    expect(baseElement).to.contain.text('Main phone:');
    expect(baseElement).to.contain.text('307-778-7550');
    expect(baseElement).to.contain.text('Preferred date and time');
    expect(baseElement).to.contain.text(
      `${moment(appointment.optionDate1).format(
        'ddd, MMMM D, YYYY',
      )} in the morning`,
    );
    expect(baseElement).to.contain.text(
      `${moment(appointment.optionDate2).format(
        'ddd, MMMM D, YYYY',
      )} in the morning`,
    );
    expect(baseElement).to.contain.text(
      `${moment(appointment.optionDate3).format(
        'ddd, MMMM D, YYYY',
      )} in the afternoon`,
    );
    expect(baseElement).to.contain.text('New issue');
    expect(baseElement).to.contain.text('patient.test@va.gov');
    expect(baseElement).to.contain.text('(703) 652-0000');
    expect(baseElement).to.contain.text('Call morning');
  });

  it('should go back to requests page when clicking top link', async () => {
    const { findByText, getByText, history } = renderWithStoreAndRouter(
      <Route path="/request/:id">
        <RequestedAppointmentDetailsPage />
      </Route>,
      {
        initialState,
        reducers,
        path: '/request/var1234',
      },
    );

    expect(await findByText('Pending primary care appointment')).to.be.ok;
    fireEvent.click(getByText('Manage appointments'));
    expect(history.push.lastCall.args[0]).to.equal('/requested');
  });

  it('should go back to requests page when clicking go back to appointments button', async () => {
    const { findByText, history } = renderWithStoreAndRouter(
      <Route path="/request/:id">
        <RequestedAppointmentDetailsPage />
      </Route>,
      {
        initialState,
        reducers,
        path: '/request/var1234',
      },
    );

    expect(await findByText('Pending primary care appointment')).to.be.ok;
    fireEvent.click(await findByText(/Go back to appointments/));
    expect(history.push.lastCall.args[0]).to.equal('/requested');
  });
});
