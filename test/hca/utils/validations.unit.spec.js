import { expect } from 'chai';

import {
  isValidFullNameField
} from '../../../src/js/hca/utils/validations.js';

describe('Validations unit tests', () => {
  describe('isValidFullNameField', () => {
    [
      {
        lastName: 'fo',
        allowed: true
      },
      {
        lastName: 'foo',
        allowed: true
      },
      {
        lastName: 'f',
        allowed: false
      },
    ].forEach((lastNameTest) => {
      it(`should${lastNameTest.allowed ? '' : "n't"} allow a last name of ${lastNameTest.lastName}`, () => {
        expect(isValidFullNameField({
          first: {
            value: 'foo'
          },
          middle: {
            value: null
          },
          last: {
            value: lastNameTest.lastName
          }
        })).to.eql(lastNameTest.allowed);
      });
    });
  });
});
