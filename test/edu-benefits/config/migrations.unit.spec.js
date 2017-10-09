import { expect } from 'chai';

import formConfig1990 from '../../../src/js/edu-benefits/1990/config/form';
import formConfig1990e from '../../../src/js/edu-benefits/1990e/config/form';
import formConfig1990n from '../../../src/js/edu-benefits/1990n/config/form';
import formConfig1995 from '../../../src/js/edu-benefits/1995/config/form';
import formConfig5490 from '../../../src/js/edu-benefits/5490/config/form';
import formConfig5495 from '../../../src/js/edu-benefits/5495/config/form';

const migrations1990 = formConfig1990.migrations;
const migrations1990e = formConfig1990e.migrations;
const migrations1990n = formConfig1990n.migrations;
const migrations1995 = formConfig1995.migrations;
const migrations5490 = formConfig5490.migrations;
const migrations5495 = formConfig5495.migrations;

describe('EDU migrations', () => {
  describe('first migration', () => {
    it('should remove urlPrefix from return_url', () => {
      const data1990 = {
        formId: formConfig1990.formId,
        metadata: {
          return_url: '/1990/abc/' // eslint-disable-line camelcase
        }
      };

      const data1990e = {
        formId: formConfig1990e.formId,
        metadata: {
          return_url: '/1990E/abc/' // eslint-disable-line camelcase
        }
      };

      const data1990n = {
        formId: formConfig1990n.formId,
        metadata: {
          return_url: '/1990n/abc/' // eslint-disable-line camelcase
        }
      };

      const data1995 = {
        formId: formConfig1995.formId,
        metadata: {
          return_url: '/1995/abc/' // eslint-disable-line camelcase
        }
      };

      const data5490 = {
        formId: formConfig5490.formId,
        metadata: {
          return_url: '/5490/abc/' // eslint-disable-line camelcase
        }
      };

      const data5495 = {
        formId: formConfig5495.formId,
        metadata: {
          return_url: '/5495/abc/' // eslint-disable-line camelcase
        }
      };

      expect(migrations1990[0](data1990)).to.eql({
        formId: formConfig1990.formId,
        metadata: {
          return_url: '/abc/' // eslint-disable-line camelcase
        }
      });

      expect(migrations1990e[0](data1990e)).to.eql({
        formId: formConfig1990e.formId,
        metadata: {
          return_url: '/abc/' // eslint-disable-line camelcase
        }
      });

      expect(migrations1990n[0](data1990n)).to.eql({
        formId: formConfig1990n.formId,
        metadata: {
          return_url: '/abc/' // eslint-disable-line camelcase
        }
      });

      expect(migrations1995[0](data1995)).to.eql({
        formId: formConfig1995.formId,
        metadata: {
          return_url: '/abc/' // eslint-disable-line camelcase
        }
      });

      expect(migrations5490[0](data5490)).to.eql({
        formId: formConfig5490.formId,
        metadata: {
          return_url: '/abc/' // eslint-disable-line camelcase
        }
      });

      expect(migrations5495[0](data5495)).to.eql({
        formId: formConfig5495.formId,
        metadata: {
          return_url: '/abc/' // eslint-disable-line camelcase
        }
      });
    });
  });
});
