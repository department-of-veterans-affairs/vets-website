import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import moment from 'moment';
import { FETCH_STATUS } from '../../utils/constants';
import { PastAppointmentsList } from '../../components/PastAppointmentsList';
import { getPastAppointmentDateRangeOptions } from '../../utils/appointment';

describe('VAOS <PastAppointmentsList>', () => {
  const dateRangeOptions = getPastAppointmentDateRangeOptions(
    moment('2020-02-02'),
  );

  const appointments = {
    pastStatus: FETCH_STATUS.succeeded,
    pastSelectedIndex: 0,
    past: [
      {
        startDate: '2019-12-11T15:00:00Z',
        clinicId: '455',
        facilityId: '983',
        patientIcn: '1012845331V153043',
        vdsAppointments: [
          {
            appointmentLength: '60',
            appointmentTime: '2019-12-11T15:00:00Z',
            clinic: {
              name: 'CASSIDY PC',
              askForCheckIn: false,
              facilityCode: '983',
            },
            patientId: '7216691',
            type: 'REGULAR',
            currentStatus: 'NO ACTION TAKEN/TODAY',
          },
        ],
      },
      {
        appointmentRequestId: '8a4885896a22f88f016a2c8834b1005d',
        patientIdentifier: {
          uniqueId: '1012845331V153043',
          assigningAuthority: 'ICN',
        },
        distanceEligibleConfirmed: true,
        name: {
          firstName: '',
          lastName: '',
        },
        providerPractice: 'Atlantic Medical Care',
        providerPhone: '(407) 555-1212',
        address: {
          street: '123 Main Street',
          city: 'Orlando',
          state: 'FL',
          zipCode: '32826',
        },
        instructionsToVeteran: 'Please arrive 15 minutes ahead of appointment.',
        appointmentTime: '11/25/2019 13:30:00',
        timeZone: '-04:00 EDT',
      },
      {
        dataIdentifier: {
          uniqueId: '8a48912a6c2409b9016c9a9afff101ee',
          systemId: 'var',
        },
        patientIdentifier: {
          uniqueId: '1012845331V153043',
          assigningAuthority: 'ICN',
        },
        surrogateIdentifier: {},
        lastUpdatedDate: '12/16/2019 13:14:16',
        optionDate1: '11/01/2019',
        optionTime1: 'AM',
        optionDate2: 'No Date Selected',
        optionTime2: 'No Time Selected',
        optionDate3: 'No Date Selected',
        optionTime3: 'No Time Selected',
        status: 'Cancelled',
        appointmentType: 'Outpatient Mental Health',
        visitType: 'Office Visit',
        facility: {
          name: 'CHYSHR-Cheyenne VA Medical Center',
          facilityCode: '983',
          state: 'WY',
          city: 'Cheyenne',
          parentSiteCode: '983',
          objectType: 'Facility',
          link: [],
        },
        email: 'samatha.girla@va.gov',
        textMessagingAllowed: false,
        phoneNumber: '(703) 652-0000',
        purposeOfVisit: 'New Issue',
        providerId: '0',
        secondRequest: false,
        secondRequestSubmitted: false,
        patient: {
          displayName: 'MORRISON, JUDY',
          firstName: 'JUDY',
          lastName: 'MORRISON',
          dateOfBirth: 'Apr 01, 1953',
          patientIdentifier: {
            uniqueId: '1259897978',
          },
          ssn: '796061976',
          inpatient: false,
          textMessagingAllowed: false,
          id: '1259897978',
          objectType: 'Patient',
          link: [],
        },
        bestTimetoCall: ['Morning'],
        appointmentRequestDetailCode: [
          {
            appointmentRequestDetailCodeId: '8a48e78f6c8bfe02016c9bda173c005c',
            createdDate: '12/16/2019 13:14:16',
            detailCode: {
              code: 'DETCODE22',
              providerMessage: 'Cancelled - Cancelled at Veteran Request',
              veteranMessage:
                'Your appointment request has been cancelled at your request.',
              objectType: 'VARDetailCode',
              link: [],
            },
            userId: '1013004612',
            objectType: 'VARAppointmentRequestDetailCode',
            link: [],
          },
        ],
        hasVeteranNewMessage: true,
        hasProviderNewMessage: false,
        providerSeenAppointmentRequest: true,
        requestedPhoneCall: false,
        typeOfCareId: '502',
        friendlyLocationName: 'CHYSHR-Cheyenne VA Medical Center',
        patientId: '1259897978',
        appointmentRequestId: '8a48912a6c2409b9016c9a9afff101ee',
        date: '2019-08-16T07:25:44.000+0000',
        assigningAuthority: 'ICN',
        uniqueId: '8a48912a6c2409b9016c9a9afff101ee',
        systemId: 'var',
        objectType: 'VARAppointmentRequest',
        createdDate: '12/16/2019 07:25:44',
      },
    ],
    systemClinicToFacilityMap: {
      '983_455': {},
    },
  };

  it('should display loading indicator', () => {
    const defaultProps = {
      appointments: {
        past: [],
        pastStatus: FETCH_STATUS.loading,
        pastSelectedIndex: 0,
        facilityData: {},
      },
    };

    const tree = shallow(
      <PastAppointmentsList
        {...defaultProps}
        location={location}
        showPastAppointments
      />,
    );
    expect(tree.find('LoadingIndicator').length).to.equal(1);
    tree.unmount();
  });

  it('should fetch past appointments', () => {
    const defaultProps = {
      appointments: {
        past: [],
        pastStatus: FETCH_STATUS.notStarted,
        pastSelectedIndex: 0,
        facilityData: {},
      },
    };

    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <PastAppointmentsList
        {...defaultProps}
        dateRangeOptions={dateRangeOptions}
        location={location}
        showPastAppointments
        fetchPastAppointments={fetchPastAppointments}
      />,
    );
    expect(fetchPastAppointments.called).to.be.true;
    expect(fetchPastAppointments.firstCall.args[0]).to.equal(
      tree.state('selectedDateRange').startDate,
    );
    expect(fetchPastAppointments.firstCall.args[1]).to.equal(
      tree.state('selectedDateRange').endDate,
    );
    tree.unmount();
  });

  it('should render 2 appointments', () => {
    const tree = shallow(
      <PastAppointmentsList
        appointments={appointments}
        showPastAppointments
        pastSelectedIndex={0}
      />,
    );

    expect(tree.find('ConfirmedAppointmentListItem').length).to.equal(2);
    expect(
      tree
        .find('ConfirmedAppointmentListItem')
        .first()
        .props().facility,
    ).to.equal(appointments.systemClinicToFacilityMap['983_455']);

    tree.unmount();
  });

  it('should render date range dropdown', () => {
    const tree = shallow(
      <PastAppointmentsList appointments={appointments} showPastAppointments />,
    );

    expect(tree.find('PastAppointmentsDateDropdown').exists()).to.be.true;
    tree.unmount();
  });

  it('should display AlertBox if fetch failed', () => {
    const defaultProps = {
      appointments: {
        past: [{}],
        pastStatus: FETCH_STATUS.failed,
        pastSelectedIndex: 0,
      },
    };

    const tree = shallow(
      <PastAppointmentsList
        {...defaultProps}
        location={location}
        showPastAppointments
      />,
    );

    expect(tree.find('AlertBox').exists()).to.be.true;
    tree.unmount();
  });

  it('should display no appointments message if no appointments', () => {
    const defaultProps = {
      appointments: {
        past: [],
        pastStatus: FETCH_STATUS.succeeded,
        pastSelectedIndex: 0,
      },
    };

    const tree = shallow(
      <PastAppointmentsList
        {...defaultProps}
        location={location}
        showPastAppointments
      />,
    );

    expect(tree.find('h4').text()).to.equal(
      'You don’t have any appointments in the selected date range',
    );
    tree.unmount();
  });

  it('should fetch past on past dropdown change', () => {
    const defaultProps = {
      appointments: {
        past: [],
        pastStatus: FETCH_STATUS.notStarted,
        pastSelectedIndex: 0,
      },
    };

    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <PastAppointmentsList
        {...defaultProps}
        fetchPastAppointments={fetchPastAppointments}
        showPastAppointments
      />,
    );

    const instance = tree.instance();
    instance.onDateRangeChange({ target: { value: 1 } });
    expect(fetchPastAppointments.callCount).to.equal(2);
    tree.unmount();
  });

  it('should redirect to future if showPastAppointments is false', () => {
    const defaultProps = {
      appointments: {
        past: [],
        pastStatus: FETCH_STATUS.notStarted,
        pastSelectedIndex: 0,
      },
      router: {
        push: sinon.spy(),
      },
    };
    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <PastAppointmentsList
        {...defaultProps}
        fetchPastAppointments={fetchPastAppointments}
      />,
    );

    expect(defaultProps.router.push.called).to.be.true;
    expect(defaultProps.router.push.firstCall.args[0]).to.equal('/');
    expect(fetchPastAppointments.called).to.be.false;
    tree.unmount();
  });
});
