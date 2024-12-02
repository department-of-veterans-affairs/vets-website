import { expect } from 'chai';

import {
  getPhoneString,
  getFormattedPhone,
  hasHomePhone,
  hasMobilePhone,
  hasHomeAndMobilePhone,
} from '../../utils/contactInfo';

const getPhone = ({
  country = '1',
  area = '800',
  number = '5551212',
  ext = '',
} = {}) => ({
  countryCode: country,
  areaCode: area,
  phoneNumber: number,
  extension: ext,
});

describe('getPhoneString', () => {
  it('should return a full phone number', () => {
    const phone = getPhone();
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
  it('should return a formatted phone number with extension', () => {
    const phone = getPhone({ ext: '54321' });
    expect(getFormattedPhone(phone)).to.eq('(800) 555-1212, ext. 54321');
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
  const getData = (area, number) =>
    getVeteran({ homePhone: getPhone({ area, number }) });
  it('should return false for no home phone', () => {
    const data = getVeteran({ homePhone: {} });
    expect(hasHomePhone(data)).to.be.false;
  });
  it('should return false for home phone less than desired length', () => {
    expect(hasHomePhone(getData('', ''))).to.be.false;
    expect(hasHomePhone(getData('1', ''))).to.be.false;
    expect(hasHomePhone(getData('', '2'))).to.be.false;
  });
  it('should return true for partial home phone', () => {
    expect(hasHomePhone(getData('1', '2'))).to.be.true;
    expect(hasHomePhone(getData('12', '3'))).to.be.true;
    expect(hasHomePhone(getData('123', '4'))).to.be.true;
    expect(hasHomePhone(getData('1234', '5'))).to.be.true;
    expect(hasHomePhone(getData('123', '45'))).to.be.true;
    expect(hasHomePhone(getData('123', '456'))).to.be.true;
    expect(hasHomePhone(getData('123', '4567'))).to.be.true;
    expect(hasHomePhone(getData('123', '45678'))).to.be.true;
    expect(hasHomePhone(getData('123', '456789'))).to.be.true;
  });
  it('should return true for valid home phone', () => {
    expect(hasHomePhone(getData('123', '4567890'))).to.be.true;
    // schema allows 4 digit area code & 14 digit phone number
    expect(hasHomePhone(getData('1234', '12345678901234'))).to.be.true;
  });
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

describe('hasHomeAndMobilePhone', () => {
  const getBoth = (area1, number1, area2 = '123', number2 = '45678890') =>
    getVeteran({
      homePhone: number1 ? getPhone({ area: area1, number: number1 }) : {},
      mobilePhone: number2 ? getPhone({ area: area2, number: number2 }) : {},
    });
  it('should return false for one or less phones', () => {
    expect(hasHomeAndMobilePhone(getBoth())).to.be.false;
    expect(hasHomeAndMobilePhone(getBoth('1', '', '1', ''))).to.be.false;
    expect(hasHomeAndMobilePhone(getBoth('', '2', '', '2'))).to.be.false;
    expect(hasHomeAndMobilePhone(getBoth('123', '4567890', '', ''))).to.be
      .false;
    expect(hasHomeAndMobilePhone(getBoth('123', '4567890', '1', ''))).to.be
      .false;
    expect(hasHomeAndMobilePhone(getBoth('123', '4567890', '', '2'))).to.be
      .false;
    expect(hasHomeAndMobilePhone(getBoth('1', ''))).to.be.false;
    expect(hasHomeAndMobilePhone(getBoth('', '2'))).to.be.false;
  });
  it('should return true for partial home or mobile phone', () => {
    // partial home phone
    expect(hasHomeAndMobilePhone(getBoth('1', '2'))).to.be.true;
    expect(hasHomeAndMobilePhone(getBoth('12', '3'))).to.be.true;
    expect(hasHomeAndMobilePhone(getBoth('123', '4'))).to.be.true;
    expect(hasHomeAndMobilePhone(getBoth('123', '45'))).to.be.true;
    expect(hasHomeAndMobilePhone(getBoth('123', '456'))).to.be.true;
    expect(hasHomeAndMobilePhone(getBoth('123', '45678'))).to.be.true;
    expect(hasHomeAndMobilePhone(getBoth('123', '456789'))).to.be.true;
    expect(hasHomeAndMobilePhone(getBoth('123', '4567890'))).to.be.true;
    // partial mobile phone
    expect(hasHomeAndMobilePhone(getBoth('123', '4567890', '1', '2'))).to.be
      .true;
    expect(hasHomeAndMobilePhone(getBoth('123', '4567890', '12', '3'))).to.be
      .true;
    expect(hasHomeAndMobilePhone(getBoth('123', '4567890', '123', '4'))).to.be
      .true;
    expect(hasHomeAndMobilePhone(getBoth('123', '4567890', '123', '45'))).to.be
      .true;
    expect(hasHomeAndMobilePhone(getBoth('123', '4567890', '123', '456'))).to.be
      .true;
    expect(hasHomeAndMobilePhone(getBoth('123', '4567890', '123', '45678'))).to
      .be.true;
    expect(hasHomeAndMobilePhone(getBoth('123', '4567890', '123', '456789'))).to
      .be.true;
    expect(hasHomeAndMobilePhone(getBoth('123', '4567890', '123', '4567890')))
      .to.be.true;
  });
  it('should return true for valid mobile phone', () => {
    const data = getVeteran({ homePhone: getPhone(), mobilePhone: getPhone() });
    expect(hasHomeAndMobilePhone(data)).to.be.true;
    expect(
      hasHomeAndMobilePhone(
        getBoth('1234', '12345678901234', '1234', '12345678901234'),
      ),
    ).to.be.true;
  });
});
