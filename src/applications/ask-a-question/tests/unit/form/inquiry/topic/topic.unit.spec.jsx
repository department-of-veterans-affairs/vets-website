import { expect } from 'chai';
import {
  filterTopicArrayByLabel,
  getTopicsWithSubtopicsByCategory,
  isValidFacilityCode,
} from '../../../../../form/inquiry/topic/topic';

describe('topic', () => {
  const testSchema = {
    properties: {
      topic: {
        anyOf: [
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
                anyOf: [
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
          {
            properties: {
              levelOne: {
                type: 'string',
                enum: ['Burial & Memorial Benefits (NCA)'],
              },
              levelTwo: {
                type: 'object',
                anyOf: [
                  {
                    properties: {
                      subLevelTwo: {
                        type: 'string',
                        enum: ['Burial Benefits'],
                      },
                      levelThree: {
                        type: 'string',
                        enum: [
                          'Compensation Request',
                          'All Other Burial Benefit Inquiries',
                        ],
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

  describe('filterTopicArrayByLabel', () => {
    it('should return correct sub topics', () => {
      const subTopicValues = filterTopicArrayByLabel(
        testSchema.properties.topic,
        'Caregiver Support Program',
      );
      expect(subTopicValues).to.have.ordered.members([
        'Comprehensive Family Caregiver Program',
        'General Caregiver Support/Education',
        'VA Supportive Services',
      ]);
    });

    it('should return sub topics for complex levelTwo', () => {
      const subTopicValues = filterTopicArrayByLabel(
        testSchema.properties.topic,
        'Health & Medical Issues & Services',
      );
      expect(subTopicValues).to.have.ordered.members([
        'Health/Medical Eligibility & Programs',
        'Medical Care Issues at Specific Facility',
        'Prosthetics, Med Devices & Sensory Aids',
        'Women Veterans Health Care',
      ]);
    });

    it('should return level three topics when isLevelThree is true', () => {
      const subTopicValues = filterTopicArrayByLabel(
        testSchema.properties.topic.anyOf[1].properties.levelTwo,
        'Health/Medical Eligibility & Programs',
        true,
      );
      expect(subTopicValues).to.have.ordered.members([
        'Apply for Health Benefits (Veterans)',
        'Medical Care for Veterans within USA',
      ]);
    });

    it('should return level three topics for burial benefits', () => {
      const subTopicValues = filterTopicArrayByLabel(
        testSchema.properties.topic.anyOf[2].properties.levelTwo,
        'Burial Benefits',
        true,
      );
      expect(subTopicValues).to.have.ordered.members([
        'Compensation Request',
        'All Other Burial Benefit Inquiries',
      ]);
    });
  });

  describe('getTopicsWithSubtopicsByCategory', () => {
    it('should return levelTwo topics with levelThree subtopics', () => {
      const topicsWithSubtopicsByCategory = getTopicsWithSubtopicsByCategory(
        testSchema.properties.topic,
      );
      const expectedResult = {
        'Burial & Memorial Benefits (NCA)': ['Burial Benefits'],
        'Health & Medical Issues & Services': [
          'Health/Medical Eligibility & Programs',
          'Prosthetics, Med Devices & Sensory Aids',
          'Women Veterans Health Care',
        ],
      };
      expect(topicsWithSubtopicsByCategory).to.deep.include(expectedResult);
    });
  });

  describe('isValidFacilityCode', () => {
    describe('invalid facility code', () => {
      it('should be invalid for special characters', () => {
        expect(isValidFacilityCode('@bcd1234')).to.be.false;
      });
      it('should be invalid for length greater than 8 characters', () => {
        expect(isValidFacilityCode('123456789')).to.be.false;
      });
      it('should be invalid for length less than 8 characters', () => {
        expect(isValidFacilityCode('123456789')).to.be.false;
      });
    });
    describe('valid facility code', () => {
      it('should be valid for facility code with exactly 8 characters', () => {
        expect(isValidFacilityCode('AaBb1234')).to.be.true;
      });
    });
  });
});
