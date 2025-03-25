import { expect } from 'chai';

<<<<<<< HEAD
import formConfig1990 from '../../1990/config/form';
import formConfig1995 from '../../1995/config/form';
import formConfig5490 from '../../5490/config/form';

const migrations1990 = formConfig1990.migrations;
const migrations1995 = formConfig1995.migrations;
const migrations5490 = formConfig5490.migrations;
=======
import formConfig1995 from '../../1995/config/form';

const migrations1995 = formConfig1995.migrations;
>>>>>>> main

describe('EDU migrations', () => {
  describe('first migration', () => {
    it('should remove urlPrefix from returnUrl', () => {
<<<<<<< HEAD
      const data1990 = {
        formId: formConfig1990.formId,
        metadata: {
          returnUrl: '/1990/abc/',
        },
      };

=======
>>>>>>> main
      const data1995 = {
        formId: formConfig1995.formId,
        metadata: {
          returnUrl: '/1995/abc/',
        },
      };

<<<<<<< HEAD
      const data5490 = {
        formId: formConfig5490.formId,
        metadata: {
          returnUrl: '/5490/abc/',
        },
      };
      expect(migrations1990[0](data1990)).to.eql({
        formId: formConfig1990.formId,
        metadata: {
          returnUrl: '/abc/',
        },
      });

=======
>>>>>>> main
      expect(migrations1995[0](data1995)).to.eql({
        formId: formConfig1995.formId,
        metadata: {
          returnUrl: '/abc/',
        },
      });
<<<<<<< HEAD

      expect(migrations5490[0](data5490)).to.eql({
        formId: formConfig5490.formId,
        metadata: {
          returnUrl: '/abc/',
        },
      });
=======
>>>>>>> main
    });
  });
});
