import { expect } from 'chai';

import { schema, uiSchema } from '../../pages/securitySetupHighSchool';

describe('10278 securitySetupHighSchool page', () => {
  it('exports uiSchema with securityAnswerText field', () => {
    expect(uiSchema).to.be.an('object');
    expect(uiSchema).to.have.property('securityAnswerText');
  });

  it('exports schema with required securityAnswerText', () => {
    expect(schema).to.be.an('object');
    expect(schema).to.have.nested.property('properties.securityAnswerText');

    const fieldSchema = schema.properties.securityAnswerText;
    expect(fieldSchema).to.include({
      type: 'string',
      maxLength: 30,
    });

    expect(schema.required).to.deep.equal(['securityAnswerText']);
  });
});
