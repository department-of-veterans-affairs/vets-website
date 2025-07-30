import { expect } from 'chai';

import { toPascalCase, toSentenceCase } from '../../util/string-helpers';

describe('toPascalCase', () => {
  it('Generates PascalCase from a string', () => {
    const string = 'This is sentence case';
    const oddString = 'this Is SENTENCE CASE';
    const camelString = 'thisIsSentenceCase';

    expect(toPascalCase(string)).to.eq('ThisIsSentenceCase');
    expect(toPascalCase(oddString)).to.eq('ThisIsSentenceCase');
    expect(toPascalCase(camelString)).to.eq('ThisIsSentenceCase');
  });
});

describe('toSentenceCase', () => {
  it('Generates Sentence case from a string', () => {
    const string = 'InManualReview';
    const camelString = 'inManualReview';
    const lowString = 'in manual review';

    expect(toSentenceCase(string)).to.eq('In manual review');
    expect(toSentenceCase(camelString)).to.eq('In manual review');
    expect(toSentenceCase(lowString)).to.eq('In manual review');
  });
});
