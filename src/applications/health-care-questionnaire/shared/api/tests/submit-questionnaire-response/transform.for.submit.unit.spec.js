import { expect } from 'chai';

import { transformForSubmit } from '../../submit-questionnaire';

describe('health care questionnaire -- utils -- transform for submit --', () => {
  it('creates appropriate structure with  all data', () => {
    const formConfig = {};
    const form = {
      data: {
        'hidden:questionnaire': [
          {
            id: 'questionnaire-123',
            questionnaireResponse: {},
          },
        ],
        'hidden:appointment': {
          id: 'appointment-123',
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
                appointmentTime: '2021-03-26T15:00:00Z',
                clinic: {
                  name: 'CHY PC VAR2',
                  askForCheckIn: false,
                  facilityCode: '983',
                  facility: {
                    displayName: 'Awesome Facility',
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
        reasonForVisit: 'reasoning for visit',
        reasonForVisitDescription: 'reasoning for visit description',
        lifeEvents: 'This is my life event',
        questions: [
          { additionalQuestions: 'answer 1' },
          { additionalQuestions: 'answer 2' },
        ],
      },
    };
    const json = transformForSubmit(formConfig, form);
    expect(json).to.have.property('appointment');
    expect(json.appointment.id).to.equal('appointment-123');
    expect(json).to.have.property('questionnaire');
    expect(json.questionnaire.id).to.equal('questionnaire-123');

    expect(json).to.have.property('item');
    expect(json.item).to.be.an('array');
    expect(json.item.length).to.equal(4);

    // reason for visit
    expect(json.item[0].linkId).to.equal('01');
    expect(json.item[0].answer).to.be.an('array');
    expect(json.item[0].answer[0].valueString).to.be.equal(
      'reasoning for visit',
    );
    // reason for visit description
    expect(json.item[1].linkId).to.equal('02');
    expect(json.item[1].answer).to.be.an('array');
    expect(json.item[1].answer[0].valueString).to.be.equal(
      'reasoning for visit description',
    );

    // life event
    expect(json.item[2].linkId).to.equal('03');
    expect(json.item[2].answer).to.be.an('array');
    expect(json.item[2].answer[0].valueString).to.be.equal(
      'This is my life event',
    );

    // more questions
    // life event
    expect(json.item[3].linkId).to.equal('04');
    expect(json.item[3].answer).to.be.an('array');
    expect(json.item[3].answer.length).to.be.equal(2);
    expect(json.item[3].answer[0].valueString).to.be.equal('answer 1');
    expect(json.item[3].answer[1].valueString).to.be.equal('answer 2');
  });
  it('no additional questions', () => {
    const formConfig = {};
    const form = {
      data: {
        'hidden:fields': {
          appointmentId: 'appointment-123',
          questionnaireId: 'questionnaire-123',
        },
        reasonForVisit: 'reasoning for visit',
        reasonForVisitDescription: 'reasoning for visit description',
        lifeEvents: 'This is my life event',
        questions: undefined,
      },
    };
    const json = transformForSubmit(formConfig, form);

    expect(json).to.have.property('item');
    expect(json.item).to.be.an('array');
    expect(json.item.length).to.equal(4);

    // more questions
    // life event
    expect(json.item[3].linkId).to.equal('04');
    expect(json.item[3].answer).to.be.an('array');
    expect(json.item[3].answer.length).to.be.equal(0);
  });
  it('blank in additional questions should be filtered out', () => {
    const formConfig = {};
    const form = {
      data: {
        'hidden:fields': {
          appointmentId: 'appointment-123',
          questionnaireId: 'questionnaire-123',
        },
        reasonForVisit: 'reasoning for visit',
        reasonForVisitDescription: 'reasoning for visit description',
        lifeEvents: 'This is my life event',
        questions: [
          { additionalQuestions: 'answer 1' },
          { additionalQuestions: 'answer 2' },
          { additionalQuestions: '' },
        ],
      },
    };
    const json = transformForSubmit(formConfig, form);

    expect(json).to.have.property('item');
    expect(json.item).to.be.an('array');
    expect(json.item.length).to.equal(4);

    // more questions
    // life event
    expect(json.item[3].linkId).to.equal('04');
    expect(json.item[3].answer).to.be.an('array');
    expect(json.item[3].answer.length).to.be.equal(2);
  });
  it('minimal data is populated', () => {
    const formConfig = {};
    const form = {
      data: {
        'hidden:questionnaire': [
          {
            id: 'questionnaire-123',
            questionnaireResponse: {},
          },
        ],
        'hidden:appointment': {
          id: 'appointment-123',
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
                appointmentTime: '2021-03-26T15:00:00Z',
                clinic: {
                  name: 'CHY PC VAR2',
                  askForCheckIn: false,
                  facilityCode: '983',
                  facility: {
                    displayName: 'Awesome Facility',
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
        reasonForVisit: 'reasoning for visit',
        reasonForVisitDescription: 'reasoning for visit description',
        lifeEvents: undefined,
        questions: undefined,
      },
    };
    const json = transformForSubmit(formConfig, form);
    expect(json).to.have.property('appointment');
    expect(json.appointment.id).to.equal('appointment-123');
    expect(json).to.have.property('questionnaire');
    expect(json.questionnaire.id).to.equal('questionnaire-123');

    expect(json).to.have.property('item');
    expect(json.item).to.be.an('array');
    expect(json.item.length).to.equal(4);

    // reason for visit
    expect(json.item[0].linkId).to.equal('01');
    expect(json.item[0].answer).to.be.an('array');
    expect(json.item[0].answer[0].valueString).to.be.equal(
      'reasoning for visit',
    );
    // reason for visit description
    expect(json.item[1].linkId).to.equal('02');
    expect(json.item[1].answer).to.be.an('array');
    expect(json.item[1].answer[0].valueString).to.be.equal(
      'reasoning for visit description',
    );

    // life event
    expect(json.item[2].linkId).to.equal('03');
    expect(json.item[2].answer).to.be.an('array');
    expect(json.item[2].answer.length).to.be.equal(0);

    // more questions
    // life event
    expect(json.item[3].linkId).to.equal('04');
    expect(json.item[3].answer).to.be.an('array');
    expect(json.item[3].answer.length).to.be.equal(0);
  });
  it('missing all data', () => {
    const formConfig = {};
    const form = {
      data: {},
    };
    const json = transformForSubmit(formConfig, form);
    expect(json).to.have.property('appointment');
    expect(json).to.have.property('questionnaire');

    expect(json).to.have.property('item');
    expect(json.item).to.be.an('array');
    expect(json.item.length).to.equal(4);

    // reason for visit
    expect(json.item[0].linkId).to.equal('01');
    expect(json.item[0].answer).to.be.an('array');
    expect(json.item[0].answer.length).to.be.equal(0);

    // reason for visit description
    expect(json.item[1].linkId).to.equal('02');
    expect(json.item[1].answer).to.be.an('array');
    expect(json.item[1].answer.length).to.be.equal(0);

    // life event
    expect(json.item[2].linkId).to.equal('03');
    expect(json.item[2].answer).to.be.an('array');
    expect(json.item[2].answer.length).to.be.equal(0);

    // more questions
    // life event
    expect(json.item[3].linkId).to.equal('04');
    expect(json.item[3].answer).to.be.an('array');
    expect(json.item[3].answer.length).to.be.equal(0);
  });
});
