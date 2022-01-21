import { expect } from 'chai';

import { replaceDescriptionContent } from '../../utils/replace';

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
