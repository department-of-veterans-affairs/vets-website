import { filterArrayByValue } from '../inquiry/topic/topic';
import { expect } from 'chai';

describe('topic', () => {
  const testSchema = {
    properties: {
      topic: {
        oneOf: [
          {
            properties: {
              levelOne: {
                type: 'string',
                enum: ['Caregiver Support Program'],
              },
              levelTwo: {
                type: 'string',
                enum: [
                  'General Caregiver Support/Education',
                  'Comprehensive Family Caregiver Program',
                  'VA Supportive Services',
                ],
              },
            },
          },
          {
            properties: {
              levelOne: {
                type: 'string',
                enum: ['Health & Medical Issues & Services'],
              },
              levelTwo: {
                type: 'object',
                oneOf: [
                  {
                    properties: {
                      subLevelTwo: {
                        type: 'string',
                        enum: ['Health/Medical Eligibility & Programs'],
                      },
                      levelThree: {
                        type: 'string',
                        enum: [
                          'Apply for Health Benefits (Veterans)',
                          'Medical Care for Veterans within USA',
                        ],
                      },
                    },
                  },
                  {
                    properties: {
                      subLevelTwo: {
                        type: 'string',
                        enum: ['Prosthetics, Med Devices & Sensory Aids'],
                      },
                      levelThree: {
                        type: 'string',
                        enum: [
                          'Artificial Limbs/Orthotics',
                          'Automobile Adaptive Equipment',
                        ],
                      },
                    },
                  },
                  {
                    properties: {
                      subLevelTwo: {
                        type: 'string',
                        enum: ['Women Veterans Health Care'],
                      },
                      levelThree: {
                        type: 'string',
                        enum: ['General Concern'],
                      },
                    },
                  },
                  {
                    properties: {
                      subLevelTwo: {
                        type: 'string',
                        enum: ['Medical Care Issues at Specific Facility'],
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  };

  it('should return correct sub topics', () => {
    const subTopicValues = filterArrayByValue(
      testSchema.properties.topic,
      'Caregiver Support Program',
    );
    expect(subTopicValues).to.have.members([
      'General Caregiver Support/Education',
      'Comprehensive Family Caregiver Program',
      'VA Supportive Services',
    ]);
  });

  it('should return sub topics for complex levelTwo', () => {
    const subTopicValues = filterArrayByValue(
      testSchema.properties.topic,
      'Health & Medical Issues & Services',
    );
    expect(subTopicValues).to.have.members([
      'Medical Care Issues at Specific Facility',
      'Health/Medical Eligibility & Programs',
      'Prosthetics, Med Devices & Sensory Aids',
      'Women Veterans Health Care',
    ]);
  });

  it('should return level three topics when isLevelThree is true', () => {
    const subTopicValues = filterArrayByValue(
      testSchema.properties.topic.oneOf[1].properties.levelTwo,
      'Health/Medical Eligibility & Programs',
      true,
    );
    expect(subTopicValues).to.have.members([
      'Apply for Health Benefits (Veterans)',
      'Medical Care for Veterans within USA',
    ]);
  });
});
