import { expect } from 'chai';

import formConfig1995 from '../../1995/config/form';
import formConfig5490 from '../../5490/config/form';

const migrations1995 = formConfig1995.migrations;
const migrations5490 = formConfig5490.migrations;

describe('EDU migrations', () => {
  describe('first migration', () => {
    it('should remove urlPrefix from returnUrl', () => {
      const data1995 = {
        formId: formConfig1995.formId,
        metadata: {
          returnUrl: '/1995/abc/',
        },
      };

      const data5490 = {
        formId: formConfig5490.formId,
        metadata: {
          returnUrl: '/5490/abc/',
        },
      };

      expect(migrations1995[0](data1995)).to.eql({
        formId: formConfig1995.formId,
        metadata: {
          returnUrl: '/abc/',
        },
      });

      expect(migrations5490[0](data5490)).to.eql({
        formId: formConfig5490.formId,
        metadata: {
          returnUrl: '/abc/',
        },
      });
    });
  });
});
