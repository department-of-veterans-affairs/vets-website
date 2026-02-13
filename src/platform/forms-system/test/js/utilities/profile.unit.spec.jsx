import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '../../../src/js/utilities/ui';

import {
  getContent,
  standardPhoneSchema,
  profileAddressSchema,
  getPhoneString,
  renderTelephone,
  getMissingInfo,
  validateEmail,
  validatePhone,
  validateZipcode,
  convertNullishObjectValuesToEmptyString,
} from '../../../src/js/utilities/data/profile';

describe('profile utilities', () => {
  const content = getContent();
  describe('getContent', () => {
    it('should return default content', () => {
      // If this number changes, update the docs
      expect(Object.keys(content).length).to.eql(40);
      expect(content.alertContent).to.contain('your application');
    });
    it('should return content with custom app name', () => {
      const testContent = getContent('test');
      expect(testContent.alertContent).to.contain('your test');
    });
  });

  describe('standardPhoneSchema', () => {
    it('should return required array', () => {
      expect(standardPhoneSchema(true).required.length).to.eq(2);
    });
    it('should return empty required array', () => {
      expect(standardPhoneSchema().required.length).to.eq(0);
    });
  });

  describe('profiledAddressSchema', () => {
    it('should return international address required array', () => {
      expect(profileAddressSchema.oneOf[0].required).to.deep.equal([
        'countryName',
        'addressLine1',
        'city',
      ]);
    });
    it('should return U.S. address required array', () => {
      expect(profileAddressSchema.oneOf[1].required).to.deep.equal([
        'countryName',
        'addressLine1',
        'city',
        'zipCode',
      ]);
    });
  });

  describe('getPhoneString', () => {
    it('should return empty string', () => {
      expect(getPhoneString({})).to.eq('');
    });
    it('should return partial phone number', () => {
      expect(getPhoneString({ areaCode: '123' })).to.eq('123');
      expect(getPhoneString({ phoneNumber: '456' })).to.eq('456');
      expect(getPhoneString({ areaCode: '12', phoneNumber: '34' })).to.eq(
        '1234',
      );
    });
    it('should return full phone string', () => {
      expect(getPhoneString({ areaCode: '800', phoneNumber: '5551212' })).to.eq(
        '8005551212',
      );
    });
  });

  describe('renderTelephone', () => {
    it('should return not throw an error', () => {
      const { container } = render(<div>{renderTelephone([{}])}</div>);
      expect(container.innerHTML).to.eq('<div></div>');
    });
    it('should return not render anything', () => {
      const { container } = render(<div>{renderTelephone()}</div>);
      expect(container.innerHTML).to.eq('<div></div>');
    });
    it('should return telephone object', () => {
      const phoneObj = { areaCode: '800', phoneNumber: '5551212' };
      const { container } = render(<div>{renderTelephone(phoneObj)}</div>);
      const vaPhone = $('va-telephone', container);
      expect(vaPhone.getAttribute('contact')).to.eq('8005551212');
      expect(vaPhone.getAttribute('extension')).to.be.null;
      expect(vaPhone.getAttribute('not-clickable')).to.eq('true');
    });
    it('should return telephone object & extension', () => {
      const phoneObj = {
        areaCode: '800',
        phoneNumber: '5551212',
        extension: '45678',
      };
      const { container } = render(<div>{renderTelephone(phoneObj)}</div>);
      const vaPhone = $('va-telephone', container);
      expect(vaPhone.getAttribute('contact')).to.eq('8005551212');
      expect(vaPhone.getAttribute('extension')).to.eq('45678');
      expect(vaPhone.getAttribute('not-clickable')).to.eq('true');
    });
    it('should return international telephone object', () => {
      const phoneObj = {
        countryCode: '44',
        phoneNumber: '2045675000',
        isInternational: true,
      };
      const { container } = render(<div>{renderTelephone(phoneObj)}</div>);
      const vaPhone = $('va-telephone', container);
      expect(vaPhone.getAttribute('country-code')).to.eq('44');
      expect(vaPhone.getAttribute('contact')).to.eq('2045675000');
      expect(vaPhone.getAttribute('extension')).to.be.null;
      expect(vaPhone.getAttribute('not-clickable')).to.eq('true');
    });
  });

  describe('getMissingInfo', () => {
    const keys = {
      address: 'a',
      email: 'e',
      homePhone: 'h',
      mobilePhone: 'm',
    };
    const c = {
      missingAddress: 'address',
      missingHomeOrMobile: 'home or mobile',
      missingHomePhone: 'home',
      missingMobilePhone: 'mobile',
      missingEmail: 'email',
    };
    const getData = ({ a = true, e = true, h = true, m = true } = {}) => ({
      a: {
        countryName: a ? 'United States' : '',
        addressLine1: a ? '123 Main' : '',
        city: a ? 'City' : '',
        zipCode: a ? '12345' : '',
      },
      e: e ? 'x@x.com' : '',
      h: { areaCode: h ? '123' : '', phoneNumber: h ? '5551212' : '' },
      m: { areaCode: m ? '234' : '', phoneNumber: m ? '5551313' : '' },
    });

    const noData = getData({ a: false, e: false, h: false, m: false });

    it('should return empty missing info array', () => {
      expect(
        getMissingInfo({ data: {}, keys, content: c, requiredKeys: [] }),
      ).to.deep.equal([]);
      expect(
        getMissingInfo({
          data: getData(),
          keys,
          content: c,
          requiredKeys: [],
        }),
      ).to.deep.equal([]);
      expect(
        getMissingInfo({
          data: getData({ a: false, e: false, h: false, m: false }),
          keys,
          content: c,
          requiredKeys: [],
        }),
      ).to.deep.equal([]);
    });
    it('should return a missing message for a single area', () => {
      const props = { data: noData, keys, content: c };

      expect(getMissingInfo({ requiredKeys: ['a'], ...props })).to.deep.equal([
        'address',
      ]);
      expect(getMissingInfo({ requiredKeys: ['e'], ...props })).to.deep.equal([
        'email',
      ]);
      expect(getMissingInfo({ requiredKeys: ['h'], ...props })).to.deep.equal([
        'home',
      ]);
      expect(getMissingInfo({ requiredKeys: ['m'], ...props })).to.deep.equal([
        'mobile',
      ]);
      expect(getMissingInfo({ requiredKeys: ['h|m'], ...props })).to.deep.equal(
        ['home or mobile'],
      );
      expect(getMissingInfo({ requiredKeys: ['m|h'], ...props })).to.deep.equal(
        ['home or mobile'],
      );
      expect(
        getMissingInfo({
          data: getData({ m: false }),
          keys,
          content: c,
          requiredKeys: ['a', 'e', 'h'],
        }),
      ).to.deep.equal([]);
      expect(
        getMissingInfo({
          data: getData({ h: false }),
          keys,
          content: c,
          requiredKeys: ['a', 'e', 'm'],
        }),
      ).to.deep.equal([]);
    });
    it('should return a missing message for multiple areas', () => {
      expect(
        getMissingInfo({
          data: noData,
          keys,
          content: c,
          requiredKeys: ['a', 'e', 'h|m'],
        }),
      ).to.deep.equal(['home or mobile', 'email', 'address']);
      expect(
        getMissingInfo({
          data: noData,
          keys,
          content: c,
          requiredKeys: ['a', 'e', 'h'],
        }),
      ).to.deep.equal(['home', 'email', 'address']);
      expect(
        getMissingInfo({
          data: noData,
          keys,
          content: c,
          requiredKeys: ['a', 'e', 'm'],
        }),
      ).to.deep.equal(['mobile', 'email', 'address']);
      expect(
        getMissingInfo({
          data: noData,
          keys,
          content: c,
          requiredKeys: ['a', 'e', 'h', 'm'],
        }),
      ).to.deep.equal(['home', 'mobile', 'email', 'address']);
    });
    it('should return an empty missing message when all data is present', () => {
      expect(
        getMissingInfo({
          data: getData(),
          keys,
          content: c,
          requiredKeys: ['a', 'e', 'h|m'],
        }),
      ).to.deep.equal([]);
      expect(
        getMissingInfo({
          data: getData({ m: false }),
          keys,
          content: c,
          requiredKeys: ['a', 'e', 'h'],
        }),
      ).to.deep.equal([]);
      expect(
        getMissingInfo({
          data: getData({ h: false }),
          keys,
          content: c,
          requiredKeys: ['a', 'e', 'm'],
        }),
      ).to.deep.equal([]);
    });
  });

  describe('validateEmail', () => {
    it('should return empty string for valid emails', () => {
      expect(validateEmail(content, 'z@z.com')).to.eq('');
      expect(validateEmail(content, 'test@test.uk')).to.eq('');
      expect(validateEmail(content, '   test@test.uk   ')).to.eq('');
    });
    it('should return missing email error', () => {
      expect(validateEmail(content, '')).to.eq(content.missingEmailError);
      expect(validateEmail(content, '    ')).to.eq(content.missingEmailError);
      expect(validateEmail(content, ' \t\r\n  ')).to.eq(
        content.missingEmailError,
      );
    });
    it('should return invalid email error', () => {
      expect(validateEmail(content, 'test')).to.eq(content.invalidEmail);
      expect(validateEmail(content, 'z@z.c')).to.eq(content.invalidEmail);
      expect(validateEmail(content, '@.com')).to.eq(content.invalidEmail);
      expect(validateEmail(content, 'x@x.')).to.eq(content.invalidEmail);
      expect(validateEmail(content, 'x.com')).to.eq(content.invalidEmail);
    });
  });
  describe('validatePhone', () => {
    const makePhoneObj = (areaCode, phoneNumber) => ({
      areaCode,
      phoneNumber,
    });
    it('should return empty string for valid phone numbers', () => {
      expect(validatePhone(content, makePhoneObj('800', '5551212'))).to.eq('');
      expect(validatePhone(content, makePhoneObj('  800', '5551212  '))).to.eq(
        '',
      );
    });
    it('should return missing phone error', () => {
      expect(validatePhone(content, makePhoneObj())).to.eq(
        content.missingPhoneError,
      );
      expect(validatePhone(content, makePhoneObj('  ', '  \t\r\n '))).to.eq(
        content.missingPhoneError,
      );
    });
    it('should return invalid phone error', () => {
      expect(validatePhone(content, makePhoneObj('80', '5551212'))).to.eq(
        content.invalidPhone,
      );
      expect(validatePhone(content, makePhoneObj('80', '55'))).to.eq(
        content.invalidPhone,
      );
      expect(validatePhone(content, makePhoneObj('800', '555121'))).to.eq(
        content.invalidPhone,
      );
      expect(validatePhone(content, makePhoneObj('80', '5551212'))).to.eq(
        content.invalidPhone,
      );
      expect(validatePhone(content, makePhoneObj('8000', '555121212'))).to.eq(
        content.invalidPhone,
      );
    });
  });
  describe('validateZipcode', () => {
    it('should return empty string for valid zipcodes', () => {
      expect(validateZipcode(content, '90210')).to.eq('');
      expect(validateZipcode(content, '55555')).to.eq('');
      expect(validateZipcode(content, '  12345  ')).to.eq('');
    });
    it('should return missing zipcode error', () => {
      const error = content.missingZipError(true);
      expect(validateZipcode(content, '')).to.eq(error);
      expect(validateZipcode(content, '     ')).to.eq(error);
      expect(validateZipcode(content, '  \t\r\n  ')).to.eq(error);
    });
    it('should return invalid zipcode error', () => {
      const error = content.invalidZip(true);
      expect(validateZipcode(content, '1')).to.eq(error);
      expect(validateZipcode(content, '12')).to.eq(error);
      expect(validateZipcode(content, '123')).to.eq(error);
      expect(validateZipcode(content, '1234')).to.eq(error);
      expect(validateZipcode(content, '123456')).to.eq(error);
      expect(validateZipcode(content, 'abcde')).to.eq(error);
      expect(validateZipcode(content, '123cd')).to.eq(error);
    });
  });

  describe('convertNullishObjectValuesToEmptyString', () => {
    it('should return an empty object', () => {
      expect(convertNullishObjectValuesToEmptyString()).to.deep.equal({});
      expect(convertNullishObjectValuesToEmptyString('')).to.deep.equal({});
      expect(convertNullishObjectValuesToEmptyString(null)).to.deep.equal({});
    });
    it('should return object with falsy (not boolean) values replaced with an empty string', () => {
      expect(
        convertNullishObjectValuesToEmptyString({ test: null }),
      ).to.deep.equal({
        test: '',
      });
      expect(
        convertNullishObjectValuesToEmptyString({ test: undefined }),
      ).to.deep.equal({
        test: '',
      });
      expect(
        convertNullishObjectValuesToEmptyString({
          test: null,
          test2: '',
          test3: undefined,
          test4: false,
        }),
      ).to.deep.equal({ test: '', test2: '', test3: '', test4: false });
      expect(
        convertNullishObjectValuesToEmptyString({
          test: [],
          test2: 'string',
          test3: null,
          test4: false,
          test5: {},
        }),
      ).to.deep.equal({
        test: [],
        test2: 'string',
        test3: '',
        test4: false,
        test5: {},
      });
    });
    it('should not alter nested objects', () => {
      expect(
        convertNullishObjectValuesToEmptyString({
          test: [],
          test2: 'string',
          test3: null,
          test4: false,
          test5: { test6: null, test7: false },
        }),
      ).to.deep.equal({
        test: [],
        test2: 'string',
        test3: '',
        test4: false,
        test5: { test6: null, test7: false },
      });
    });
  });
});
