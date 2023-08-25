import { expect } from 'chai';

import {
  replaceDescriptionContent,
  replaceSubmittedData,
  fixDateFormat,
} from '../../utils/replace';

describe('replaceDescriptionContent', () => {
  it('should return an empty string', () => {
    expect(replaceDescriptionContent()).to.eq('');
    expect(replaceDescriptionContent(null)).to.eq('');
    expect(replaceDescriptionContent('')).to.eq('');
  });
  it('should return an empty string for non-string types', () => {
    expect(replaceDescriptionContent({})).to.eq('');
    expect(replaceDescriptionContent(true)).to.eq('');
    expect(replaceDescriptionContent(10)).to.eq('');
  });
  it('should not alter an these strings', () => {
    expect(replaceDescriptionContent('abc 123')).to.eq('abc 123');
    expect(replaceDescriptionContent('a b c 123')).to.eq('a b c 123');
  });
  it('should replace percent with a % symbol', () => {
    expect(replaceDescriptionContent('10 percent')).to.eq('10%');
    expect(replaceDescriptionContent('10 percent.')).to.eq('10%.');
    expect(replaceDescriptionContent('Percent effective')).to.eq('% effective');
    expect(replaceDescriptionContent('Equal to 30 percent income')).to.eq(
      'Equal to 30% income',
    );
  });
  it('should not replace percent within words', () => {
    expect(replaceDescriptionContent('Percentage due')).to.eq('Percentage due');
    expect(replaceDescriptionContent('20 percentile')).to.eq('20 percentile');
    expect(replaceDescriptionContent('percentpercent')).to.eq('percentpercent');
  });
  it('should strip out multiple whitespace & trim', () => {
    expect(replaceDescriptionContent('   ')).to.eq('');
    expect(replaceDescriptionContent(' a  b  c  \t  d')).to.eq('a b c d');
  });
});

describe('replaceSubmittedData', () => {
  it('should return an empty string', () => {
    expect(replaceSubmittedData()).to.eq('');
    expect(replaceSubmittedData(null)).to.eq('');
    expect(replaceSubmittedData('')).to.eq('');
  });
  it('should return an empty string', () => {
    expect(replaceSubmittedData()).to.eq('');
    expect(replaceSubmittedData(null)).to.eq('');
    expect(replaceSubmittedData('')).to.eq('');
  });
  it('should not alter these strings', () => {
    expect(replaceSubmittedData('abc 123')).to.eq('abc 123');
    expect(replaceSubmittedData('a b c 123')).to.eq('a b c 123');
  });
  it('should replace typographical apostrophes with a single quote', () => {
    expect(replaceSubmittedData('don’t won’t can’t you’ll')).to.eq(
      "don't won't can't you'll",
    );
    expect(replaceSubmittedData('’100’ times')).to.eq("'100' times");
  });
  it('should strip out multiple whitespace & trim', () => {
    expect(replaceSubmittedData('   ')).to.eq('');
    expect(replaceSubmittedData(' a  b  c  \t  d')).to.eq('a b c d');
  });
});

describe('fixDateFormat', () => {
  it('should return an empty strings for empty or non-string values', () => {
    expect(fixDateFormat()).to.eq('');
    expect(fixDateFormat('')).to.eq('');
    expect(fixDateFormat({})).to.eq('');
    expect(fixDateFormat(null)).to.eq('');
    expect(fixDateFormat(10)).to.eq('');
  });
  it('should return invalid dates strings', () => {
    expect(fixDateFormat('-')).to.eq('-00-00');
    expect(fixDateFormat('200')).to.eq('200-00-00');
  });
  it('should return already properly formatted date string', () => {
    expect(fixDateFormat('2020-01-02')).to.eq('2020-01-02');
    expect(fixDateFormat('2023-12-31')).to.eq('2023-12-31');
    expect(fixDateFormat('2000-06-30')).to.eq('2000-06-30');
  });
  it('should return properly formatted date string when passed dates with no leading zero', () => {
    expect(fixDateFormat('2020-1-2')).to.eq('2020-01-02');
    expect(fixDateFormat('2023-10-1')).to.eq('2023-10-01');
    expect(fixDateFormat('2000-6-30')).to.eq('2000-06-30');
  });
  it('should return properly formatted date string when passed dates with weird spacing', () => {
    expect(fixDateFormat('2020--')).to.eq('2020-00-00');
    expect(fixDateFormat('2020-1-')).to.eq('2020-01-00');
    expect(fixDateFormat('2020- 1 - 2 ')).to.eq('2020-01-02');
    expect(fixDateFormat('2023 - 10 - 1')).to.eq('2023-10-01');
    expect(fixDateFormat('2000-6 - 30')).to.eq('2000-06-30');
    expect(fixDateFormat('2000  -  6 - 30')).to.eq('2000-06-30');
    expect(fixDateFormat('2000 \t - \t 6 \t - \t 30')).to.eq('2000-06-30');
  });
});
