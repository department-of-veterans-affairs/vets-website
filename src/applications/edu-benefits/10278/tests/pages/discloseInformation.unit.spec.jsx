import { expect } from 'chai';

import { schema, uiSchema } from '../../pages/discloseInformation';

describe('10278 discloseInformation page', () => {
  it('should export a uiSchema with title and description', () => {
    expect(uiSchema).to.be.an('object');

    expect(uiSchema).to.have.property('ui:title');
    expect(uiSchema['ui:title']).to.exist;

    expect(uiSchema).to.have.property('ui:description');
    expect(uiSchema['ui:description']).to.exist;
  });

  it('should include discloseInformation.authorize radio field with correct content', () => {
    expect(uiSchema).to.have.nested.property('discloseInformation.authorize');

    const authorizeUI = uiSchema.discloseInformation.authorize;
    expect(authorizeUI).to.be.an('object');

    expect(authorizeUI).to.have.property('ui:title');
    expect(authorizeUI['ui:title']).to.equal(
      'Do you authorize us to disclose your personal information to a specific person or to an organization?',
    );

    const options = authorizeUI['ui:options'] || {};
    expect(options).to.be.an('object');

    const labels = options.labels || {};
    expect(labels).to.be.an('object');
    expect(labels).to.have.property('person', 'Person');
    expect(labels).to.have.property('organization', 'Organization');

    const errorMessages =
      authorizeUI['ui:errorMessages'] || options.errorMessages || {};
    expect(errorMessages).to.be.an('object');
    expect(errorMessages).to.have.property(
      'required',
      'You must provide a response',
    );
  });

  it('should export the correct schema for discloseInformation.authorize', () => {
    expect(schema).to.be.an('object');
    expect(schema).to.have.property('type', 'object');

    expect(schema).to.have.nested.property('properties.discloseInformation');
    const discloseSchema = schema.properties.discloseInformation;

    expect(discloseSchema).to.include({
      type: 'object',
    });

    expect(discloseSchema).to.have.property('required');
    expect(discloseSchema.required).to.deep.equal(['authorize']);

    expect(discloseSchema).to.have.nested.property('properties.authorize');
    const authorizeSchema = discloseSchema.properties.authorize;

    expect(authorizeSchema).to.be.an('object');
    expect(authorizeSchema).to.have.property('type', 'string');
    expect(authorizeSchema).to.have.property('enum');
    expect(authorizeSchema.enum).to.deep.equal(['person', 'organization']);
  });
});
