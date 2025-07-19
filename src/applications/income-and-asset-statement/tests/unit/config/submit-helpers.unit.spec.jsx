// tests/unit/submit-helpers.unit.spec.js
import { expect } from 'chai';
import { remapOtherVeteranFields } from '../../../config/submit-helpers';

describe('submit-helpers.js', () => {
  describe('remapOtherVeteranFields', () => {
    it('should map all available otherVeteran fields to veteran fields', () => {
      const input = {
        otherVeteranFullName: { first: 'Jane', last: 'Doe' },
        otherVeteranSocialSecurityNumber: '123456789',
        otherVaFileNumber: 'VA123456',
      };

      const output = remapOtherVeteranFields(input);

      expect(output.veteranFullName).to.deep.equal(input.otherVeteranFullName);
      expect(output.veteranSocialSecurityNumber).to.equal(
        input.otherVeteranSocialSecurityNumber,
      );
      expect(output.vaFileNumber).to.equal(input.otherVaFileNumber);
    });

    it('should preserve unrelated fields in the original data', () => {
      const input = {
        unrelatedField: 'keep me',
        otherVeteranFullName: { first: 'John', last: 'Smith' },
      };

      const output = remapOtherVeteranFields(input);

      expect(output.unrelatedField).to.equal('keep me');
      expect(output.veteranFullName).to.deep.equal(input.otherVeteranFullName);
    });

    it('should not add veteran fields if otherVeteran fields are missing', () => {
      const input = {
        unrelatedField: true,
      };

      const output = remapOtherVeteranFields(input);

      expect(output).to.deep.equal({ unrelatedField: true });
    });

    it('should not mutate the original object', () => {
      const input = {
        otherVeteranFullName: { first: 'Alex', last: 'Doe' },
      };

      const original = { ...input };
      remapOtherVeteranFields(input);

      expect(input).to.deep.equal(original);
    });
  });
});
