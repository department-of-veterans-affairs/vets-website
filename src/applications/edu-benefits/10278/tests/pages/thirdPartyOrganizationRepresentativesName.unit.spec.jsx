import { expect } from 'chai';
import thirdPartyOrganizationRepresentativesName from '../../pages/thirdPartyOrganizationRepresentativesName';

const { schema, uiSchema } = thirdPartyOrganizationRepresentativesName;

describe('10278 thirdPartyOrganizationRepresentativeName page', () => {
  it('should export a uiSchema with fullName and custom field labels', () => {
    expect(uiSchema).to.be.an('object');
    expect(uiSchema).to.have.property('fullName');

    expect(uiSchema.fullName).to.have.property('first');
    expect(uiSchema.fullName.first).to.have.property('ui:title', 'First name');
    expect(uiSchema.fullName.first)
      .to.have.property('ui:errorMessages')
      .that.deep.equals({
        required: 'Enter a first name',
      });

    expect(uiSchema.fullName).to.have.property('middle');
    expect(uiSchema.fullName.middle).to.have.property(
      'ui:title',
      'Middle name',
    );

    expect(uiSchema.fullName).to.have.property('last');
    expect(uiSchema.fullName.last).to.have.property('ui:title', 'Last name');
    expect(uiSchema.fullName.last)
      .to.have.property('ui:errorMessages')
      .that.deep.equals({
        required: 'Enter a last name',
      });
  });

  it('should export a schema that requires fullName and includes fullName properties', () => {
    expect(schema).to.be.an('object');

    expect(schema).to.have.property('type', 'object');
    expect(schema).to.have.property('properties');
    expect(schema.properties).to.have.property('fullName');

    expect(schema).to.have.property('required');
    expect(schema.required).to.deep.equal(['fullName']);
  });
});
