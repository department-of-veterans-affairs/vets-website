import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '../../../src/js/utilities/ui';

import {
  getContent,
  standardPhoneSchema,
  standardAddressSchema,
  getPhoneString,
  renderTelephone,
  getMissingInfo,
} from '../../../src/js/utilities/data/profile';

describe('profile utilities', () => {
  describe('getContent', () => {
    it('should return default content', () => {
      const content = getContent();
      expect(Object.keys(content).length).to.eql(29);
      expect(content.alertContent).to.contain('your application');
    });
    it('should return content with custom app name', () => {
      const content = getContent('test');
      expect(content.alertContent).to.contain('your test');
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

  describe('standardAddressSchema', () => {
    it('should return required array', () => {
      expect(standardAddressSchema(true).required.length).to.eq(4);
    });
    it('should return empty required array', () => {
      expect(standardAddressSchema().required.length).to.eq(0);
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
    const phone = { areaCode: '800', phoneNumber: '5551212' };
    it('should return empty string', () => {
      const { container } = render(<div>{renderTelephone(phone)}</div>);
      const vaPhone = $('va-telephone', container);
      expect(vaPhone.getAttribute('contact')).to.eq('8005551212');
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
    const content = {
      missingAddress: 'address',
      missingHomeOrMobile: 'home or mobile',
      missingHomePhone: 'home',
      missingMobilePhone: 'mobile',
      missingEmail: 'email',
    };
    const getData = ({ a = true, e = true, h = true, m = true } = {}) => ({
      a: { addressLine1: a ? '123 Main' : '' },
      e: e ? 'x@x.com' : '',
      h: { phoneNumber: h ? '5551212' : '' },
      m: { phoneNumber: m ? '5551313' : '' },
    });

    const noData = getData({ a: false, e: false, h: false, m: false });

    it('should return empty missing info array', () => {
      expect(
        getMissingInfo({ data: {}, keys, content, requiredKeys: [] }),
      ).to.deep.equal([]);
      expect(
        getMissingInfo({ data: getData(), keys, content, requiredKeys: [] }),
      ).to.deep.equal([]);
      expect(
        getMissingInfo({
          data: getData({ a: false, e: false, h: false, m: false }),
          keys,
          content,
          requiredKeys: [],
        }),
      ).to.deep.equal([]);
    });
    it('should return a missing message for a single area', () => {
      const props = { data: noData, keys, content };

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
          content,
          requiredKeys: ['a', 'e', 'h'],
        }),
      ).to.deep.equal([]);
      expect(
        getMissingInfo({
          data: getData({ h: false }),
          keys,
          content,
          requiredKeys: ['a', 'e', 'm'],
        }),
      ).to.deep.equal([]);
    });
    it('should return a missing message for multiple areas', () => {
      expect(
        getMissingInfo({
          data: noData,
          keys,
          content,
          requiredKeys: ['a', 'e', 'h|m'],
        }),
      ).to.deep.equal(['home or mobile', 'email', 'address']);
      expect(
        getMissingInfo({
          data: noData,
          keys,
          content,
          requiredKeys: ['a', 'e', 'h'],
        }),
      ).to.deep.equal(['home', 'email', 'address']);
      expect(
        getMissingInfo({
          data: noData,
          keys,
          content,
          requiredKeys: ['a', 'e', 'm'],
        }),
      ).to.deep.equal(['mobile', 'email', 'address']);
      expect(
        getMissingInfo({
          data: noData,
          keys,
          content,
          requiredKeys: ['a', 'e', 'h', 'm'],
        }),
      ).to.deep.equal(['home', 'mobile', 'email', 'address']);
    });
    it('should return an empty missing message when all data is present', () => {
      expect(
        getMissingInfo({
          data: getData(),
          keys,
          content,
          requiredKeys: ['a', 'e', 'h|m'],
        }),
      ).to.deep.equal([]);
      expect(
        getMissingInfo({
          data: getData({ m: false }),
          keys,
          content,
          requiredKeys: ['a', 'e', 'h'],
        }),
      ).to.deep.equal([]);
      expect(
        getMissingInfo({
          data: getData({ h: false }),
          keys,
          content,
          requiredKeys: ['a', 'e', 'm'],
        }),
      ).to.deep.equal([]);
    });
  });
});
