import { expect } from 'chai';

import { toPascalCase, toSentenceCase } from '../../util/string-helpers';

describe('toPascalCase', () => {
  it('Generates PascalCase from a string', () => {
    const string = 'This is sentence case';

    expect(toPascalCase(string)).to.eq('ThisIsSentenceCase');
  });
});

describe('toSentenceCase', () => {
  it('Generates Sentence case from a string', () => {
    const string = 'InManualReview';

    expect(toSentenceCase(string)).to.eq('In manual review');
  });
});
