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
  it('should return the correct output for the non-standard case', () => {
    expect(
      getThirdAccordionHeader(
        nonStandardLimits.national_threshold,
        nonStandardLimits.gmt_threshold,
        false,
      ),
    ).to.equal('$44,445 - $48,888');
  });

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
    ).to.equal('$48,889 or more');
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
});

describe('getFifthAccordionHeader', () => {
  it('should return the correct output', () => {
    expect(getFifthAccordionHeader(limits.gmt_threshold)).to.equal(
      '$85,556 or more',
    );
  });
});
