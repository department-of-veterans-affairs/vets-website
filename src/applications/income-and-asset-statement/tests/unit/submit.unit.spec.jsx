import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch } from 'platform/testing/unit/helpers';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import * as SubmitHelpers from '../../config/submit-helpers';
import {
  pruneFields,
  pruneFieldsInArray,
  pruneConfiguredArrays,
  removeDisallowedFields,
  removeInvalidFields,
  replacer,
} from '../../config/submit-helpers';
import { submit, transform } from '../../config/submit';

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

  describe('removeInvalidFields', () => {
    it('should remove undefined, null, and view: prefixed fields', () => {
      const formData = {
        data: {
          mailingAddress: { street: '123 Main St' },
          'view:viewField': 'someView',
          undefinedField: undefined,
          nullField: null,
          'view:anotherViewField': true,
          trusts: [],
        },
      };

      const transformed = removeInvalidFields(formData.data);

      expect(transformed).to.deep.equal({
        mailingAddress: { street: '123 Main St' },
        trusts: [],
      });
    });
    it('should remove undefined, null, and view: prefixed fields from nested array objects', () => {
      const formData = {
        data: {
          trusts: [
            {
              recipientName: { first: 'Jane', last: 'Smith' },
              'view:viewField': 'someView',
              undefinedField: undefined,
              nullField: null,
              income: 25000,
              'view:anotherViewField': true,
              uploadedDocuments: [{ name: 'file.png' }],
            },
          ],
        },
      };

      const transformed = removeInvalidFields(formData.data);

      expect(transformed).to.deep.equal({
        trusts: [
          {
            recipientName: { first: 'Jane', last: 'Smith' },
            income: 25000,
            uploadedDocuments: [{ name: 'file.png' }],
          },
        ],
      });
    });
  });

  describe('removeDisallowedFields', () => {
    it('should remove disallowed fields from the form data', () => {
      const data = {
        isLoggedIn: true, // disallowed field
        mailingAddress: { street: '123 Main St' }, // allowed field
        vaFileNumberLastFour: 1234, // disallowed field
        veteranSsnLastFour: 5678, // disallowed field
        otherVeteranFullName: {
          first: 'John',
          last: 'Doe',
        }, // disallowed field
        otherVeteranSocialSecurityNumber: '123456789', // disallowed field
        otherVaFileNumber: 'VA1234', // disallowed field
      };

      const cleanedData = removeDisallowedFields(data, [
        'vaFileNumberLastFour',
        'veteranSsnLastFour',
        'otherVeteranFullName',
        'otherVeteranSocialSecurityNumber',
        'otherVaFileNumber',
        'isLoggedIn',
      ]);

      expect(cleanedData).to.eql({
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

  describe('pruning fields in arrays (remove inactive fields)', () => {
    describe('pruneFields', () => {
      it('removes fields when condition is false', () => {
        const obj = {
          addedFundsAfterEstablishment: false,
          addedFundsDate: '2021-01-01',
          addedFundsAmount: 500,
          otherField: 'keep',
        };

        const rules = [
          {
            field: 'addedFundsAfterEstablishment',
            when: value => value === false,
            remove: ['addedFundsDate', 'addedFundsAmount'],
          },
        ];

        const result = pruneFields(obj, rules);

        expect(result).to.deep.equal({
          addedFundsAfterEstablishment: false,
          otherField: 'keep',
        });
      });

      it('does not fail when remove fields are not found', () => {
        const obj = {
          addedFundsAfterEstablishment: false,
          otherField: 'keep',
        };

        const rules = [
          {
            field: 'addedFundsAfterEstablishment',
            when: value => value === false,
            remove: ['addedFundsDate', 'addedFundsAmount'],
          },
        ];

        const result = pruneFields(obj, rules);

        expect(result).to.deep.equal({
          addedFundsAfterEstablishment: false,
          otherField: 'keep',
        });
      });

      it('removes fields when `view:` prefix condition is false', () => {
        const obj = {
          'view:addedFundsAfterEstablishment': false,
          addedFundsDate: '2021-01-01',
          addedFundsAmount: 500,
          otherField: 'keep',
        };

        const rules = [
          {
            field: 'view:addedFundsAfterEstablishment',
            when: value => value === false,
            remove: ['addedFundsDate', 'addedFundsAmount'],
          },
        ];

        const result = pruneFields(obj, rules);

        expect(result).to.deep.equal({
          'view:addedFundsAfterEstablishment': false,
          otherField: 'keep',
        });
      });

      it('does not remove fields when condition is true', () => {
        const obj = {
          addedFundsAfterEstablishment: true,
          addedFundsDate: '2021-01-01',
          addedFundsAmount: 500,
          otherField: 'keep',
        };

        const rules = [
          {
            field: 'addedFundsAfterEstablishment',
            when: value => value === false,
            remove: ['addedFundsDate', 'addedFundsAmount'],
          },
        ];

        const result = pruneFields(obj, rules);

        expect(result).to.deep.equal(obj);
      });

      it('does not remove fields when `view:` prefix condition is true', () => {
        const obj = {
          'view:addedFundsAfterEstablishment': true,
          addedFundsDate: '2021-01-01',
          addedFundsAmount: 500,
          otherField: 'keep',
        };

        const rules = [
          {
            field: 'view:addedFundsAfterEstablishment',
            when: value => value === false,
            remove: ['addedFundsDate', 'addedFundsAmount'],
          },
        ];

        const result = pruneFields(obj, rules);

        expect(result).to.deep.equal(obj);
      });

      it('does not mutate the original object', () => {
        const obj = {
          flag: true,
          removeMe: 'x',
        };

        const rules = [
          { field: 'flag', when: v => v === true, remove: ['removeMe'] },
        ];

        const originalClone = { ...obj };
        pruneFields(obj, rules);

        expect(obj).to.deep.equal(originalClone);
      });
    });

    describe('pruneFieldsInArray', () => {
      it('applies pruneFields to each item in an array', () => {
        const arr = [
          {
            addedFundsAfterEstablishment: false,
            addedFundsDate: '2021-01-01',
            addedFundsAmount: 500,
          },
          {
            addedFundsAfterEstablishment: true,
            addedFundsDate: '2020-01-01',
            addedFundsAmount: 200,
          },
        ];

        const rules = [
          {
            field: 'addedFundsAfterEstablishment',
            when: val => val === false,
            remove: ['addedFundsDate', 'addedFundsAmount'],
          },
        ];

        const result = pruneFieldsInArray(arr, rules);

        expect(result).to.deep.equal([
          {
            addedFundsAfterEstablishment: false,
          },
          {
            addedFundsAfterEstablishment: true,
            addedFundsDate: '2020-01-01',
            addedFundsAmount: 200,
          },
        ]);
      });

      it('returns array unchanged when not an array', () => {
        const result = pruneFieldsInArray(null, []);
        expect(result).to.equal(null);
      });
    });

    describe('pruneConfiguredArrays', () => {
      it('prunes only the arrays listed in config', () => {
        const formData = {
          trusts: [
            {
              addedFundsAfterEstablishment: true,
              addedFundsDate: '2021-01-01',
              addedFundsAmount: 500,
            },
          ],
          annuities: [
            {
              hasIncome: true,
              incomeAmount: 1200,
              disability: 500,
            },
          ],
          untouchedArray: [{ a: 1 }],
        };

        const config = {
          trusts: [
            {
              field: 'addedFundsAfterEstablishment',
              when: v => v === false,
              remove: ['addedFundsDate', 'addedFundsAmount'],
            },
          ],
          annuities: [
            {
              field: 'hasIncome',
              when: v => v === true,
              remove: ['disability'],
            },
          ],
        };

        const result = pruneConfiguredArrays(formData, config);

        expect(result).to.deep.equal({
          trusts: [
            {
              addedFundsAfterEstablishment: true,
              addedFundsDate: '2021-01-01',
              addedFundsAmount: 500,
            },
          ],
          annuities: [
            {
              hasIncome: true,
              incomeAmount: 1200,
            },
          ],
          untouchedArray: [{ a: 1 }],
        });
      });

      it('ignores config keys that do not exist in formData', () => {
        const formData = {
          trusts: [],
        };

        const config = {
          nonExistingField: [
            {
              field: 'flag',
              when: () => true,
              remove: ['something'],
            },
          ],
        };

        const result = pruneConfiguredArrays(formData, config);

        expect(result).to.deep.equal({
          trusts: [],
        });
      });

      it('does not mutate original formData', () => {
        const formData = {
          trusts: [{ a: 1, removeMe: true }],
        };

        const config = {
          trusts: [
            {
              field: 'removeMe',
              when: v => v === true,
              remove: ['a'],
            },
          ],
        };

        const clone = JSON.parse(JSON.stringify(formData));
        pruneConfiguredArrays(formData, config);

        expect(formData).to.deep.equal(clone);
      });
    });
  });
});
