import { expect } from 'chai';

import { ITF_STATUSES, ITF_SUPPORTED_BENEFIT_TYPES } from '../../constants';

import {
  isNotExpired,
  isActiveITF,
  shouldBlockITF,
  isSupportedBenefitType,
} from '../../utils/itf';

import { parseDateWithOffset } from '../../../shared/utils/dates';

describe('isNotExpired', () => {
  it('should return true', () => {
    expect(isNotExpired(parseDateWithOffset({ days: 1 }))).to.be.true;
    expect(isNotExpired(parseDateWithOffset({ month: 1 }))).to.be.true;
  });
  it('should return false', () => {
    expect(isNotExpired()).to.be.false;
    expect(isNotExpired(parseDateWithOffset({ days: -1 }))).to.be.false;
    expect(isNotExpired(parseDateWithOffset({ months: -1 }))).to.be.false;
  });
});

describe('isActiveITF', () => {
  it('should return true if active & not expired', () => {
    expect(
      isActiveITF({
        status: ITF_STATUSES.active,
        expirationDate: parseDateWithOffset({ days: 1 }),
      }),
    ).to.be.true;
    expect(
      isActiveITF({
        status: ITF_STATUSES.active,
        expirationDate: parseDateWithOffset({ months: 1 }),
      }),
    ).to.be.true;
  });
  it('should return false', () => {
    expect(isActiveITF()).to.be.false;
    expect(isActiveITF({})).to.be.false;
    expect(
      isActiveITF({
        status: '',
        expirationDate: parseDateWithOffset({ days: -1 }),
      }),
    ).to.be.false;
    expect(
      isActiveITF({
        status: ITF_STATUSES.active,
        expirationDate: '',
      }),
    ).to.be.false;
    expect(
      isActiveITF({
        status: ITF_STATUSES.active,
        expirationDate: parseDateWithOffset({ days: -1 }),
      }),
    ).to.be.false;
    expect(
      isActiveITF({
        status: ITF_STATUSES.active,
        expirationDate: parseDateWithOffset({ months: -1 }),
      }),
    ).to.be.false;
  });
});

describe('shouldBlockITF', () => {
  it('should return true', () => {
    expect(shouldBlockITF('/start')).to.be.true;
    expect(shouldBlockITF('/introduction')).to.be.true;
    expect(shouldBlockITF('/confirmation')).to.be.true;
    expect(shouldBlockITF('/form-saved')).to.be.true;
    expect(shouldBlockITF('/error')).to.be.true;
    expect(shouldBlockITF('/resume')).to.be.true;
  });
  it('should return false', () => {
    expect(shouldBlockITF('')).to.be.false;
    expect(shouldBlockITF('/')).to.be.false;
    expect(shouldBlockITF('/middle')).to.be.false;
    expect(shouldBlockITF('/form')).to.be.false;
    expect(shouldBlockITF('/resum')).to.be.false;
    expect(shouldBlockITF('/err')).to.be.false;
  });
});

describe('supportedBenefitType', () => {
  it('should return true', () => {
    expect(isSupportedBenefitType(ITF_SUPPORTED_BENEFIT_TYPES[0])).to.be.true;
    expect(isSupportedBenefitType(ITF_SUPPORTED_BENEFIT_TYPES[1])).to.be.true;
    expect(isSupportedBenefitType('pension')).to.be.true;
  });
  it('should return false', () => {
    expect(isSupportedBenefitType()).to.be.false;
    expect(isSupportedBenefitType('foo')).to.be.false;
    expect(isSupportedBenefitType('1234')).to.be.false;
    expect(isSupportedBenefitType(1234)).to.be.false;
  });
});
