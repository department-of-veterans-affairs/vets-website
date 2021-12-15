// Node modules.
import { expect } from 'chai';
// Relative imports.
import {
  convertEventTimesToUnix,
  dayOptions,
  defaultSelectedOption,
  deriveEndsAtUnix,
  deriveStartsAtUnix,
  filterByOptions,
  filterEvents,
  hideLegacyEvents,
  monthOptions,
  showLegacyEvents,
} from '.';

describe('convertEventTimesToUnix', () => {
  it('returns what we expect with no arguments', () => {
    expect(convertEventTimesToUnix()).to.deep.equal([]);
  });
});

describe('dayOptions', () => {
  it('returns what we expect', () => {
    expect(dayOptions).to.have.lengthOf(32);
  });
});

describe('defaultSelectedOption', () => {
  it('returns what we expect with no arguments', () => {
    expect(defaultSelectedOption).to.deep.equal({
      label: 'All upcoming',
      value: 'upcoming',
    });
  });
});

describe('deriveEndsAtUnix', () => {
  it('returns what we expect with no arguments', () => {
    expect(deriveEndsAtUnix()).to.equal(undefined);
  });
});

describe('deriveStartsAtUnix', () => {
  it('returns what we expect with no arguments', () => {
    expect(deriveStartsAtUnix()).to.equal(undefined);
  });
});

describe('filterByOptions', () => {
  it('returns what we expect with no arguments', () => {
    expect(filterByOptions.map(option => option.value)).to.deep.equal([
      'upcoming',
      'next-week',
      'next-month',
      'past',
      'specific-date',
      'custom-date-range',
    ]);
  });
});

describe('filterEvents', () => {
  it('returns what we expect with no arguments', () => {
    expect(filterEvents()).to.deep.equal([]);
  });
});

describe('hideLegacyEvents', () => {
  it('returns what we expect with no arguments', () => {
    expect(hideLegacyEvents()).to.equal(undefined);
  });
});

describe('monthOptions', () => {
  it('returns what we expect', () => {
    expect(monthOptions).to.have.lengthOf(13);
  });
});

describe('showLegacyEvents', () => {
  it('returns what we expect with no arguments', () => {
    expect(showLegacyEvents()).to.equal(undefined);
  });
});
