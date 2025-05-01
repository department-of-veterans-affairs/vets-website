import { expect } from 'chai';
import {
  getFirstAccordionHeader,
  getSecondAccordionHeader,
  getThirdAccordionHeader,
  getFourthAccordionHeader,
  getFifthAccordionHeader,
} from '../utilities/results-accordions';

/* eslint-disable camelcase */
const limits = {
  national_threshold: 44444,
  pension_threshold: 22222,
  gmt_threshold: 77777,
};

const nonStandardLimits = {
  national_threshold: 44444,
  pension_threshold: 22222,
  gmt_threshold: 33333,
};

const oddLimits = {
  national_threshold: 30929,
  pension_threshold: 40185,
  gmt_threshold: 50611,
};

const oddLimitsNonStandard = {
  national_threshold: 60929,
  pension_threshold: 40185,
  gmt_threshold: 50611,
};

describe('getFirstAccordionHeader', () => {
  it('should return the correct output', () => {
    expect(getFirstAccordionHeader(limits.pension_threshold)).to.equal(
      '$22,222 or less',
    );
  });
});

describe('getSecondAccordionHeader', () => {
  it('should return the correct output', () => {
    expect(
      getSecondAccordionHeader(
        limits.pension_threshold,
        limits.national_threshold,
      ),
    ).to.equal('$22,223 - $44,444');
  });
});

describe('getThirdAccordionHeader', () => {
  it('should return the correct output for the standard case', () => {
    expect(
      getThirdAccordionHeader(
        limits.national_threshold,
        limits.gmt_threshold,
        true,
      ),
    ).to.equal('$44,445 - $77,777');
  });
});

describe('getFourthAccordionHeader', () => {
  it('should return the correct output for the non-standard case', () => {
    expect(
      getFourthAccordionHeader(
        nonStandardLimits.national_threshold,
        nonStandardLimits.gmt_threshold,
        false,
      ),
    ).to.equal('$44,445 - $48,889');
  });

  it('should return the correct output for the standard case', () => {
    expect(
      getFourthAccordionHeader(
        limits.national_threshold,
        limits.gmt_threshold,
        true,
      ),
    ).to.equal('$77,778 - $85,555');
  });

  it('should return the correct output for odd numbers for the non-standard case', () => {
    expect(
      getFourthAccordionHeader(
        oddLimitsNonStandard.national_threshold,
        oddLimitsNonStandard.gmt_threshold,
        false,
      ),
    ).to.equal('$60,930 - $67,022');
  });

  it('should return the correct output for odd numbers for the standard case', () => {
    expect(
      getFourthAccordionHeader(
        oddLimits.national_threshold,
        oddLimits.gmt_threshold,
        true,
      ),
    ).to.equal('$50,612 - $55,673');
  });
});

// Only appears for standard case
describe('getFifthAccordionHeader', () => {
  it('should return the correct output for the non-standard case', () => {
    expect(
      getFifthAccordionHeader(
        nonStandardLimits.national_threshold,
        nonStandardLimits.gmt_threshold,
        false,
      ),
    ).to.equal('$48,890 or more');
  });

  it('should return the correct output for odd numbers for the non-standard case', () => {
    expect(
      getFifthAccordionHeader(
        oddLimitsNonStandard.national_threshold,
        oddLimitsNonStandard.gmt_threshold,
        false,
      ),
    ).to.equal('$67,023 or more');
  });

  it('should return the correct output for the standard case', () => {
    expect(getFifthAccordionHeader(limits.gmt_threshold)).to.equal(
      '$85,556 or more',
    );
  });

  it('should return the correct output for odd numbers for the standard case', () => {
    expect(getFifthAccordionHeader(oddLimits.gmt_threshold)).to.equal(
      '$55,674 or more',
    );
  });
});
