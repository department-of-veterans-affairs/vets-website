import { expect } from 'chai';

import profileContactInfo from '../../../src/js/definitions/profileContactInfo';

describe('profileContactInfo', () => {
  it('should return default config pages with no options', () => {
    const result = profileContactInfo();

    const { veteran } = result.confirmContactInformation.schema.properties;
    expect(result.confirmContactInformation).to.exist;
    expect(result.editMailingAddress).to.exist;
    expect(result.editHomePhone).to.exist;
    expect(result.editMobilePhone).to.exist;
    expect(result.editEmailAddress).to.exist;

    expect(veteran.required).to.deep.equal([
      'mailingAddress',
      'email',
      'homePhone|mobilePhone',
    ]);
    expect(veteran.properties.homePhone.required).to.deep.equal([
      'areaCode',
      'phoneNumber',
    ]);
    expect(veteran.properties.mobilePhone.required).to.deep.equal([
      'areaCode',
      'phoneNumber',
    ]);
  });

  it('should only return email page when included', () => {
    const result = profileContactInfo({ included: ['email'] });
    const { veteran } = result.confirmContactInformation.schema.properties;

    expect(result.confirmContactInformation).to.exist;
    expect(result.editMailingAddress).to.be.undefined;
    expect(result.editHomePhone).to.be.undefined;
    expect(result.editMobilePhone).to.be.undefined;
    expect(result.editEmailAddress).to.exist;

    expect(veteran.required).to.deep.equal([
      'mailingAddress',
      'email',
      'homePhone|mobilePhone',
    ]);
  });
  it('should only return mobile phone page when included', () => {
    const result = profileContactInfo({ included: ['mobilePhone'] });
    const { veteran } = result.confirmContactInformation.schema.properties;

    expect(result.confirmContactInformation).to.exist;
    expect(result.editMailingAddress).to.be.undefined;
    expect(result.editHomePhone).to.be.undefined;
    expect(result.editMobilePhone).to.exist;
    expect(result.editEmailAddress).to.be.undefined;

    expect(veteran.required).to.deep.equal([
      'mailingAddress',
      'email',
      'homePhone|mobilePhone',
    ]);
    expect(veteran.properties.mobilePhone.required).to.deep.equal([
      'areaCode',
      'phoneNumber',
    ]);
    expect(veteran.properties.homePhone).to.be.undefined;
    expect(veteran.properties.email).to.be.undefined;
  });
  it('should only return home phone page when included', () => {
    const result = profileContactInfo({ included: ['homePhone'] });
    const { veteran } = result.confirmContactInformation.schema.properties;

    expect(result.confirmContactInformation).to.exist;
    expect(result.editMailingAddress).to.be.undefined;
    expect(result.editHomePhone).to.exist;
    expect(result.editMobilePhone).to.be.undefined;
    expect(result.editEmailAddress).to.be.undefined;

    expect(veteran.required).to.deep.equal([
      'mailingAddress',
      'email',
      'homePhone|mobilePhone',
    ]);
    expect(veteran.properties.homePhone.required).to.deep.equal([
      'areaCode',
      'phoneNumber',
    ]);
    expect(veteran.properties.mobilePhone).to.be.undefined;
    expect(veteran.properties.email).to.be.undefined;
  });
  it('should only return email page when included', () => {
    const result = profileContactInfo({ included: ['mailingAddress'] });
    const { veteran } = result.confirmContactInformation.schema.properties;

    expect(result.confirmContactInformation).to.exist;
    expect(result.editMailingAddress).to.exist;
    expect(result.editHomePhone).to.be.undefined;
    expect(result.editMobilePhone).to.be.undefined;
    expect(result.editEmailAddress).to.be.undefined;

    expect(veteran.required).to.deep.equal([
      'mailingAddress',
      'email',
      'homePhone|mobilePhone',
    ]);
    expect(veteran.properties.homePhone).to.be.undefined;
    expect(veteran.properties.mobilePhone).to.be.undefined;
    expect(veteran.properties.email).to.be.undefined;
  });
});
