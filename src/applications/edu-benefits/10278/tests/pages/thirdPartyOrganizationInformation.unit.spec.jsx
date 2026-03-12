import { expect } from 'chai';
import thirdPartyOrganizationInformation from '../../pages/thirdPartyOrganizationInformation';

const { schema, uiSchema } = thirdPartyOrganizationInformation;

describe('10278 thirdPartyOrganizationInformation page', () => {
  it('exports uiSchema and schema objects', () => {
    expect(thirdPartyOrganizationInformation).to.be.an('object');
    expect(uiSchema).to.be.an('object');
    expect(schema).to.be.an('object');
  });

  it('exports a schema with required fields', () => {
    expect(schema.type).to.equal('object');
    expect(schema.required).to.deep.equal([
      'organizationName',
      'organizationAddress',
    ]);

    expect(schema.properties).to.have.property('organizationName');
    expect(schema.properties).to.have.property('organizationAddress');
  });

  it('omits street3 from organizationAddress schema', () => {
    expect(schema.properties.organizationAddress).to.be.an('object');
    expect(schema.properties.organizationAddress.properties).to.be.an('object');
    expect(
      schema.properties.organizationAddress.properties,
    ).to.not.have.property('street3');
  });

  it('sets organizationName required error message', () => {
    expect(uiSchema.organizationName).to.be.an('object');
    expect(uiSchema.organizationName['ui:errorMessages']).to.be.an('object');
    expect(uiSchema.organizationName['ui:errorMessages'].required).to.equal(
      'Enter name of organization',
    );
  });

  it('includes organizationName and organizationAddress in uiSchema', () => {
    expect(uiSchema).to.have.property('organizationName');
    expect(uiSchema.organizationName).to.be.an('object');

    expect(uiSchema).to.have.property('organizationAddress');
    expect(uiSchema.organizationAddress).to.be.an('object');
  });
});
