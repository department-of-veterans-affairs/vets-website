import { expect } from 'chai';

import formConfig from '../../../src/js/hca/config/form';

const migrations = formConfig.migrations;

describe('HCA migrations', () => {
  describe('first migration', () => {
    it('should remove hispanic property and add in view: object', () => {
      const data = {
        isSpanishHispanicLatino: false
      };

      expect(migrations[0](data)).to.eql({
        'view:demographicCategories': {
          isSpanishHispanicLatino: false
        }
      });
    });
    it('should not remove existing hispanic choice', () => {
      const data = {
        isSpanishHispanicLatino: false,
        'view:demographicCategories': {
          isSpanishHispanicLatino: true
        }
      };

      expect(migrations[0](data)).to.eql({
        'view:demographicCategories': {
          isSpanishHispanicLatino: true
        }
      });
    });
  });
});
