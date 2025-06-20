import { expect } from 'chai';
import {
  getReadOnlyPrimaryOfficialTitle,
  readOnlyCertifyingOfficialArrayOptions,
} from '../helpers';
import { readOnlyCertifyingOfficialIntro } from '../pages/readOnlyCertifyingOfficialIntro';

describe('8794 helpers', () => {
  describe('getReadOnlyPrimaryOfficialTitle', () => {
    it('returns "first  last" (double-space) when no middle name', () => {
      const item = { fullName: { first: 'John', last: 'Doe' } };
      expect(getReadOnlyPrimaryOfficialTitle(item)).to.equal('John Doe');
    });

    it('falls back to "Certifying  last" when first is blank', () => {
      const item = { fullName: { first: '', last: 'Doe' } };
      expect(getReadOnlyPrimaryOfficialTitle(item)).to.equal('Certifying Doe');
    });

    it('falls back to "first  Official" when last is blank', () => {
      const item = { fullName: { first: 'John', last: '' } };
      expect(getReadOnlyPrimaryOfficialTitle(item)).to.equal('John Official');
    });

    it('returns null when item is null', () => {
      expect(getReadOnlyPrimaryOfficialTitle(null)).to.equal(null);
    });
  });

  describe('readOnlyCertifyingOfficialArrayOptions.text helpers', () => {
    const { text } = readOnlyCertifyingOfficialArrayOptions;

    it('getItemName returns "first  last" when no middle', () => {
      const item = { fullName: { first: 'Jane', last: 'Smith' } };
      expect(text.getItemName(item)).to.equal('Jane Smith');
    });

    it('summaryTitle pluralises correctly', () => {
      const zero = { formData: { readOnlyCertifyingOfficials: [] } };
      const two = { formData: { readOnlyCertifyingOfficials: [{}, {}] } };

      expect(text.summaryTitle(zero)).to.equal(
        'Review your read-only certifying official',
      );
      expect(text.summaryTitle(two)).to.equal(
        'Review your read-only certifying officials',
      );
    });

    it('summaryDescriptionWithoutItems shows intro only when list is empty', () => {
      const empty = { formData: { readOnlyCertifyingOfficials: [] } };
      const nonEmpty = { formData: { readOnlyCertifyingOfficials: [{}] } };

      expect(text.summaryDescriptionWithoutItems(empty)).to.equal(
        readOnlyCertifyingOfficialIntro,
      );
      expect(text.summaryDescriptionWithoutItems(nonEmpty)).to.equal(null);
    });

    it('summaryTitleWithoutItems returns the fixed heading', () => {
      expect(text.summaryTitleWithoutItems).to.equal(
        'Add read-only certifying officials',
      );
    });
  });
});
