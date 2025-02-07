import { expect } from 'chai';
import { parsePhoneNumber } from '../../utils/phoneNumbers';

describe('parsePhoneNumber', () => {
  it('without extension, without dashes', () => {
    const phone = '1234567890';
    const {
      contact,
      extension,
      processed,
      international,
      countryCode,
    } = parsePhoneNumber(phone);
    expect(processed).to.equal(true);
    expect(extension).to.equal(undefined);
    expect(contact).to.equal('1234567890');
    expect(international).to.equal(false);
    expect(countryCode).to.equal(undefined);
  });

  it('with extension, without dashes', () => {
    const phone = '1234567890 x123';
    const {
      contact,
      extension,
      processed,
      international,
      countryCode,
    } = parsePhoneNumber(phone);
    expect(extension).to.equal('123');
    expect(contact).to.equal('1234567890');
    expect(processed).to.equal(true);
    expect(international).to.equal(false);
    expect(countryCode).to.equal(undefined);
  });

  it('with dashes', () => {
    const phone = '123-456--7890';
    const {
      contact,
      extension,
      processed,
      international,
      countryCode,
    } = parsePhoneNumber(phone);
    expect(extension).to.equal(undefined);
    expect(contact).to.equal('1234567890');
    expect(processed).to.equal(true);
    expect(international).to.equal(false);
    expect(countryCode).to.equal(undefined);
  });

  it('with spaces and extension', () => {
    const phone = '123  456 7890 Extension 123';
    const {
      contact,
      extension,
      processed,
      international,
      countryCode,
    } = parsePhoneNumber(phone);
    expect(extension).to.equal('123');
    expect(contact).to.equal('1234567890');
    expect(processed).to.equal(true);
    expect(international).to.equal(false);
    expect(countryCode).to.equal(undefined);
  });

  it('with 800 numbers', () => {
    const phone = '1-800-827-1000';
    const {
      processed,
      extension,
      contact,
      countryCode,
      international,
    } = parsePhoneNumber(phone);
    expect(extension).to.equal(undefined);
    expect(contact).to.equal('8008271000');
    expect(processed).to.equal(true);
    expect(international).to.equal(true);
    expect(countryCode).to.equal(undefined); // because it is 1
  });

  it('with +1-877 numbers', () => {
    const phone = '+1-877-222-8387 ext. 123';
    const {
      processed,
      extension,
      contact,
      countryCode,
      international,
    } = parsePhoneNumber(phone);
    expect(extension).to.equal('123');
    expect(contact).to.equal('8772228387');
    expect(processed).to.equal(true);
    expect(international).to.equal(true);
    expect(countryCode).to.equal(undefined); // because it is 1
  });

  it('with +1(877) numbers', () => {
    const phone = '+1(877) 222-8387 ext 123';
    const {
      processed,
      extension,
      contact,
      countryCode,
      international,
    } = parsePhoneNumber(phone);
    expect(extension).to.equal('123');
    expect(contact).to.equal('8772228387');
    expect(processed).to.equal(true);
    expect(international).to.equal(true);
    expect(countryCode).to.equal(undefined); // because it is 1
  });

  it('should process with extension from result', () => {
    const phone = '573-475-4108 ext 1008';
    const {
      processed,
      extension,
      contact,
      countryCode,
      international,
    } = parsePhoneNumber(phone);
    expect(extension).to.equal('1008');
    expect(contact).to.equal('5734754108');
    expect(processed).to.equal(true);
    expect(international).to.equal(false);
    expect(countryCode).to.equal(undefined);
  });
});
