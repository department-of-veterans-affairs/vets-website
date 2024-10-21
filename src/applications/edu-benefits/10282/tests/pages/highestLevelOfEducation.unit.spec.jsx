import { expect } from 'chai';
import formConfig from '../../config/form';

describe('Edu 10282 highestLevelOfEducation', () => {
  const {
    uiSchema,
  } = formConfig.chapters.educationAndEmploymentHistory.pages.highestLevelOfEducation;
  it('should hide other eduction when highest level of education is not something else', () => {
    const formData = {
      highestLevelOfEducation: {
        level: 'High school',
      },
    };
    const result = uiSchema.highestLevelOfEducation.otherEducation[
      'ui:options'
    ].hideIf(formData);
    expect(result).to.be.true;
  });
  it('should not hide other eduction when highest level of education is something else', () => {
    const formData = {
      highestLevelOfEducation: {
        level: 'Something else',
      },
    };
    const result = uiSchema.highestLevelOfEducation.otherEducation[
      'ui:options'
    ].hideIf(formData);
    expect(result).to.be.false;
  });
});
