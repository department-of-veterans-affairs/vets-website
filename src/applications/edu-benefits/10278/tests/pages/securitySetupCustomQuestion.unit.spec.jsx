import { expect } from 'chai';

import { schema, uiSchema } from '../../pages/securitySetupCustomQuestion';

describe('10278 securitySetupCustomQuestion page', () => {
  it('exports uiSchema with securityAnswerCreate question and answer fields', () => {
    expect(uiSchema).to.be.an('object');
    expect(uiSchema).to.have.nested.property('securityAnswerCreate.question');
    expect(uiSchema).to.have.nested.property('securityAnswerCreate.answer');

    const questionUI = uiSchema.securityAnswerCreate.question;
    const answerUI = uiSchema.securityAnswerCreate.answer;

    const questionErrors =
      questionUI['ui:errorMessages'] || questionUI.errorMessages || {};
    const answerErrors =
      answerUI['ui:errorMessages'] || answerUI.errorMessages || {};

    expect(questionErrors).to.have.property(
      'required',
      'You must enter a security question',
    );
    expect(answerErrors).to.have.property(
      'required',
      'You must provide an answer',
    );
  });

  it('exports schema with securityAnswerCreate.question and .answer required', () => {
    expect(schema).to.be.an('object');
    expect(schema).to.have.nested.property('properties.securityAnswerCreate');

    const secSchema = schema.properties.securityAnswerCreate;
    expect(secSchema).to.have.property('required');
    expect(secSchema.required).to.deep.equal(['question', 'answer']);

    expect(secSchema).to.have.nested.property('properties.question');
    expect(secSchema).to.have.nested.property('properties.answer');
  });
});
