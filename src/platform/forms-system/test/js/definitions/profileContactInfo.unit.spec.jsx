import { expect } from 'chai';
import sinon from 'sinon';

import profileContactInfo, {
  profileReviewErrorOverride,
} from '../../../src/js/definitions/profileContactInfo';
import {
  standardProfileAddressSchema,
  internationalProfileAddressSchema,
} from '../../../src/js/utilities/data/profile';
import { ADDRESS_TYPES } from '../../../../forms/address/helpers';

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
    const updateSpy = sinon.spy();
    const result = profileContactInfo({
      contactInfoUiSchema: {
        'ui:required': ['test1'],
        'ui:options': {
          test2: true,
          updateSchema: (formData, schema) => {
            updateSpy();
            return schema;
          },
        },
      },
    });
    const { uiSchema } = result[pageKey];
    expect(uiSchema['ui:required']).to.deep.equal(['test1']);
    expect(uiSchema['ui:options'].test2).to.be.true;
    // adds updateSchema
    const { updateSchema } = uiSchema['ui:options'];
    expect(updateSchema).to.exist;
    updateSchema({}, {});
    expect(updateSpy.called).to.be.true;
  });

  it('should return custom uiSchema & U.S. mailing address schema', () => {
    const updateSpy = sinon.spy();
    const result = profileContactInfo({
      contactInfoUiSchema: {
        'ui:required': ['test1'],
        'ui:options': {
          test2: true,
          updateSchema: (formData, schema) => {
            updateSpy();
            return schema;
          },
        },
      },
    });
    const { uiSchema } = result[pageKey];
    expect(uiSchema['ui:required']).to.deep.equal(['test1']);
    expect(uiSchema['ui:options'].test2).to.be.true;
    // adds updateSchema
    const { updateSchema } = uiSchema['ui:options'];
    expect(updateSchema).to.exist;
    const addressSchema = updateSchema({}, {});
    expect(updateSpy.called).to.be.true;
    expect(
      addressSchema.properties.veteran.properties.mailingAddress,
    ).to.deep.equal(standardProfileAddressSchema);
  });

  it('should return international mailing address schema', () => {
    const updateSpy = sinon.spy();
    const result = profileContactInfo({
      contactInfoUiSchema: {
        'ui:required': ['test1'],
        'ui:options': {
          test2: true,
          updateSchema: (formData, schema) => {
            updateSpy();
            return schema;
          },
        },
      },
    });
    const { uiSchema } = result[pageKey];
    const { updateSchema } = uiSchema['ui:options'];
    expect(updateSchema).to.exist;
    const addressSchema = updateSchema(
      {
        veteran: {
          mailingAddress: { addressType: ADDRESS_TYPES.international },
        },
      },
      {},
    );
    expect(updateSpy.called).to.be.true;
    expect(
      addressSchema.properties.veteran.properties.mailingAddress,
    ).to.deep.equal(internationalProfileAddressSchema);
  });
});

describe('profileReviewErrorOverride', () => {
  const defaultOverride = profileReviewErrorOverride();
  it('should return null for non-matching errors', () => {
    expect(defaultOverride('')).to.be.null;
    expect(defaultOverride('blah')).to.be.null;
  });
  it('should return chapter & page keys for matching wrapper', () => {
    const result = {
      contactInfoChapterKey: 'infoPages',
      pageKey: 'confirmContactInfo',
    };
    expect(defaultOverride('veteran')).to.deep.equal(result);
  });
  it('should return chapter & page keys for matching wrapper', () => {
    const customOverride = profileReviewErrorOverride({
      contactInfoChapterKey: 'foo',
      contactInfoPageKey: 'bar',
      wrapperKey: 'baz',
    });
    const result = {
      contactInfoChapterKey: 'foo',
      pageKey: 'bar',
    };
    expect(customOverride('baz')).to.deep.equal(result);
  });
});
