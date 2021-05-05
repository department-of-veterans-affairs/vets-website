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
          status: 'booked',
          description: 'Scheduled Visit',
          start: '2021-11-23T08:00:00Z',
          end: '2021-11-23T08:30:00Z',
          minutesDuration: 30,
          created: '2020-11-02',
          comment: 'Follow-up/Routine:yes i have a reason',
          participant: [
            {
              actor: {
                reference:
                  'https://sandbox-api.va.gov/services/fhir/v0/r4/Location/I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
                display: 'LOM ACC TRAINING CLINIC',
              },
              status: 'accepted',
            },
            {
              actor: {
                reference:
                  'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/1008882029V851792',
                display: 'Mrs. Sheba703 Harris789',
              },
              status: 'accepted',
            },
          ],
          resourceType: 'Appointment',
        },
        'hidden:clinic': {
          id: 'I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
          identifier: [
            {
              use: 'usual',
              type: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                    code: 'FI',
                    display: 'Facility ID',
                  },
                ],
                text: 'Facility ID',
              },
              system:
                'https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-facility-identifier',
              value: 'vha_442',
            },
            {
              system:
                'https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-clinic-identifier',
              value: 'vha_442_3049',
            },
          ],
          status: 'active',
          name: 'LOM ACC TRAINING CLINIC',
          description: 'BLDG 146, RM W02',
          mode: 'instance',
          type: [
            {
              coding: [
                {
                  display: 'Primary Care',
                },
              ],
              text: 'Primary Care',
            },
          ],
          telecom: [
            {
              system: 'phone',
              value: '254-743-2867 x0002',
            },
          ],
          address: {
            text: '1901 VETERANS MEMORIAL DRIVE TEMPLE TEXAS 76504',
            line: ['1901 VETERANS MEMORIAL DRIVE'],
            city: 'TEMPLE',
            state: 'TEXAS',
            postalCode: '76504',
          },
          physicalType: {
            coding: [
              {
                display: 'BLDG 146, RM W02',
              },
            ],
            text: 'BLDG 146, RM W02',
          },
          managingOrganization: {
            reference:
              'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/I2-AKOTGEFSVKFJOPUKHIVJAH5VQU000000',
            display: 'CHEYENNE VA MEDICAL',
          },
          resourceType: 'Location',
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
    expect(json.questionnaire.title).to.equal('Primary care questionnaire');

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
        'hidden:questionnaire': [
          {
            id: 'questionnaire-123',
            questionnaireResponse: {},
          },
        ],
        'hidden:appointment': {
          id: 'appointment-123',
          status: 'booked',
          description: 'Scheduled Visit',
          start: '2021-11-23T08:00:00Z',
          end: '2021-11-23T08:30:00Z',
          minutesDuration: 30,
          created: '2020-11-02',
          comment: 'Follow-up/Routine:yes i have a reason',
          participant: [
            {
              actor: {
                reference:
                  'https://sandbox-api.va.gov/services/fhir/v0/r4/Location/I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
                display: 'LOM ACC TRAINING CLINIC',
              },
              status: 'accepted',
            },
            {
              actor: {
                reference:
                  'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/1008882029V851792',
                display: 'Mrs. Sheba703 Harris789',
              },
              status: 'accepted',
            },
          ],
          resourceType: 'Appointment',
        },
        'hidden:clinic': {
          id: 'I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
          identifier: [
            {
              use: 'usual',
              type: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                    code: 'FI',
                    display: 'Facility ID',
                  },
                ],
                text: 'Facility ID',
              },
              system:
                'https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-facility-identifier',
              value: 'vha_442',
            },
            {
              system:
                'https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-clinic-identifier',
              value: 'vha_442_3049',
            },
          ],
          status: 'active',
          name: 'LOM ACC TRAINING CLINIC',
          description: 'BLDG 146, RM W02',
          mode: 'instance',
          type: [
            {
              coding: [
                {
                  display: 'Primary Care',
                },
              ],
              text: 'Primary Care',
            },
          ],
          telecom: [
            {
              system: 'phone',
              value: '254-743-2867 x0002',
            },
          ],
          address: {
            text: '1901 VETERANS MEMORIAL DRIVE TEMPLE TEXAS 76504',
            line: ['1901 VETERANS MEMORIAL DRIVE'],
            city: 'TEMPLE',
            state: 'TEXAS',
            postalCode: '76504',
          },
          physicalType: {
            coding: [
              {
                display: 'BLDG 146, RM W02',
              },
            ],
            text: 'BLDG 146, RM W02',
          },
          managingOrganization: {
            reference:
              'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/I2-AKOTGEFSVKFJOPUKHIVJAH5VQU000000',
            display: 'CHEYENNE VA MEDICAL',
          },
          resourceType: 'Location',
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
        'hidden:questionnaire': [
          {
            id: 'questionnaire-123',
            questionnaireResponse: {},
          },
        ],
        'hidden:appointment': {
          id: 'appointment-123',
          status: 'booked',
          description: 'Scheduled Visit',
          start: '2021-11-23T08:00:00Z',
          end: '2021-11-23T08:30:00Z',
          minutesDuration: 30,
          created: '2020-11-02',
          comment: 'Follow-up/Routine:yes i have a reason',
          participant: [
            {
              actor: {
                reference:
                  'https://sandbox-api.va.gov/services/fhir/v0/r4/Location/I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
                display: 'LOM ACC TRAINING CLINIC',
              },
              status: 'accepted',
            },
            {
              actor: {
                reference:
                  'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/1008882029V851792',
                display: 'Mrs. Sheba703 Harris789',
              },
              status: 'accepted',
            },
          ],
          resourceType: 'Appointment',
        },
        'hidden:clinic': {
          id: 'I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
          identifier: [
            {
              use: 'usual',
              type: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                    code: 'FI',
                    display: 'Facility ID',
                  },
                ],
                text: 'Facility ID',
              },
              system:
                'https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-facility-identifier',
              value: 'vha_442',
            },
            {
              system:
                'https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-clinic-identifier',
              value: 'vha_442_3049',
            },
          ],
          status: 'active',
          name: 'LOM ACC TRAINING CLINIC',
          description: 'BLDG 146, RM W02',
          mode: 'instance',
          type: [
            {
              coding: [
                {
                  display: 'Primary Care',
                },
              ],
              text: 'Primary Care',
            },
          ],
          telecom: [
            {
              system: 'phone',
              value: '254-743-2867 x0002',
            },
          ],
          address: {
            text: '1901 VETERANS MEMORIAL DRIVE TEMPLE TEXAS 76504',
            line: ['1901 VETERANS MEMORIAL DRIVE'],
            city: 'TEMPLE',
            state: 'TEXAS',
            postalCode: '76504',
          },
          physicalType: {
            coding: [
              {
                display: 'BLDG 146, RM W02',
              },
            ],
            text: 'BLDG 146, RM W02',
          },
          managingOrganization: {
            reference:
              'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/I2-AKOTGEFSVKFJOPUKHIVJAH5VQU000000',
            display: 'CHEYENNE VA MEDICAL',
          },
          resourceType: 'Location',
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
          status: 'booked',
          description: 'Scheduled Visit',
          start: '2021-11-23T08:00:00Z',
          end: '2021-11-23T08:30:00Z',
          minutesDuration: 30,
          created: '2020-11-02',
          comment: 'Follow-up/Routine:yes i have a reason',
          participant: [
            {
              actor: {
                reference:
                  'https://sandbox-api.va.gov/services/fhir/v0/r4/Location/I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
                display: 'LOM ACC TRAINING CLINIC',
              },
              status: 'accepted',
            },
            {
              actor: {
                reference:
                  'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/1008882029V851792',
                display: 'Mrs. Sheba703 Harris789',
              },
              status: 'accepted',
            },
          ],
          resourceType: 'Appointment',
        },
        'hidden:clinic': {
          id: 'I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
          identifier: [
            {
              use: 'usual',
              type: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                    code: 'FI',
                    display: 'Facility ID',
                  },
                ],
                text: 'Facility ID',
              },
              system:
                'https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-facility-identifier',
              value: 'vha_442',
            },
            {
              system:
                'https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-clinic-identifier',
              value: 'vha_442_3049',
            },
          ],
          status: 'active',
          name: 'LOM ACC TRAINING CLINIC',
          description: 'BLDG 146, RM W02',
          mode: 'instance',
          type: [
            {
              coding: [
                {
                  display: 'Primary Care',
                },
              ],
              text: 'Primary Care',
            },
          ],
          telecom: [
            {
              system: 'phone',
              value: '254-743-2867 x0002',
            },
          ],
          address: {
            text: '1901 VETERANS MEMORIAL DRIVE TEMPLE TEXAS 76504',
            line: ['1901 VETERANS MEMORIAL DRIVE'],
            city: 'TEMPLE',
            state: 'TEXAS',
            postalCode: '76504',
          },
          physicalType: {
            coding: [
              {
                display: 'BLDG 146, RM W02',
              },
            ],
            text: 'BLDG 146, RM W02',
          },
          managingOrganization: {
            reference:
              'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/I2-AKOTGEFSVKFJOPUKHIVJAH5VQU000000',
            display: 'CHEYENNE VA MEDICAL',
          },
          resourceType: 'Location',
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
