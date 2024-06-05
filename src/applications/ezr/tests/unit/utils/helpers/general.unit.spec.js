import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  maskSSN,
  parseVeteranDob,
  parseVeteranGender,
  normalizeFullName,
  replaceStrValues,
} from '../../../../utils/helpers/general';

describe('ezr general helpers', () => {
  context('when `maskSSN` executes', () => {
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

  context('when `normalizeFullName` executes', () => {
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

  context('when `parseVeteranDob` executes', () => {
    context('when a value is omitted from the function', () => {
      it('should return `null`', () => {
        expect(parseVeteranDob()).to.eq(null);
      });
    });

    context('when an empty value is passed to the function', () => {
      it('should return `null`', () => {
        expect(parseVeteranDob('')).to.eq(null);
      });
    });

    context('when an invalid value is passed to the function', () => {
      it('should return `null`', () => {
        expect(parseVeteranDob('1990-01-00')).to.eq(null);
      });
    });

    context('when the value is passed to the function is pre-1900', () => {
      it('should return `null`', () => {
        expect(parseVeteranDob('1890-01-01')).to.eq(null);
      });
    });

    context('when the value is between 1900-01-01 and today', () => {
      it('should return the value', () => {
        const validDate = '1990-01-01';
        expect(parseVeteranDob(validDate)).to.eq(validDate);
      });
    });
  });

  context('when `parseVeteranGender` executes', () => {
    context('when a value is omitted from the function', () => {
      it('should return `null`', () => {
        expect(parseVeteranGender()).to.eq(null);
      });
    });

    context('when an empty value is passed to the function', () => {
      it('should return `null`', () => {
        expect(parseVeteranGender('')).to.eq(null);
      });
    });

    context('when the value is valid', () => {
      it('should return the value', () => {
        const validBirthSex = 'M';
        expect(parseVeteranGender(validBirthSex)).to.eq(validBirthSex);
      });
    });
  });

  context('when `replaceStrValues` executes', () => {
    context(
      'when both the source string and replacement value are omitted from the function',
      () => {
        it('should gracefully return an empty string', () => {
          expect(replaceStrValues()).to.be.empty;
        });
      },
    );

    context('when the replacement value is omitted from the function', () => {
      it('should gracefully return an empty string', () => {
        const str = 'Insurance information for %s';
        expect(replaceStrValues(str)).to.be.empty;
      });
    });

    context('when all required values are provided to the function', () => {
      it('should the correct string', () => {
        const str = 'Insurance information for %s';
        const val = 'Mary Smith';
        expect(replaceStrValues(str, val)).to.equal(
          'Insurance information for Mary Smith',
        );
      });
    });
  });
});
