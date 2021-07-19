import { expect } from 'chai';

import { createAnalyticsSlug } from './index';

describe('check in', () => {
  describe('analytics utils', () => {
    describe('createAnalyticsSlug', () => {
      it('returns a created slug  with undefined', () => {
        const slug = undefined;
        const result = createAnalyticsSlug(slug);
        expect(result).to.equal('check-in-undefined');
      });
      it('returns a created slug  with value', () => {
        const slug = 'testing';
        const result = createAnalyticsSlug(slug);
        expect(result).to.equal('check-in-testing');
      });
    });
  });
});
