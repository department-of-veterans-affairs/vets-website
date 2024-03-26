import { expect } from 'chai';
import merge from 'lodash/merge';
import { validateWhiteSpace } from 'platform/forms/validations';
import * as address from 'platform/forms/definitions/address';
import { uiSchema } from '../../pages/newSchool';
import { showSchoolAddress } from '../../../utils/helpers';

describe('uiSchema', () => {
  it('should have the correct title', () => {
    const expectedTitle =
      'School, university, program, or training facility you want to attend';
    expect(uiSchema['ui:title']).to.equal(expectedTitle);
  });
  it('should have the correct properties for newSchoolName', () => {
    const expectedProperties = {
      'ui:title': 'Name of school, university, program, or training facility',
      'ui:validations': [
        (errors, newSchoolName) => {
          validateWhiteSpace(errors, newSchoolName);
        },
      ],
    };
    expect(uiSchema.newSchoolName).to.not.eql(expectedProperties);
  });

  it('should have the correct properties for newSchoolAddress', () => {
    const expectedProperties = merge({}, address.uiSchema(), {
      'ui:options': {
        hideIf: formData => !showSchoolAddress(formData.educationType),
      },
    });
    expect(uiSchema.newSchoolAddress).to.not.deep.equal(expectedProperties);
  });
  it('should have the correct properties for educationObjective', () => {
    const expectedProperties = {
      'ui:title':
        'Education or career goal (For example, “I want to get a bachelor’s degree in criminal justice” or “I want to get an HVAC technician certificate” or “I want to become a police officer.”)',
      'ui:widget': 'textarea',
    };
    expect(uiSchema.educationObjective).to.eql(expectedProperties);
  });

  it('should have the correct properties for nonVaAssistance', () => {
    const expectedProperties = {
      'ui:title':
        'Are you getting, or do you expect to get any money (including, but not limited to, federal tuition assistance) from the Armed Forces or public health services for any part of your coursework or training?',
      'ui:widget': 'yesNo',
    };
    expect(uiSchema.nonVaAssistance).to.deep.equal(expectedProperties);
  });
  it('should have the correct properties for civilianBenefitsAssistance', () => {
    const expectedProperties = {
      'ui:title':
        'Are you getting benefits from the U.S. government as a civilian employee during the same time as you’re requesting benefits from VA?',
      'ui:widget': 'yesNo',
    };
    expect(uiSchema.civilianBenefitsAssistance).to.deep.equal(
      expectedProperties,
    );
  });
});
