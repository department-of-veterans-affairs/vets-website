import { expect } from 'chai';

import {
  returnPhoneObject,
  getPhoneString,
  getFormattedPhone,
  hasHomePhone,
  hasMobilePhone,
  hasHomeAndMobilePhone,
  setReturnState,
  getReturnState,
  clearReturnState,
} from '../../utils/contactInfo';
import { CONTACT_EDIT } from '../../constants';

const getPhone = ({
  country = '1',
  area = '800',
  number = '5551212',
} = {}) => ({
  countryCode: country,
  areaCode: area,
  phoneNumber: number,
  phoneNumberExt: '',
});

describe('returnPhoneObject', () => {
  const emptyPhone = getPhone({ country: '', area: '', number: '' });
  it('should return empty phone object', () => {
    expect(returnPhoneObject()).to.deep.equal(emptyPhone);
    expect(returnPhoneObject(undefined)).to.deep.equal(emptyPhone);
    expect(returnPhoneObject(null)).to.deep.equal(emptyPhone);
    expect(returnPhoneObject([])).to.deep.equal(emptyPhone);
    expect(returnPhoneObject('1234')).to.deep.equal(emptyPhone);
  });
  it('should return a phone object', () => {
    expect(returnPhoneObject('8005551212')).to.deep.equal(getPhone());
  });
});

describe('getPhoneString', () => {
  const phone = getPhone();
  it('should return a full phone number', () => {
    expect(getPhoneString(phone)).to.eq(phone.areaCode + phone.phoneNumber);
  });
  it('should return a partial phone number', () => {
    expect(getPhoneString({ areaCode: '123' })).to.eq('123');
    expect(getPhoneString({ phoneNumber: '4567890' })).to.eq('4567890');
  });
});

describe('getFormattedPhone', () => {
  it('should return an empty string', () => {
    expect(getFormattedPhone()).to.eq('');
    expect(getFormattedPhone(getPhone({ area: '', number: '' }))).to.eq('');
    expect(
      getFormattedPhone(getPhone({ area: '123', number: '456789' })),
    ).to.eq('');
    expect(getFormattedPhone(getPhone({ area: '' }))).to.eq('');
  });
  it('should return a formatted phone number', () => {
    expect(getFormattedPhone(getPhone())).to.eq('(800) 555-1212');
  });
});

const getVeteran = ({
  homePhone = getPhone(),
  mobilePhone = getPhone({ number: '9876543' }),
} = {}) => ({
  veteran: {
    homePhone,
    mobilePhone,
  },
});

describe('hasHomePhone', () => {
  it('should return false for no home phone', () => {
    const data = getVeteran({ homePhone: {} });
    expect(hasHomePhone(data)).to.be.false;
  });
  it('should return false for partial home phone', () => {
    const data = number => getVeteran({ homePhone: getPhone({ number }) });
    expect(hasHomePhone(data('123'))).to.be.false;
    expect(hasHomePhone(data('1234'))).to.be.false;
    expect(hasHomePhone(data('12345'))).to.be.false;
    expect(hasHomePhone(data('123456'))).to.be.false;
    expect(hasHomePhone(data('12345678'))).to.be.false;
  });
  it('should return true for valid home phone', () => {
    const data = getVeteran({ homePhone: getPhone() });
    expect(hasHomePhone(data)).to.be.true;
  });
});

describe('hasMobilePhone', () => {
  it('should return false for no mobile phone', () => {
    const data = getVeteran({ mobilePhone: {} });
    expect(hasMobilePhone(data)).to.be.false;
  });
  it('should return false for partial mobile phone', () => {
    const data = number => getVeteran({ mobilePhone: getPhone({ number }) });
    expect(hasMobilePhone(data('123'))).to.be.false;
    expect(hasMobilePhone(data('1234'))).to.be.false;
    expect(hasMobilePhone(data('12345'))).to.be.false;
    expect(hasMobilePhone(data('123456'))).to.be.false;
    expect(hasMobilePhone(data('12345678'))).to.be.false;
  });
  it('should return true for valid mobile phone', () => {
    const data = getVeteran({ mobilePhone: getPhone() });
    expect(hasMobilePhone(data)).to.be.true;
  });
});

describe('hasHomeAndMobilePhone', () => {
  const getBoth = (number1, number2) =>
    getVeteran({
      homePhone: number1 ? getPhone({ number: number1 }) : {},
      mobilePhone: number2 ? getPhone({ number: number2 }) : {},
    });
  it('should return false for one or less phones', () => {
    expect(hasHomeAndMobilePhone(getBoth())).to.be.false;
    expect(hasHomeAndMobilePhone(getBoth(undefined, '1234567'))).to.be.false;
    expect(hasHomeAndMobilePhone(getBoth('1234567', undefined))).to.be.false;
  });
  it('should return false for partial home or mobile phone', () => {
    // partial home phone
    expect(hasHomeAndMobilePhone(getBoth('123', '1234567'))).to.be.false;
    expect(hasHomeAndMobilePhone(getBoth('1234', '1234567'))).to.be.false;
    expect(hasHomeAndMobilePhone(getBoth('12345', '1234567'))).to.be.false;
    expect(hasHomeAndMobilePhone(getBoth('123456', '1234567'))).to.be.false;
    expect(hasHomeAndMobilePhone(getBoth('12345678', '1234567'))).to.be.false;
    // partial mobile phone
    expect(hasHomeAndMobilePhone(getBoth('1234567', '123'))).to.be.false;
    expect(hasHomeAndMobilePhone(getBoth('1234567', '1234'))).to.be.false;
    expect(hasHomeAndMobilePhone(getBoth('1234567', '12345'))).to.be.false;
    expect(hasHomeAndMobilePhone(getBoth('1234567', '123456'))).to.be.false;
    expect(hasHomeAndMobilePhone(getBoth('1234567', '12345678'))).to.be.false;
  });
  it('should return true for valid mobile phone', () => {
    const data = getVeteran({ homePhone: getPhone(), mobilePhone: getPhone() });
    expect(hasHomeAndMobilePhone(data)).to.be.true;
  });
});

describe('contact editing state', () => {
  describe('setReturnState', () => {
    it('should combine the key and state into a comma separated string', () => {
      setReturnState();
      expect(window.sessionStorage.getItem(CONTACT_EDIT)).to.eq(',');
      setReturnState('key', 'state');
      expect(window.sessionStorage.getItem(CONTACT_EDIT)).to.eq('key,state');
    });
  });
  describe('getReturnState', () => {
    it('should get the key and state comma separated string', () => {
      window.sessionStorage.removeItem(CONTACT_EDIT);
      expect(getReturnState()).to.eq('');
      window.sessionStorage.setItem(CONTACT_EDIT, 'foo,bar');
      expect(getReturnState()).to.eq('foo,bar');
    });
  });
  describe('clearReturnState', () => {
    it('should clear storage state', () => {
      window.sessionStorage.setItem(CONTACT_EDIT, 'foo,bar');
      clearReturnState();
      expect(window.sessionStorage.getItem(CONTACT_EDIT)).to.eq(null);
    });
  });
});
