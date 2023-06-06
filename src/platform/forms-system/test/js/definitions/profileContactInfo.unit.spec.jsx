import { expect } from 'chai';

import profileContactInfo from '../../../src/js/definitions/profileContactInfo';

describe('profileContactInfo', () => {
  const pageKey = 'confirmContactInfo';

  it('should return default config pages with no options', () => {
    const result = profileContactInfo();
    const { veteran } = result[pageKey].schema.properties;
    expect(result[pageKey]).to.exist;
    expect(result[`${pageKey}EditMailingAddress`]).to.exist;
    expect(result[`${pageKey}EditHomePhone`]).to.exist;
    expect(result[`${pageKey}EditMobilePhone`]).to.exist;
    expect(result[`${pageKey}EditEmailAddress`]).to.exist;

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
    const { veteran } = result[pageKey].schema.properties;

    expect(result[pageKey]).to.exist;
    expect(result[`${pageKey}EditMailingAddress`]).to.be.undefined;
    expect(result[`${pageKey}EditHomePhone`]).to.be.undefined;
    expect(result[`${pageKey}EditMobilePhone`]).to.be.undefined;
    expect(result[`${pageKey}EditEmailAddress`]).to.exist;

    expect(veteran.required).to.deep.equal([
      'mailingAddress',
      'email',
      'homePhone|mobilePhone',
    ]);
  });
  it('should only return mobile phone page when included', () => {
    const result = profileContactInfo({ included: ['mobilePhone'] });
    const { veteran } = result[pageKey].schema.properties;

    expect(result[pageKey]).to.exist;
    expect(result[`${pageKey}EditMailingAddress`]).to.be.undefined;
    expect(result[`${pageKey}EditHomePhone`]).to.be.undefined;
    expect(result[`${pageKey}EditMobilePhone`]).to.exist;
    expect(result[`${pageKey}EditEmailAddress`]).to.be.undefined;

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
    const { veteran } = result[pageKey].schema.properties;

    expect(result[pageKey]).to.exist;
    expect(result[`${pageKey}EditMailingAddress`]).to.be.undefined;
    expect(result[`${pageKey}EditHomePhone`]).to.exist;
    expect(result[`${pageKey}EditMobilePhone`]).to.be.undefined;
    expect(result[`${pageKey}EditEmailAddress`]).to.be.undefined;

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
    const { veteran } = result[pageKey].schema.properties;

    expect(result[pageKey]).to.exist;
    expect(result[`${pageKey}EditMailingAddress`]).to.exist;
    expect(result[`${pageKey}EditHomePhone`]).to.be.undefined;
    expect(result[`${pageKey}EditMobilePhone`]).to.be.undefined;
    expect(result[`${pageKey}EditEmailAddress`]).to.be.undefined;

    expect(veteran.required).to.deep.equal([
      'mailingAddress',
      'email',
      'homePhone|mobilePhone',
    ]);
    expect(veteran.properties.homePhone).to.be.undefined;
    expect(veteran.properties.mobilePhone).to.be.undefined;
    expect(veteran.properties.email).to.be.undefined;
  });

  it('should add custom uiSchema', () => {
    const result = profileContactInfo({
      contactInfoUiSchema: {
        'ui:required': ['test1'],
        'ui:options': { test2: true },
      },
    });
    const { uiSchema } = result[pageKey];

    expect(uiSchema['ui:required']).to.deep.equal(['test1']);
    expect(uiSchema['ui:options'].test2).to.be.true;
  });
});
