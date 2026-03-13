import { expect } from 'chai';

import {
  returnPhoneObject,
  getPhoneString,
  getFormattedPhone,
  hasMobilePhone,
  setReturnState,
  getReturnState,
  clearReturnState,
} from '../../utils/contactInformation';
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
  });
  it('should return unformatted phone number', () => {
    expect(getFormattedPhone(getPhone({ area: '' }))).to.eq('5551212');
    expect(getFormattedPhone(getPhone({ area: '1', number: '2' }))).to.eq('12');
    expect(
      getFormattedPhone(getPhone({ area: '123', number: '456789' })),
    ).to.eq('123456789');
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

describe('hasMobilePhone', () => {
  const getData = (area, number) =>
    getVeteran({ mobilePhone: getPhone({ area, number }) });
  it('should return false for no mobile phone', () => {
    const data = getVeteran({ mobilePhone: {} });
    expect(hasMobilePhone(data)).to.be.false;
  });
  it('should return false for mobile phone less than desired length', () => {
    expect(hasMobilePhone(getData('', ''))).to.be.false;
    expect(hasMobilePhone(getData('1', ''))).to.be.false;
    expect(hasMobilePhone(getData('', '2'))).to.be.false;
  });
  it('should return false for partial mobile phone', () => {
    expect(hasMobilePhone(getData('1', '2'))).to.be.true;
    expect(hasMobilePhone(getData('12', '3'))).to.be.true;
    expect(hasMobilePhone(getData('123', '4'))).to.be.true;
    expect(hasMobilePhone(getData('1234', '5'))).to.be.true;
    expect(hasMobilePhone(getData('123', '45'))).to.be.true;
    expect(hasMobilePhone(getData('123', '456'))).to.be.true;
    expect(hasMobilePhone(getData('123', '4567'))).to.be.true;
    expect(hasMobilePhone(getData('123', '45678'))).to.be.true;
    expect(hasMobilePhone(getData('123', '456789'))).to.be.true;
  });
  it('should return true for valid mobile phone', () => {
    expect(hasMobilePhone(getData('123', '4567890'))).to.be.true;
    // schema allows 4 digit area code & 14 digit phone number
    expect(hasMobilePhone(getData('1234', '12345678901234'))).to.be.true;
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
