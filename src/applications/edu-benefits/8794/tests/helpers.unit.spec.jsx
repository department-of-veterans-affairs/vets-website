import { expect } from 'chai';
import {
  getReadOnlyPrimaryOfficialTitle,
  readOnlyCertifyingOfficialArrayOptions,
} from '../helpers';
import { readOnlyCertifyingOfficialIntro } from '../pages/readOnlyCertifyingOfficialIntro';

describe('8794 helpers', () => {
  describe('getReadOnlyPrimaryOfficialTitle', () => {
    it('returns “first last” when both parts exist', () => {
      expect(
        getReadOnlyPrimaryOfficialTitle({
          fullName: { first: 'John', last: 'Doe' },
        }),
      ).to.equal('John Doe');
    });

    it('falls back to “Certifying last” when first name is blank', () => {
      expect(
        getReadOnlyPrimaryOfficialTitle({
          fullName: { first: '', last: 'Doe' },
        }),
      ).to.equal('Certifying Doe');
    });

    it('falls back to “first Official” when last name is blank', () => {
      expect(
        getReadOnlyPrimaryOfficialTitle({
          fullName: { first: 'John', last: '' },
        }),
      ).to.equal('John Official');
    });

    it('returns null when item is null', () => {
      expect(getReadOnlyPrimaryOfficialTitle(null)).to.equal(null);
    });
  });

  describe('readOnlyCertifyingOfficialArrayOptions.text helpers', () => {
    const { text } = readOnlyCertifyingOfficialArrayOptions;

    it('getItemName returns the title built from full name', () => {
      const item = { fullName: { first: 'Jane', last: 'Smith' } };
      expect(text.getItemName(item)).to.equal('Jane Smith');
    });

    it('summaryTitle pluralises correctly', () => {
      const baseProps = { formData: {} };

      expect(
        text.summaryTitle({
          ...baseProps,
          formData: { readOnlyCertifyingOfficials: [] },
        }),
      ).to.equal('Review your read-only certifying official');

      expect(
        text.summaryTitle({
          ...baseProps,
          formData: { readOnlyCertifyingOfficials: [{}, {}] },
        }),
      ).to.equal('Review your read-only certifying officials');
    });

    it('summaryDescriptionWithoutItems shows intro only when list is empty', () => {
      // when array has items → null
      const nonEmptyProps = { formData: { readOnlyCertifyingOfficials: [{}] } };
      expect(text.summaryDescriptionWithoutItems(nonEmptyProps)).to.equal(null);

      // when array is empty → intro JSX fragment
      const emptyProps = { formData: { readOnlyCertifyingOfficials: [] } };
      expect(text.summaryDescriptionWithoutItems(emptyProps)).to.equal(
        readOnlyCertifyingOfficialIntro,
      );
    });
    it('summaryTitleWithoutItems returns the fixed heading', () => {
      expect(text.summaryTitleWithoutItems).to.equal(
        'Add read-only certifying officials',
      );
    });
  });
});
