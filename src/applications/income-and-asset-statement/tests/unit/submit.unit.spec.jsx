import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch } from 'platform/testing/unit/helpers';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import * as SubmitHelpers from '../../config/submit-helpers';
import {
  replacer,
  submit,
  removeDisallowedFields,
  transform,
} from '../../config/submit';

describe('Income and asset submit', () => {
  describe('submit', () => {
    beforeEach(() => {
      window.VetsGov = { pollTimeout: 1 };
      window.URL = {
        createObjectURL: sinon.stub().returns('test'),
      };
    });

    it('should reject if initial request fails', () => {
      mockFetch(new Error('fake error'), false);
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {},
      };

      return submit(form, formConfig).then(
        () => {
          expect.fail();
        },
        err => {
          expect(err.message).to.equal('fake error');
        },
      );
    });

    afterEach(() => {
      delete window.URL;
    });
  });

  describe('transformForSubmit', () => {
    it('should remove undefined, null, and view: prefixed fields', () => {
      const formConfig = {
        chapters: {},
      };
      const formData = {
        data: {
          mailingAddress: { street: '123 Main St' },
          'view:viewField': 'someView',
          undefinedField: undefined,
          nullField: null,
        },
      };

      const transformed = transformForSubmit(formConfig, formData, replacer);

      expect(transformed).to.deep.equal(
        JSON.stringify({
          mailingAddress: { street: '123 Main St' },
        }),
      );
    });
  });

  describe('removeDisallowedFields', () => {
    it('should remove disallowed fields from the form data', () => {
      const form = {
        data: {
          mailingAddress: { street: '123 Main St' }, // allowed field
          vaFileNumberLastFour: 1234, // disallowed field
          veteranSsnLastFour: 5678, // disallowed field
          otherVeteranFullName: {
            first: 'John',
            last: 'Doe',
          }, // disallowed field
          otherVeteranSocialSecurityNumber: '123456789', // disallowed field
          otherVaFileNumber: 'VA1234', // disallowed field
        },
      };

      const cleanedForm = removeDisallowedFields(form);

      expect(cleanedForm.data).to.eql({
        mailingAddress: { street: '123 Main St' },
      });
    });
  });

  describe('replacer', () => {
    it('should clean up empty objects', () => {
      const formConfig = {
        chapters: {},
      };
      const formData = { data: { mailingAddress: {}, telephone: null } };
      const transformed = transformForSubmit(formConfig, formData, replacer);

      expect(transformed).not.to.haveOwnProperty('data');
      expect(transformed).not.to.haveOwnProperty('mailingAddress');
      expect(transformed).not.to.haveOwnProperty('telephone');
    });

    it('should fix arrays', () => {
      const formConfig = {
        chapters: {},
      };
      const formData = {
        data: {
          someArray: [{ recipientName: { first: 'John', last: 'Doe' } }, 2, 3],
        },
      };
      const transformed = transformForSubmit(formConfig, formData, replacer);

      expect(transformed).to.equal(
        JSON.stringify({
          someArray: [{ recipientName: 'John Doe' }, null, null],
        }),
      );
    });
  });

  describe('flattenRecipientName', () => {
    context('should correctly flatten recipient name object to string', () => {
      it('when only first and last are present', () => {
        const recipientName = {
          first: 'John',
          last: 'Doe',
        };
        const flattenedName = replacer('recipientName', recipientName);
        expect(flattenedName).to.equal('John Doe');
      });

      it('when first, middle, and last are present', () => {
        const recipientName = {
          first: 'John',
          middle: 'M',
          last: 'Doe',
        };
        const flattenedName = replacer('recipientName', recipientName);
        expect(flattenedName).to.equal('John M Doe');
      });

      it('when first and last are strings and middle is null', () => {
        const recipientName = {
          first: 'John',
          middle: null,
          last: 'Doe',
        };
        const flattenedName = replacer('recipientName', recipientName);
        expect(flattenedName).to.equal('John Doe');
      });
    });

    it('should return string as is', () => {
      const recipientName = 'Jane Doe';
      const flattenedName = replacer('recipientName', recipientName);
      expect(flattenedName).to.equal('Jane Doe');
    });
  });

  describe('transform - shouldRemap conditions', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy(SubmitHelpers, 'remapOtherVeteranFields');
    });

    afterEach(() => {
      spy.restore();
    });

    it('calls remapOtherVeteranFields when not logged in', () => {
      const form = {
        data: {
          isLoggedIn: false,
        },
      };

      transform({}, form);
      expect(spy.calledOnce).to.be.true;
    });

    it('calls remapOtherVeteranFields when isLoggedIn is undefined', () => {
      const form = {
        data: {},
      };

      transform({}, form);
      expect(spy.calledOnce).to.be.true;
    });

    it('calls remapOtherVeteranFields when logged in and claimantType is not VETERAN', () => {
      const form = {
        data: {
          isLoggedIn: true,
          claimantType: 'SPOUSE',
        },
      };

      transform({}, form);
      expect(spy.calledOnce).to.be.true;
    });

    it('does not call remapOtherVeteranFields when logged in and claimantType is VETERAN', () => {
      const form = {
        data: {
          isLoggedIn: true,
          claimantType: 'VETERAN',
        },
      };

      transform({}, form);
      expect(spy.called).to.be.false;
    });
  });
});
