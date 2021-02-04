import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import ToDoQuestionnaireItem from '../../../questionnaire-list/components/ToDoQuestionnaires/ToDoQuestionnaireItem';

describe('health care questionnaire list - display a questionnaire item', () => {
  it('basic information - canceled appointment', () => {
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
    const component = mount(<ToDoQuestionnaireItem data={data} />);
    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.equal(
      'for your canceled or rescheduled appointment at Tomorrowland, Magic Kingdom. You can access this questionnaire to copy answers for a rescheduled appointment.',
    );
    expect(component.find('button').text()).to.equal(
      'View and print questions',
    );
    expect(component.find('[data-testid="due-date"]').text()).to.contain(
      'Access until',
    );
    expect(component.find('[data-testid="due-by-timestamp"]').exists()).to.be
      .false;
    component.unmount();
  });
  it('basic information - future appointment', () => {
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
    const component = mount(<ToDoQuestionnaireItem data={data} />);
    expect(
      component.find('[data-testid="appointment-location"]').text(),
    ).to.equal('for your appointment at Tomorrowland, Magic Kingdom');
    expect(component.find('a').text()).to.equal('Answer questions');
    expect(component.find('[data-testid="due-date"]').text()).to.contain(
      'Complete by',
    );
    expect(component.find('[data-testid="due-by-timestamp"]').exists()).to.be
      .true;
    component.unmount();
  });
});
