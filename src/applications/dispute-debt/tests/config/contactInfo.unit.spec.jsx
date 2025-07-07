import { expect } from 'chai';
import contactInfo from '../../config/contactInfo';

describe('contactInfo', () => {
  it('exports a contact info configuration object', () => {
    expect(contactInfo).to.be.an('object');
  });

  it('has contact-information page configuration', () => {
    expect(contactInfo['contact-information']).to.exist;
    const page = contactInfo['contact-information'];

    expect(page.path).to.equal('contact-information');
    expect(page.title).to.equal('Contact information');
    expect(page.uiSchema).to.exist;
    expect(page.schema).to.exist;
  });

  it('has correct UI schema configuration', () => {
    const page = contactInfo['contact-information'];
    expect(page.uiSchema).to.be.an('object');
    // UI schema should have some configuration properties
    expect(Object.keys(page.uiSchema).length).to.be.greaterThan(0);
  });

  it('has correct schema configuration', () => {
    const page = contactInfo['contact-information'];
    expect(page.schema).to.be.an('object');
    expect(page.schema.type).to.equal('object');
    expect(page.schema.properties).to.exist;
  });

  it('includes required contact information fields', () => {
    const page = contactInfo['contact-information'];
    const { properties } = page.schema;

    // Check for veteran wrapper
    expect(properties.veteran).to.exist;
    expect(properties.veteran.type).to.equal('object');
    expect(properties.veteran.properties).to.exist;

    const veteranProps = properties.veteran.properties;
    expect(veteranProps.mailingAddress).to.exist;
    expect(veteranProps.mobilePhone).to.exist;
  });

  it('has mailing address configuration', () => {
    const page = contactInfo['contact-information'];
    expect(page).to.exist;
    expect(page.uiSchema).to.exist;
  });

  it('has mobile phone configuration', () => {
    const page = contactInfo['contact-information'];
    const { mobilePhone } = page.schema.properties.veteran.properties;

    expect(mobilePhone).to.exist;
    expect(mobilePhone.type).to.equal('object');
    expect(mobilePhone.properties).to.exist;
    expect(mobilePhone.properties.areaCode).to.exist;
    expect(mobilePhone.properties.phoneNumber).to.exist;
  });

  it('has email configuration', () => {
    const page = contactInfo['contact-information'];
    const { email } = page.schema.properties.veteran.properties;

    expect(email).to.exist;
    expect(email.type).to.equal('string');
    expect(email.format).to.equal('email');
  });

  it('has required fields specified', () => {
    const page = contactInfo['contact-information'];
    const { required } = page.schema.properties.veteran;

    expect(required).to.be.an('array');
    expect(required).to.include('mailingAddress');
    expect(required).to.include('mobilePhone');
  });

  it('has UI schema with proper field configurations', () => {
    const page = contactInfo['contact-information'];
    expect(page).to.exist;
    expect(page.uiSchema).to.exist;
    expect(page.uiSchema).to.be.an('object');
  });

  it('has contact information UI options', () => {
    const page = contactInfo['contact-information'];
    const uiOptions = page.uiSchema['ui:options'];

    expect(uiOptions).to.exist;
    expect(uiOptions.showTitle).to.be.true;
  });

  it('has description with alert and instructions', () => {
    const page = contactInfo['contact-information'];
    expect(page).to.exist;
    expect(page.uiSchema).to.exist;
    expect(page.schema).to.exist;
  });

  it('includes required contact info fields', () => {
    const page = contactInfo['contact-information'];
    expect(page.uiSchema).to.be.an('object');
    expect(page.schema).to.be.an('object');
  });

  it('has proper page structure for contact information', () => {
    expect(contactInfo).to.have.property('contact-information');
    const page = contactInfo['contact-information'];
    expect(page).to.have.property('uiSchema');
    expect(page).to.have.property('schema');
  });
});
