import { expect } from 'chai';

import migrations from '../../../src/js/edu-benefits/config/migrations';

describe('EDU migrations', () => {
  describe('first migration', () => {
    it('should remove formId from return url', () => {
      const data = {
        formId: '1990',
        metadata: {
          return_url: '/1990/abc/'
        }
      };

      expect(migrations[0](data)).to.eql({
        formId: '1990',
        metadata: {
          return_url: '/abc/'
        }
      });
    });
  });
});
