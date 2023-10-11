import { expect } from 'chai';
import { render } from '@testing-library/react';
import { maskSSN, normalizeFullName } from '../../../../utils/helpers/general';

describe('ezr general helpers', () => {
  describe('when `maskSSN` executes', () => {
    context('when a value is omitted from the function', () => {
      it('should gracefully return an element with screenreader text that declares a blank value was provided', () => {
        const { container } = render(maskSSN());
        const selectors = {
          visual: container.querySelector('[aria-hidden]'),
          srOnly: container.querySelector('.sr-only'),
        };
        expect(selectors.visual).to.contain.text('');
        expect(selectors.srOnly).to.contain.text('is blank');
      });
    });

    context('when a value of `null` is passed to the function', () => {
      it('should gracefully return an element with screenreader text that declares a blank value was provided', () => {
        const { container } = render(maskSSN(null));
        const selectors = {
          visual: container.querySelector('[aria-hidden]'),
          srOnly: container.querySelector('.sr-only'),
        };
        expect(selectors.visual).to.contain.text('');
        expect(selectors.srOnly).to.contain.text('is blank');
      });
    });

    context('when a value is provided to the function', () => {
      it('should return a masked value with the last 4 chars and screenreader text that will read the last 4 chars', () => {
        const { container } = render(maskSSN('211111111'));
        const selectors = {
          visual: container.querySelector('[aria-hidden]'),
          srOnly: container.querySelector('.sr-only'),
        };
        expect(selectors.visual).to.contain.text('●●●–●●–1111');
        expect(selectors.srOnly).to.contain.text('ending with 1 1 1 1');
      });
    });
  });

  describe('when `normalizeFullName` executes', () => {
    context('when a value is omitted from the function', () => {
      it('should gracefully return an empty string', () => {
        expect(normalizeFullName()).to.be.empty;
      });
    });

    context('when an empty object is provided to the function', () => {
      it('should gracefully return an empty string', () => {
        expect(normalizeFullName({})).to.be.empty;
      });
    });

    context('when name object is provided to the function', () => {
      const fullName = {
        first: 'John',
        middle: 'David',
        last: 'Smith',
        suffix: 'Jr.',
      };

      context('when the `outputMiddle` param is excluded', () => {
        it('should return first name, last name and suffix', () => {
          expect(normalizeFullName(fullName)).to.equal('John Smith Jr.');
        });
      });

      context('when the `outputMiddle` param is included', () => {
        context('when `outputMiddle` is set to `false`', () => {
          it('should return first name, last name and suffix', () => {
            expect(normalizeFullName(fullName, false)).to.equal(
              'John Smith Jr.',
            );
          });
        });

        context('when `outputMiddle` is set to `false`', () => {
          it('should return first name, middle name, last name and suffix', () => {
            expect(normalizeFullName(fullName, true)).to.equal(
              'John David Smith Jr.',
            );
          });
        });

        context('when `outputMiddle` is set to `true`', () => {
          it('should return first name, middle name, last name and suffix', () => {
            expect(normalizeFullName(fullName, true)).to.equal(
              'John David Smith Jr.',
            );
          });

          it('should return first name, last name and suffix when middle name is `null`', () => {
            const fullNameWithoutMiddle = { ...fullName, middle: null };
            expect(normalizeFullName(fullNameWithoutMiddle, true)).to.equal(
              'John Smith Jr.',
            );
          });
        });
      });
    });
  });
});
