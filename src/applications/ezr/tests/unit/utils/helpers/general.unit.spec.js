import { expect } from 'chai';
import { normalizeFullName } from '../../../../utils/helpers/general';

describe('ezr general helpers', () => {
  describe('when `normalizeFullName` executes', () => {
    const fullName = {
      first: 'John',
      middle: 'William',
      last: 'Smith',
      suffix: 'Jr.',
    };

    describe('when name object is omitted from the function', () => {
      it('should gracefully return an empty string', () => {
        expect(normalizeFullName()).to.be.empty;
      });
    });

    describe('when name object is provided to the function', () => {
      describe('when the `outputMiddle` param is excluded', () => {
        it('should return first name, last name and suffix', () => {
          expect(normalizeFullName(fullName)).to.equal('John Smith Jr.');
        });
      });

      describe('when the `outputMiddle` param is included', () => {
        describe('when `outputMiddle` is set to `false`', () => {
          it('should return first name, last name and suffix', () => {
            expect(normalizeFullName(fullName, false)).to.equal(
              'John Smith Jr.',
            );
          });
        });

        describe('when `outputMiddle` is set to `false`', () => {
          it('should return first name, middle name, last name and suffix', () => {
            expect(normalizeFullName(fullName, true)).to.equal(
              'John William Smith Jr.',
            );
          });
        });
      });
    });
  });
});
