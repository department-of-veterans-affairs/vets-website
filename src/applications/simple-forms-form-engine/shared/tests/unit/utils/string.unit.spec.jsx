import { expect } from 'chai';

import { removeLeadingSlash, removeTrailingSlash } from '../../../utils/string';

describe('removeLeadingSlash', () => {
  it('removes the leading slash when present', () => {
    const url = '/path/to/page/';
    const removed = removeLeadingSlash(url);
    expect(removed).to.equal('path/to/page/');
  });

  it('removes only one leading slash if multiple are present', () => {
    const url = '//path/to/page/';
    const removed = removeLeadingSlash(url);
    expect(removed).to.equal('/path/to/page/');
  });

  it('has no effect with leading slash not present', () => {
    const url = 'path/to/page/';
    const removed = removeLeadingSlash(url);
    expect(removed).to.equal('path/to/page/');
  });
});

describe('removeTrailingSlash', () => {
  it('removes the trailing slash when present', () => {
    const url = '/path/to/page/';
    const removed = removeTrailingSlash(url);
    expect(removed).to.equal('/path/to/page');
  });

  it('removes only one trailing slash if multiple are present', () => {
    const url = '/path/to/page//';
    const removed = removeTrailingSlash(url);
    expect(removed).to.equal('/path/to/page/');
  });

  it('has no effect with trailing slash not present', () => {
    const url = '/path/to/page';
    const removed = removeTrailingSlash(url);
    expect(removed).to.equal('/path/to/page');
  });
});
