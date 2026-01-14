import { expect } from 'chai';

/**
 * Unit test helper that verifies the behavior of the `isItemIncomplete` function
 * from array builder options by testing required field presence.
 *
 * For each field in the provided `baseItem`, this function generates a test case that
 * sets the field to `undefined` and expects `isItemIncomplete` to return `true`, indicating
 * the item is considered incomplete without that field. It also verifies that when all
 * fields are present, `isItemIncomplete` returns `false`.
 *
 * @param {Object} options - The array builder options object containing `isItemIncomplete` function.
 * @param {Object} baseItem - A complete item object used as the basis for testing missing fields.
 */
export const testOptionsIsItemIncomplete = (options, baseItem) => {
  describe('isItemIncomplete function', () => {
    Object.keys(baseItem).forEach(field => {
      it(`should return true if ${field} is missing`, () => {
        expect(options.isItemIncomplete({ ...baseItem, [field]: undefined })).to
          .be.true;
      });
    });

    it('should return false if all required fields are present', () => {
      expect(options.isItemIncomplete(baseItem)).to.be.false;
    });
  });
};
