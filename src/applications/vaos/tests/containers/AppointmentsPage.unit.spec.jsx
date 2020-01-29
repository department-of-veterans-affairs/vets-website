import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { FETCH_STATUS } from '../../utils/constants';

import { AppointmentsPage } from '../../containers/AppointmentsPage';

describe('VAOS <AppointmentsPage>', () => {
  it('should fetch future appointments', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.loading,
        facilityData: {},
      },
    };

    const fetchFutureAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentsPage
        fetchFutureAppointments={fetchFutureAppointments}
        {...defaultProps}
      />,
    );
    expect(fetchFutureAppointments.called).to.be.true;
    expect(tree.find('LoadingIndicator').length).to.equal(1);
    tree.unmount();
  });

  it('should render 3 appointments', () => {
    const appointments = {
      facilityData: {},
      futureStatus: FETCH_STATUS.succeeded,
      future: [
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
          instructionsToVeteran:
            'Please arrive 15 minutes ahead of appointment.',
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
              appointmentRequestDetailCodeId:
                '8a48e78f6c8bfe02016c9bda173c005c',
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

    const fetchFutureAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentsPage
        fetchFutureAppointments={fetchFutureAppointments}
        showScheduleButton
        appointments={appointments}
      />,
    );

    expect(tree.find('ConfirmedAppointmentListItem').length).to.equal(2);
    expect(
      tree
        .find('ConfirmedAppointmentListItem')
        .first()
        .props().facility,
    ).to.equal(appointments.systemClinicToFacilityMap['983_455']);
    expect(tree.find('AppointmentRequestListItem').length).to.equal(1);
    expect(tree.find('.usa-button').length).to.equal(1);

    tree.unmount();
  });

  it('document title should match h1 text', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.succeeded,
        facilityData: {},
      },
    };

    const fetchFutureAppointments = sinon.spy();
    const pageTitle = 'VA appointments';
    const tree = shallow(
      <AppointmentsPage
        fetchFutureAppointments={fetchFutureAppointments}
        {...defaultProps}
      />,
    );
    expect(fetchFutureAppointments.called).to.be.true;
    expect(tree.find('h1').text()).to.equal(pageTitle);
    expect(document.title).contain(pageTitle);
    tree.unmount();
  });
});
