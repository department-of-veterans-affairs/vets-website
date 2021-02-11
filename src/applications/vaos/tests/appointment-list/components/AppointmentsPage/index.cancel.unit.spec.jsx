import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent, waitFor } from '@testing-library/react';
import environment from 'platform/utilities/environment';
import {
  setFetchJSONResponse,
  setFetchJSONFailure,
  mockFetch,
  resetFetch,
} from 'platform/testing/unit/helpers';
import {
  getVARequestMock,
  getVideoAppointmentMock,
  getVAAppointmentMock,
  getCCAppointmentMock,
  getVAFacilityMock,
  getCancelReasonMock,
} from '../../../mocks/v0';
import {
  mockAppointmentInfo,
  mockFacilitiesFetch,
  mockVACancelFetches,
} from '../../../mocks/helpers';
import { renderWithStoreAndRouter } from '../../../mocks/setup';

import AppointmentsPage from '../../../../appointment-list/components/AppointmentsPage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

describe('VAOS integration appointment cancellation:', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());
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
    mockFacilitiesFetch('vha_442', [facility]);

    const { getByRole, findByText } = renderWithStoreAndRouter(
      <AppointmentsPage />,
      {
        initialState,
      },
    );

    fireEvent.click(await findByText(/cancel appointment/i));

    await findByText(/VA Video Connect appointments can’t be canceled online/i);
    const modal = getByRole('alertdialog');

    await findByText(/Cheyenne VA Medical Center/);
    expect(modal).to.contain.text('307-778-7550');
  });

  it('ATLAS video appointments should display modal with facility information', async () => {
    const appointment = getVideoAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: null,
      facilityId: '983',
      sta6aid: null,
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
      tasInfo: {
        address: {},
      },
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
    mockFacilitiesFetch('vha_442', [facility]);

    const { getByRole, findByText } = renderWithStoreAndRouter(
      <AppointmentsPage />,
      {
        initialState,
      },
    );

    await findByText(/at an ATLAS location/);
    fireEvent.click(await findByText(/cancel appointment/i));

    await findByText(/VA Video Connect appointments can’t be canceled online/i);
    const modal = getByRole('alertdialog');

    await findByText(/Cheyenne VA Medical Center/);
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
      findByText,
      queryByRole,
    } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    fireEvent.click(await findByText(/cancel appointment/i));

    await findByText(/Community Care appointments can’t be canceled online/i);

    const modal = getByRole('alertdialog');

    expect(modal).to.contain.text('Big sky medical');
    expect(modal).to.contain.text('Jane Doctor');
    expect(modal).to.contain.text('406-555-5555');

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
    } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

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
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });
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
    mockFacilitiesFetch('vha_442', [facility]);
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
    } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

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
    mockFacilitiesFetch('vha_442', [facility]);
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
      getByRole,
    } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

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
    } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    await findByText(/cancel request/i);
    expect(baseElement).not.to.contain.text('Canceled');

    fireEvent.click(getByText(/cancel request/i));

    await findByRole('alertdialog');

    fireEvent.click(getByText(/yes, cancel this request/i));

    await findByText(/your request has been canceled/i);

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
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });
  });

  it('va appointments at Cerner site should direct users to portal', async () => {
    const appointment = getVAAppointmentMock();
    const appointmentTime = moment();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: appointmentTime.format(),
      clinicId: '308',
      clinicFriendlyName: 'C&P BEV AUDIO FTC1',
      facilityId: '668',
      sta6aid: '668GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';

    mockAppointmentInfo({ va: [appointment] });

    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: {
        ...initialState,
        user: {
          profile: {
            facilities: [
              { facilityId: '983', isCerner: false },
              {
                facilityId: '668',
                isCerner: true,
                usesCernerAppointments: true,
              },
            ],
            isCernerPatient: true,
          },
        },
      },
    });

    await screen.findByText(/cancel appointment/i);
    expect(screen.baseElement).not.to.contain.text('Canceled');

    fireEvent.click(screen.getByText(/cancel appointment/i));

    await screen.findByRole('alertdialog');

    await screen.findByText(
      /You can’t cancel this appointment on the VA appointments tool/i,
    );

    sinon.spy(window, 'open');
    fireEvent.click(screen.getByText('Go to My VA Health'));
    await waitFor(() => expect(window.open.called).to.be.true);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).to.not.exist);
    window.open.restore();
  });
});
