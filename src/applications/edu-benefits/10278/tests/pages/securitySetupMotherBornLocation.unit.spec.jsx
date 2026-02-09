import { expect } from 'chai';

import { schema, uiSchema } from '../../pages/securitySetupMotherBornLocation';

describe('10278 securitySetupMotherBornLocation page', () => {
  it('exports uiSchema with city and state fields', () => {
    expect(uiSchema).to.be.an('object');
    expect(uiSchema).to.have.nested.property('securityAnswerLocation.city');
    expect(uiSchema).to.have.nested.property('securityAnswerLocation.state');
  });

  it('exports schema with securityAnswerLocation city and state required', () => {
    expect(schema).to.be.an('object');
    expect(schema).to.have.nested.property('properties.securityAnswerLocation');

    const locationSchema = schema.properties.securityAnswerLocation;
    expect(locationSchema).to.have.property('required');
    expect(locationSchema.required).to.deep.equal(['city', 'state']);
  });
});
