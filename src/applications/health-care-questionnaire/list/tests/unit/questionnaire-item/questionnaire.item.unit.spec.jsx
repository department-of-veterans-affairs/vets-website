import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import QuestionnaireItem from '../../../questionnaire-list/components/QuestionnaireItem';

describe('health care questionnaire list - display a questionnaire item', () => {
  it('appointment information', () => {
    const name = 'Magic Kingdom';
    const data = {
      appointment: {
        id: '195bc02c0518870fc6b1e302cfc326b59',
        type: 'va_appointments',
        attributes: {
          startDate: '2020-08-26T15:00:00Z',
          sta6aid: '983',
          clinicId: '848',
          clinicFriendlyName: 'CHY PC VAR2',
          facilityId: '983',
          communityCare: false,
          patientIcn: '1013124304V115761',
          vdsAppointments: [
            {
              bookingNotes:
                'Follow-up/Routine: testing reason for visit field availability',
              appointmentLength: '20',
              id: '848;20200826.090000',
              appointmentTime: '2021-02-23T15:00:00Z',
              clinic: {
                name: 'CHY PC VAR2',
                askForCheckIn: false,
                facilityCode: '983',
                facility: {
                  displayName: name,
                },
                stopCode: '502',
              },
              type: 'REGULAR',
              currentStatus: 'FUTURE',
            },
          ],
          vvsAppointments: [],
        },
      },
      questionnaire: [
        {
          id: 'questionnnaire-ABC-123',
          questionnaireResponse: {},
        },
      ],
    };
    const component = mount(<QuestionnaireItem data={data} />);
    expect(component.find('[data-testid="facility-name"]').text()).to.equal(
      name,
    );

    expect(component.find('[data-testid="appointment-time"]').text()).to.equal(
      'February 23, 2021',
    );

    component.unmount();
  });

  it('due date is shown', () => {
    const name = 'Magic Kingdom';
    const data = {
      appointment: {
        id: '195bc02c0518870fc6b1e302cfc326b59',
        type: 'va_appointments',
        attributes: {
          startDate: '2020-08-26T15:00:00Z',
          sta6aid: '983',
          clinicId: '848',
          clinicFriendlyName: 'CHY PC VAR2',
          facilityId: '983',
          communityCare: false,
          patientIcn: '1013124304V115761',
          vdsAppointments: [
            {
              bookingNotes:
                'Follow-up/Routine: testing reason for visit field availability',
              appointmentLength: '20',
              id: '848;20200826.090000',
              appointmentTime: '2021-02-23T15:00:00Z',
              clinic: {
                name: 'CHY PC VAR2',
                askForCheckIn: false,
                facilityCode: '983',
                facility: {
                  displayName: name,
                },
                stopCode: '502',
              },
              type: 'REGULAR',
              currentStatus: 'FUTURE',
            },
          ],
          vvsAppointments: [],
        },
      },
      questionnaire: [
        {
          id: 'questionnnaire-ABC-123',
          questionnaireResponse: {},
        },
      ],
    };

    const DueDate = () => <p data-testid="due-date">some data</p>;
    const component = mount(
      <QuestionnaireItem data={data} DueDate={DueDate} />,
    );
    expect(component.find('[data-testid="due-date"]').exists()).to.be.true;

    component.unmount();
  });
  it('Actions are shown', () => {
    const name = 'Magic Kingdom';
    const data = {
      appointment: {
        id: '195bc02c0518870fc6b1e302cfc326b59',
        type: 'va_appointments',
        attributes: {
          startDate: '2020-08-26T15:00:00Z',
          sta6aid: '983',
          clinicId: '848',
          clinicFriendlyName: 'CHY PC VAR2',
          facilityId: '983',
          communityCare: false,
          patientIcn: '1013124304V115761',
          vdsAppointments: [
            {
              bookingNotes:
                'Follow-up/Routine: testing reason for visit field availability',
              appointmentLength: '20',
              id: '848;20200826.090000',
              appointmentTime: '2021-02-23T15:00:00Z',
              clinic: {
                name: 'CHY PC VAR2',
                askForCheckIn: false,
                facilityCode: '983',
                facility: {
                  displayName: name,
                },
                stopCode: '502',
              },
              type: 'REGULAR',
              currentStatus: 'FUTURE',
            },
          ],
          vvsAppointments: [],
        },
      },
      questionnaire: [
        {
          id: 'questionnnaire-ABC-123',
          questionnaireResponse: {},
        },
      ],
    };

    const Actions = () => <p data-testid="Actions">some data</p>;

    const component = mount(
      <QuestionnaireItem data={data} Actions={Actions} />,
    );
    expect(component.find('[data-testid="Actions"]').exists()).to.be.true;

    component.unmount();
  });
  it('Appointment Type is shown based on clinic', () => {
    const name = 'Magic Kingdom';
    const data = {
      appointment: {
        id: '195bc02c0518870fc6b1e302cfc326b59',
        type: 'va_appointments',
        attributes: {
          startDate: '2020-08-26T15:00:00Z',
          sta6aid: '983',
          clinicId: '848',
          clinicFriendlyName: 'CHY PC VAR2',
          facilityId: '983',
          communityCare: false,
          patientIcn: '1013124304V115761',
          vdsAppointments: [
            {
              bookingNotes:
                'Follow-up/Routine: testing reason for visit field availability',
              appointmentLength: '20',
              id: '848;20200826.090000',
              appointmentTime: '2021-02-23T15:00:00Z',
              clinic: {
                name: 'CHY PC VAR2',
                askForCheckIn: false,
                facilityCode: '983',
                facility: {
                  displayName: name,
                },
                stopCode: '502',
              },
              type: 'REGULAR',
              currentStatus: 'FUTURE',
            },
          ],
          vvsAppointments: [],
        },
      },
      questionnaire: [
        {
          id: 'questionnnaire-ABC-123',
          questionnaireResponse: {},
        },
      ],
    };

    const Actions = () => <p data-testid="Actions">some data</p>;

    const component = mount(
      <QuestionnaireItem data={data} Actions={Actions} />,
    );
    expect(component.find('[data-testid="appointment-type-header"]').exists())
      .to.be.true;
    expect(
      component.find('[data-testid="appointment-type-header"]').text(),
    ).to.equal('Mental health questionnaire');

    component.unmount();
  });
});
