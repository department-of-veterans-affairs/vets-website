import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import QuestionnaireItem from '../../../questionnaire-list/components/QuestionnaireItem';

describe('health care questionnaire list - display a questionnaire item', () => {
  it('appointment information', () => {
    const facilityName = 'Magic Kingdom';
    const clinicName = 'Tomorrowland';
    const data = {
      appointment: {
        id: '195bc02c0518870fc6b1e302cfc326b59',
        type: 'va_appointments',
        attributes: {
          startDate: '2020-08-26T15:00:00Z',
          sta6aid: '983',
          clinicId: '848',
          clinicFriendlyName: clinicName,
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
                  displayName: facilityName,
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
    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.contain(facilityName);
    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.contain(clinicName);
    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.equal(`for your appointment at ${clinicName}, ${facilityName}`);

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
  it('extra text is shown', () => {
    const facilityName = 'Magic Kingdom';
    const clinicName = 'Tomorrowland';
    const data = {
      appointment: {
        id: '195bc02c0518870fc6b1e302cfc326b59',
        type: 'va_appointments',
        attributes: {
          startDate: '2020-08-26T15:00:00Z',
          sta6aid: '983',
          clinicId: '848',
          clinicFriendlyName: clinicName,
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
                  displayName: facilityName,
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
    const extra =
      'This is my cool extra message for the that cool cat reading this';
    const component = mount(
      <QuestionnaireItem data={data} extraText={extra} />,
    );
    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.contain(extra);

    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.equal(
      'for your appointment at Tomorrowland, Magic Kingdom. This is my cool extra message for the that cool cat reading this',
    );

    component.unmount();
  });
  it('canceled text is shown for cancelled appointments', () => {
    const facilityName = 'Magic Kingdom';
    const clinicName = 'Tomorrowland';
    const data = {
      appointment: {
        id: '195bc02c0518870fc6b1e302cfc326b59',
        type: 'va_appointments',
        attributes: {
          startDate: '2020-08-26T15:00:00Z',
          sta6aid: '983',
          clinicId: '848',
          clinicFriendlyName: clinicName,
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
                  displayName: facilityName,
                },
                stopCode: '502',
              },
              type: 'REGULAR',
              currentStatus: 'CANCELLED BY CLINIC',
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
    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.contain('canceled or rescheduled');

    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.equal(
      'for your canceled or rescheduled appointment at Tomorrowland, Magic Kingdom',
    );

    component.unmount();
  });
});
