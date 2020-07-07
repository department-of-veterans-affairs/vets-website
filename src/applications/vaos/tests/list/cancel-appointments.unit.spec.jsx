import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import environment from 'platform/utilities/environment';
import {
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';
import {
  getVARequestMock,
  getVideoAppointmentMock,
  getVAAppointmentMock,
  getCCAppointmentMock,
  getVAFacilityMock,
  getCancelReasonMock,
} from '../mocks/v0';
import {
  mockAppointmentInfo,
  mockFacilitesFetch,
  mockVACancelFetches,
} from '../mocks/helpers';

import reducers from '../../reducers';
import FutureAppointmentsList from '../../components/FutureAppointmentsList';
import AppointmentsPage from '../../containers/AppointmentsPage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS integration appointment cancellation:', () => {
  it('video appointments should display modal with facility information', async () => {
    const appointment = getVideoAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: null,
      facilityId: '983',
      startDate: moment()
        .add(1, 'days')
        .format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: moment()
        .add(1, 'days')
        .format(),
      status: { description: 'F', code: 'FUTURE' },
    };
    mockAppointmentInfo({
      va: [appointment],
    });
    const facility = {
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
    };
    mockFacilitesFetch('vha_442', [facility]);

    const {
      getByRole,
      getByText,
      findAllByText,
      findByText,
    } = renderInReduxProvider(
      <AppointmentsPage>
        <FutureAppointmentsList />
      </AppointmentsPage>,
      {
        initialState,
        reducers,
      },
    );

    await findAllByText(/va video connect/i);

    fireEvent.click(getByText(/cancel appointment/i));

    await findByText(/VA Video Connect appointments can’t be canceled online/i);
    const modal = getByRole('alertdialog');

    expect(modal).to.contain.text('Cheyenne VA Medical Center');
    expect(modal).to.contain.text('307-778-7550');
  });

  it('community care appointments should display modal with provider information', async () => {
    const appointmentTime = moment().add(1, 'days');
    const appointment = getCCAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      appointmentTime: appointmentTime.format('MM/DD/YYYY HH:mm:ss'),
      timeZone: '-05:00 EST',
      address: {
        street: '123 Big Sky st',
        city: 'Bozeman',
        state: 'MT',
        zipCode: '59715',
      },
      name: { firstName: 'Jane', lastName: 'Doctor' },
      providerPractice: 'Big sky medical',
      providerPhone: '4065555555',
    };

    mockAppointmentInfo({ cc: [appointment] });

    const {
      getByText,
      getByRole,
      findAllByText,
      findByText,
      queryByRole,
    } = renderInReduxProvider(
      <AppointmentsPage>
        <FutureAppointmentsList />
      </AppointmentsPage>,
      {
        initialState,
        reducers,
      },
    );

    await findAllByText(/community care appointment/i);

    fireEvent.click(getByText(/cancel appointment/i));

    await findByText(/Community Care appointments can’t be canceled online/i);

    const modal = getByRole('alertdialog');

    expect(modal).to.contain.text('Big sky medical');
    expect(modal).to.contain.text('Jane Doctor');
    expect(modal).to.contain.text('4065555555');

    fireEvent.click(getByText(/OK/i));

    expect(queryByRole('alertdialog')).to.not.be.ok;
  });

  it('va appointments should be cancelled', async () => {
    const appointment = getVAAppointmentMock();
    const appointmentTime = moment();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: appointmentTime.format(),
      clinicId: '308',
      clinicFriendlyName: 'C&P BEV AUDIO FTC1',
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';
    appointment.attributes.vdsAppointments[0].clinic = {
      ...appointment.attributes.vdsAppointments[0].clinic,
      name: 'clinic name',
    };

    mockAppointmentInfo({ va: [appointment] });
    const cancelReason = getCancelReasonMock();
    cancelReason.attributes = {
      ...cancelReason.attributes,
      number: '5',
    };
    mockVACancelFetches('983', [cancelReason]);

    const {
      getByText,
      findByRole,
      baseElement,
      findByText,
      queryByRole,
    } = renderInReduxProvider(
      <AppointmentsPage>
        <FutureAppointmentsList />
      </AppointmentsPage>,
      {
        initialState,
        reducers,
      },
    );

    await findByText(/cancel appointment/i);
    expect(baseElement).not.to.contain.text('Canceled');

    fireEvent.click(getByText(/cancel appointment/i));

    await findByRole('alertdialog');

    fireEvent.click(getByText(/yes, cancel this appointment/i));

    await findByText(/your appointment has been canceled/i);

    const cancelData = JSON.parse(
      global.fetch
        .getCalls()
        .find(call => call.args[0].includes('appointments/cancel')).args[1]
        .body,
    );

    expect(cancelData).to.deep.equal({
      appointmentTime: appointmentTime
        .tz('America/Denver')
        .format('MM/DD/YYYY HH:mm:ss'),
      cancelReason: '5',
      cancelCode: 'PC',
      clinicName: 'clinic name',
      clinicId: '308',
      facilityId: '983',
      remarks: '',
    });

    fireEvent.click(getByText(/continue/i));

    expect(queryByRole('alertdialog')).to.not.be.ok;
    expect(baseElement).to.contain.text('Canceled');
  });

  it('should display error when cancel fails', async () => {
    const appointment = getVAAppointmentMock();
    const appointmentTime = moment();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: appointmentTime.format(),
      clinicId: '308',
      clinicFriendlyName: 'C&P BEV AUDIO FTC1',
      facilityId: '983',
      sta6aid: '983',
    };
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';
    appointment.attributes.vdsAppointments[0].clinic = {
      ...appointment.attributes.vdsAppointments[0].clinic,
      name: 'clinic name',
    };

    mockAppointmentInfo({ va: [appointment] });
    const facility = {
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
    };
    mockFacilitesFetch('vha_442', [facility]);
    const cancelReason = getCancelReasonMock();
    cancelReason.attributes = {
      ...cancelReason.attributes,
      number: '5',
    };
    mockVACancelFetches('983', [cancelReason]);
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${environment.API_URL}/vaos/v0/appointments/cancel`,
      ),
      { data: { errors: [] } },
    );

    const {
      getByText,
      findByRole,
      baseElement,
      findByText,
      queryByRole,
      getByRole,
    } = renderInReduxProvider(
      <AppointmentsPage>
        <FutureAppointmentsList />
      </AppointmentsPage>,
      {
        initialState,
        reducers,
      },
    );

    await findByText(/cancel appointment/i);
    expect(baseElement).not.to.contain.text('Canceled');

    fireEvent.click(getByText(/cancel appointment/i));

    await findByRole('alertdialog');

    fireEvent.click(getByText(/yes, cancel this appointment/i));

    await findByText(/We couldn’t cancel your appointment/i);

    const modal = getByRole('alertdialog');
    expect(modal).to.contain.text('Something went wrong');
    expect(modal).to.contain.text('Cheyenne VA Medical Center');
    expect(modal).to.contain.text('2360 East Pershing Boulevard');
    expect(modal).to.contain.text('Cheyenne, WY 82001-5356');
    expect(modal).to.contain.text('307-778-7550');

    fireEvent.click(modal.querySelector('button'));

    expect(queryByRole('alertdialog')).to.not.be.ok;
    expect(baseElement).to.not.contain.text('Canceled');
  });

  it("should show couldn't cancel message", async () => {
    const appointment = getVAAppointmentMock();
    const appointmentTime = moment();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: appointmentTime.format(),
      clinicId: '308',
      clinicFriendlyName: 'C&P BEV AUDIO FTC1',
      facilityId: '983',
      sta6aid: '983',
    };
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';
    appointment.attributes.vdsAppointments[0].clinic = {
      ...appointment.attributes.vdsAppointments[0].clinic,
      name: 'clinic name',
    };

    mockAppointmentInfo({ va: [appointment] });
    const facility = {
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
    };
    mockFacilitesFetch('vha_442', [facility]);
    const cancelReason = getCancelReasonMock();
    cancelReason.attributes = {
      ...cancelReason.attributes,
      number: '5',
    };
    mockVACancelFetches('983', [cancelReason]);
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${environment.API_URL}/vaos/v0/appointments/cancel`,
      ),
      {
        errors: [
          {
            code: 'VAOS_400',
          },
        ],
      },
    );

    const {
      getByText,
      findByRole,
      baseElement,
      findByText,
      queryByRole,
      getByRole,
    } = renderInReduxProvider(
      <AppointmentsPage>
        <FutureAppointmentsList />
      </AppointmentsPage>,
      {
        initialState,
        reducers,
      },
    );

    await findByText(/cancel appointment/i);
    expect(baseElement).not.to.contain.text('Canceled');

    fireEvent.click(getByText(/cancel appointment/i));

    await findByRole('alertdialog');

    fireEvent.click(getByText(/yes, cancel this appointment/i));

    await findByText(/We couldn’t cancel your appointment/i);

    const modal = getByRole('alertdialog');
    expect(modal).to.contain.text(
      'You can’t cancel your appointment on the VA appointments tool',
    );
  });

  it('pending appointments should be cancelled', async () => {
    const appointment = getVARequestMock();
    appointment.id = 'test_id';
    appointment.attributes = {
      ...appointment.attributes,
      status: 'Submitted',
      appointmentType: 'Primary care',
      optionDate1: moment()
        .add(3, 'days')
        .format('MM/DD/YYYY'),
      optionTime1: 'AM',
      facility: {
        ...appointment.facility,
        facilityCode: '983GC',
      },
      friendlyLocationName: 'Some facility name',
    };
    mockAppointmentInfo({ requests: [appointment] });
    setFetchJSONResponse(
      global.fetch.withArgs(
        `${environment.API_URL}/vaos/v0/appointment_requests/test_id`,
      ),
      {
        data: {
          ...appointment,
          attributes: {
            ...appointment.attributes,
            status: 'Cancelled',
          },
        },
      },
    );

    const {
      getByText,
      findByRole,
      baseElement,
      findByText,
      queryByRole,
    } = renderInReduxProvider(
      <AppointmentsPage>
        <FutureAppointmentsList />
      </AppointmentsPage>,
      {
        initialState,
        reducers,
      },
    );

    await findByText(/cancel appointment/i);
    expect(baseElement).not.to.contain.text('Canceled');

    fireEvent.click(getByText(/cancel appointment/i));

    await findByRole('alertdialog');

    fireEvent.click(getByText(/yes, cancel this appointment/i));

    await findByText(/your appointment has been canceled/i);

    const cancelData = JSON.parse(
      global.fetch
        .getCalls()
        .find(call => call.args[0].includes('appointment_requests/test_id'))
        .args[1].body,
    );

    expect(cancelData).to.deep.equal({
      ...appointment.attributes,
      id: 'test_id',
      appointmentRequestDetailCode: ['DETCODE8'],
      status: 'Cancelled',
    });

    fireEvent.click(getByText(/continue/i));

    expect(queryByRole('alertdialog')).to.not.be.ok;
    expect(baseElement).to.contain.text('Canceled');
  });
});
