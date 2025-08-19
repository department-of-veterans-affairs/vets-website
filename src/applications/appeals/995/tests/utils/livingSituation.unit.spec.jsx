import { expect } from 'chai';

import {
  hasHousingRisk,
  hasOtherHousingRisk,
} from '../../utils/livingSituation';

describe('hasHousingRisk', () => {
  it('should return expected value', () => {
    expect(hasHousingRisk({ housingRisk: false })).to.be.false;
    expect(hasHousingRisk({ housingRisk: true })).to.be.true;
    expect(hasHousingRisk({ housingRisk: undefined })).to.be.undefined;
    expect(hasHousingRisk({})).to.be.undefined;
  });
});

describe('hasOtherHousingRisk', () => {
  it('should return expected value', () => {
    expect(
      hasOtherHousingRisk({
        housingRisk: undefined,
        livingSituation: { other: false },
      }),
    ).to.be.undefined;

    expect(
      hasOtherHousingRisk({
        housingRisk: undefined,
        livingSituation: { other: true },
      }),
    ).to.be.undefined;

    expect(
      hasOtherHousingRisk({
        housingRisk: false,
        livingSituation: { other: false },
      }),
    ).to.be.false;

    expect(
      hasOtherHousingRisk({
        housingRisk: false,
        livingSituation: { other: true },
      }),
    ).to.be.false;

    expect(
      hasOtherHousingRisk({
        housingRisk: true,
        livingSituation: { other: false },
      }),
    ).to.be.false;

    expect(
      hasOtherHousingRisk({
        housingRisk: true,
        livingSituation: { other: true },
      }),
    ).to.be.true;

    expect(
      hasOtherHousingRisk({
        housingRisk: true,
      }),
    ).to.be.undefined;

    expect(
      hasOtherHousingRisk({
        housingRisk: true,
        livingSituation: {},
      }),
    ).to.be.undefined;
  });
});
