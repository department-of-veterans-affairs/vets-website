import { expect } from 'chai';

import {
  toPascalCase,
  toSentenceCase,
  currency,
} from '../../util/string-helpers';

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

describe('currency', () => {
  it('Formats numbers as US currency', () => {
    expect(currency(123.45)).to.eq('$123.45');
    expect(currency(123.4)).to.eq('$123.40');
    expect(currency('123.45')).to.eq('$123.45');
    expect(currency(123)).to.eq('$123.00');
    expect(currency(0)).to.eq('$0.00');
    expect(currency('1234.567')).to.eq('$1,234.57');
  });
});
