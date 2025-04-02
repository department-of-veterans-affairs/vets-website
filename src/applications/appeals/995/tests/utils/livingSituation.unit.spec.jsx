import { expect } from 'chai';

import {
  hasHousingRisk,
  hasOtherHousingRisk,
} from '../../utils/livingSituation';

import { SC_NEW_FORM_DATA } from '../../constants';

describe('hasHousingRisk', () => {
  it('should return expected value', () => {
    expect(
      hasHousingRisk({ [SC_NEW_FORM_DATA]: undefined, housingRisk: false }),
    ).to.be.undefined;
    expect(hasHousingRisk({ [SC_NEW_FORM_DATA]: true, housingRisk: false })).to
      .be.false;
    expect(hasHousingRisk({ [SC_NEW_FORM_DATA]: true, housingRisk: true })).to
      .be.true;
    expect(hasHousingRisk({ [SC_NEW_FORM_DATA]: false, housingRisk: false })).to
      .be.false;
    expect(hasHousingRisk({ [SC_NEW_FORM_DATA]: false, housingRisk: true })).to
      .be.false;
  });
});

describe('hasOtherHousingRisk', () => {
  it('should return expected value', () => {
    expect(
      hasOtherHousingRisk({
        [SC_NEW_FORM_DATA]: undefined,
        housingRisk: undefined,
        livingSituation: { other: false },
      }),
    ).to.be.undefined;

    expect(
      hasOtherHousingRisk({
        [SC_NEW_FORM_DATA]: undefined,
        housingRisk: true,
        livingSituation: { other: false },
      }),
    ).to.be.undefined;
    expect(
      hasOtherHousingRisk({
        [SC_NEW_FORM_DATA]: undefined,
        housingRisk: true,
        livingSituation: { other: true },
      }),
    ).to.be.undefined;
    expect(
      hasOtherHousingRisk({
        [SC_NEW_FORM_DATA]: undefined,
        housingRisk: false,
        livingSituation: { other: false },
      }),
    ).to.be.undefined;
    expect(
      hasOtherHousingRisk({
        [SC_NEW_FORM_DATA]: undefined,
        housingRisk: false,
        livingSituation: { other: false },
      }),
    ).to.be.undefined;

    expect(
      hasOtherHousingRisk({
        [SC_NEW_FORM_DATA]: false,
        housingRisk: true,
        livingSituation: { other: false },
      }),
    ).to.be.false;
    expect(
      hasOtherHousingRisk({
        [SC_NEW_FORM_DATA]: false,
        housingRisk: true,
        livingSituation: { other: true },
      }),
    ).to.be.false;
    expect(
      hasOtherHousingRisk({
        [SC_NEW_FORM_DATA]: false,
        housingRisk: false,
        livingSituation: { other: false },
      }),
    ).to.be.false;
    expect(
      hasOtherHousingRisk({
        [SC_NEW_FORM_DATA]: false,
        housingRisk: false,
        livingSituation: { other: false },
      }),
    ).to.be.false;

    expect(
      hasOtherHousingRisk({
        [SC_NEW_FORM_DATA]: true,
        housingRisk: true,
        livingSituation: { other: false },
      }),
    ).to.be.false;
    expect(
      hasOtherHousingRisk({
        [SC_NEW_FORM_DATA]: true,
        housingRisk: true,
        livingSituation: { other: true },
      }),
    ).to.be.true;
    expect(
      hasOtherHousingRisk({
        [SC_NEW_FORM_DATA]: true,
        housingRisk: false,
        livingSituation: { other: false },
      }),
    ).to.be.false;
    expect(
      hasOtherHousingRisk({
        [SC_NEW_FORM_DATA]: true,
        housingRisk: false,
        livingSituation: { other: false },
      }),
    ).to.be.false;
  });
});
