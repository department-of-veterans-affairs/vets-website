import { expect } from 'chai';

import formConfig1995 from '../../1995/config/form';

const migrations1995 = formConfig1995.migrations;

describe('EDU migrations', () => {
  describe('first migration', () => {
    it('should remove urlPrefix from returnUrl', () => {
      const data1995 = {
        formId: formConfig1995.formId,
        metadata: {
          returnUrl: '/1995/abc/',
        },
      };

      expect(migrations1995[0](data1995)).to.eql({
        formId: formConfig1995.formId,
        metadata: {
          returnUrl: '/abc/',
        },
      });
    });
  });
});
