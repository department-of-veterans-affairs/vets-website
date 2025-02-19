import { expect } from 'chai';

import formConfig1990 from '../../1990/config/form';
import formConfig1995 from '../../1995/config/form';

const migrations1990 = formConfig1990.migrations;
const migrations1995 = formConfig1995.migrations;

describe('EDU migrations', () => {
  describe('first migration', () => {
    it('should remove urlPrefix from returnUrl', () => {
      const data1990 = {
        formId: formConfig1990.formId,
        metadata: {
          returnUrl: '/1990/abc/',
        },
      };

      const data1995 = {
        formId: formConfig1995.formId,
        metadata: {
          returnUrl: '/1995/abc/',
        },
      };

      expect(migrations1990[0](data1990)).to.eql({
        formId: formConfig1990.formId,
        metadata: {
          returnUrl: '/abc/',
        },
      });

      expect(migrations1995[0](data1995)).to.eql({
        formId: formConfig1995.formId,
        metadata: {
          returnUrl: '/abc/',
        },
      });
    });
  });
});
