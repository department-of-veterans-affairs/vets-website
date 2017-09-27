import { expect } from 'chai';

import migrations from '../../../src/js/hca/config/migrations';

describe('HCA migrations', () => {
  describe('first migration', () => {
    it('should remove hispanic property and add in view: object', () => {
      const data = {
        formData: {
          isSpanishHispanicLatino: false
        }
      };

      expect(migrations[0](data)).to.eql({
        formData: {
          'view:demographicCategories': {
            isSpanishHispanicLatino: false
          }
        }
      });
    });
    it('should not remove existing hispanic choice', () => {
      const data = {
        formData: {
          isSpanishHispanicLatino: false,
          'view:demographicCategories': {
            isSpanishHispanicLatino: true
          }
        }
      };

      expect(migrations[0](data)).to.eql({
        formData: {
          'view:demographicCategories': {
            isSpanishHispanicLatino: true
          }
        }
      });
    });
  });
});
