import { expect } from 'chai';

import { schema, uiSchema } from '../../pages/securitySetup';

describe('10278 securitySetup page', () => {
  it('exports uiSchema with securityQuestion.radio field and error message', () => {
    expect(uiSchema).to.be.an('object');
    expect(uiSchema).to.have.nested.property('securityQuestion.question');

    const questionUI = uiSchema.securityQuestion.question;
    expect(questionUI).to.be.an('object');

    const options = questionUI['ui:options'] || {};
    const labels = options.labels || {};

    expect(labels).to.include.all.keys(
      'pin',
      'motherBornLocation',
      'highSchool',
      'petName',
      'teacherName',
      'fatherMiddleName',
      'create',
    );

    const errorMessages =
      questionUI['ui:errorMessages'] || options.errorMessages || {};
    expect(errorMessages).to.have.property(
      'required',
      'You must provide an answer',
    );
  });

  it('exports schema with required securityQuestion.question', () => {
    expect(schema).to.be.an('object');
    expect(schema).to.have.property('type', 'object');
    expect(schema).to.have.nested.property('properties.securityQuestion');

    const { securityQuestion } = schema.properties;
    expect(securityQuestion).to.have.property('required');
    expect(securityQuestion.required).to.deep.equal(['question']);

    expect(securityQuestion).to.have.nested.property('properties.question');
  });
});
