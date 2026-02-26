import { expect } from 'chai';

import { schema, uiSchema } from '../../pages/securitySetupPinPassword';

describe('10278 securitySetupPinPassword page', () => {
  it('exports uiSchema with securityAnswerText text field and error messages', () => {
    expect(uiSchema).to.be.an('object');
    expect(uiSchema).to.have.property('securityAnswerText');

    const fieldUI = uiSchema.securityAnswerText;
    expect(fieldUI).to.be.an('object');

    const errorMessages =
      fieldUI['ui:errorMessages'] || fieldUI.errorMessages || {};
    expect(errorMessages).to.have.property(
      'required',
      'You must provide an answer',
    );
  });

  it('exports schema with required securityAnswerText and maxLength', () => {
    expect(schema).to.be.an('object');
    expect(schema).to.have.property('type', 'object');
    expect(schema).to.have.nested.property('properties.securityAnswerText');

    const fieldSchema = schema.properties.securityAnswerText;
    expect(fieldSchema).to.include({
      type: 'string',
      maxLength: 30,
    });

    expect(schema.required).to.deep.equal(['securityAnswerText']);
  });
});
