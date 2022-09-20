import { expect } from 'chai';

import {
  replaceDescriptionContent,
  replaceSubmittedData,
} from '../../utils/replace';

describe('replaceDescriptionContent', () => {
  it('should return an empty string', () => {
    expect(replaceDescriptionContent()).to.eq('');
    expect(replaceDescriptionContent(null)).to.eq('');
    expect(replaceDescriptionContent('')).to.eq('');
  });
  it('should not alter an these strings', () => {
    expect(replaceDescriptionContent('   ')).to.eq('   ');
    expect(replaceDescriptionContent('abc 123')).to.eq('abc 123');
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
});

describe('replaceSubmittedData', () => {
  it('should return an empty string', () => {
    expect(replaceSubmittedData()).to.eq('');
    expect(replaceSubmittedData(null)).to.eq('');
    expect(replaceSubmittedData('')).to.eq('');
  });
  it('should not alter an these strings', () => {
    expect(replaceSubmittedData('   ')).to.eq('   ');
    expect(replaceSubmittedData('abc 123')).to.eq('abc 123');
  });
  it('should replace typographical apostrophes with a single quote', () => {
    expect(replaceSubmittedData('don’t won’t can’t you’ll')).to.eq(
      "don't won't can't you'll",
    );
    expect(replaceSubmittedData('’100’ times')).to.eq("'100' times");
  });
});
