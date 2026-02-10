import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

import { expect } from 'chai';
import {
  collectAttachmentFiles,
  pruneFields,
  pruneFieldsInArray,
  pruneConfiguredArrays,
  remapIncomeTypeFields,
  remapOtherVeteranFields,
  removeDisallowedFields,
  removeInvalidFields,
  remapRecipientRelationshipFields,
  remapRecipientRelationshipsInArrays,
  replacer,
} from '../../../config/submit-helpers';

describe('submit-helpers.js', () => {
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

  describe('collectAttachmentFiles', () => {
    it('should flatten the array of attachment files from trusts', () => {
      const formData = {
        trusts: [
          {
            uploadedDocuments: [{ name: 'file1.pdf' }, { name: 'file2.pdf' }],
          },
          {
            uploadedDocuments: [{ name: 'file3.pdf' }],
          },
        ],
      };

      const attachments = collectAttachmentFiles(formData);

      expect(attachments).to.deep.equal([
        { name: 'file1.pdf' },
        { name: 'file2.pdf' },
        { name: 'file3.pdf' },
      ]);
    });

    it('should collect individual attachment files from ownedAssets', () => {
      const formData = {
        ownedAssets: [
          {
            uploadedDocuments: { name: 'assetFile1.pdf' },
          },
          {
            uploadedDocuments: { name: 'assetFile2.pdf' },
          },
        ],
      };

      const attachments = collectAttachmentFiles(formData);
      expect(attachments).to.deep.equal([
        { name: 'assetFile1.pdf' },
        { name: 'assetFile2.pdf' },
      ]);
    });

    context('when there are no uploadedDocuments (not required)', () => {
      it('should handle ownedAssets with no uploadedDocuments gracefully', () => {
        const formData = {
          ownedAssets: [
            {
              uploadedDocuments: { name: 'onlyFile.pdf' },
            },
            {
              someOtherField: 'no files here', // no uploadedDocuments field
            },
            {
              uploadedDocuments: [], // This is the behavior we see with the forms system
            },
          ],
        };

        const attachments = collectAttachmentFiles(formData);

        expect(attachments).to.deep.equal([{ name: 'onlyFile.pdf' }]);
      });

      it('should handle trusts with no uploadedDocuments gracefully', () => {
        const formData = {
          trusts: [
            {
              uploadedDocuments: [{ name: 'trustFile.pdf' }],
            },
            {
              someOtherField: 'no files here',
            },
            {
              uploadedDocuments: [], // This is the behavior we see with the forms system
            },
          ],
        };

        const attachments = collectAttachmentFiles(formData);

        expect(attachments).to.deep.equal([{ name: 'trustFile.pdf' }]);
      });
    });

    it('should return an empty array when no attachments are present', () => {
      const formData = {
        trusts: [
          {
            uploadedDocuments: [],
          },
        ],
        ownedAssets: [],
      };

      const attachments = collectAttachmentFiles(formData);

      expect(attachments).to.deep.equal([]);
    });

    it('should return an array of all attachments from both trusts and ownedAssets', () => {
      const formData = {
        trusts: [
          {
            uploadedDocuments: [{ name: 'trustFile1.pdf' }],
          },
        ],
        ownedAssets: [
          {
            uploadedDocuments: { name: 'assetFile1.pdf' },
          },
        ],
      };

      const attachments = collectAttachmentFiles(formData);

      expect(attachments).to.deep.equal([
        { name: 'trustFile1.pdf' },
        { name: 'assetFile1.pdf' },
      ]);
    });
  });

  describe('oveInvalidFields', () => {
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

  describe('remapOtherVeteranFields', () => {
    it('should map all available otherVeteran fields to veteran fields', () => {
      const input = {
        otherVeteranFullName: { first: 'Jane', last: 'Doe' },
        otherVeteranSocialSecurityNumber: '123456789',
        otherVaFileNumber: 'VA123456',
      };

      const output = remapOtherVeteranFields(input);

      expect(output.veteranFullName).to.deep.equal(input.otherVeteranFullName);
      expect(output.veteranSocialSecurityNumber).to.equal(
        input.otherVeteranSocialSecurityNumber,
      );
      expect(output.vaFileNumber).to.equal(input.otherVaFileNumber);
    });

    it('should preserve unrelated fields in the original data', () => {
      const input = {
        unrelatedField: 'keep me',
        otherVeteranFullName: { first: 'John', last: 'Smith' },
      };

      const output = remapOtherVeteranFields(input);

      expect(output.unrelatedField).to.equal('keep me');
      expect(output.veteranFullName).to.deep.equal(input.otherVeteranFullName);
    });

    it('should not add veteran fields if otherVeteran fields are missing', () => {
      const input = {
        unrelatedField: true,
      };

      const output = remapOtherVeteranFields(input);

      expect(output).to.deep.equal({ unrelatedField: true });
    });

    it('should not mutate the original object', () => {
      const input = {
        otherVeteranFullName: { first: 'Alex', last: 'Doe' },
      };

      const original = { ...input };
      remapOtherVeteranFields(input);

      expect(input).to.deep.equal(original);
    });
  });

  describe('remapIncomeTypeFields', () => {
    it('should remap "WAGES" `incomeType` field to human-readable', () => {
      const input = {
        unrelatedField: 'keep me',
        incomeType: 'WAGES',
        anotherUnrelatedField: 'RECURRING',
      };

      const output = remapIncomeTypeFields(input);

      expect(output).to.deep.equal({
        unrelatedField: 'keep me',
        incomeType: 'Wages',
        anotherUnrelatedField: 'RECURRING',
      });
    });

    it('should remap "INTEREST" `incomeType` field to human-readable', () => {
      const input = {
        unrelatedField: 'keep me',
        incomeType: 'INTEREST',
        anotherUnrelatedField: 'RECURRING',
      };

      const output = remapIncomeTypeFields(input);

      expect(output).to.deep.equal({
        unrelatedField: 'keep me',
        incomeType: 'Interest',
        anotherUnrelatedField: 'RECURRING',
      });
    });

    it('should remap "UNEMPLOYMENT_BENEFITS" `incomeType` field to human-readable', () => {
      const input = {
        unrelatedField: 'keep me',
        incomeType: 'UNEMPLOYMENT_BENEFITS',
        anotherUnrelatedField: 'RECURRING',
      };

      const output = remapIncomeTypeFields(input);

      expect(output).to.deep.equal({
        unrelatedField: 'keep me',
        incomeType: 'Unemployment benefits',
        anotherUnrelatedField: 'RECURRING',
      });
    });

    it('should remap "LOTTERY_WINNINGS" `incomeType` field to human-readable', () => {
      const input = {
        unrelatedField: 'keep me',
        incomeType: 'LOTTERY_WINNINGS',
        anotherUnrelatedField: 'RECURRING',
      };

      const output = remapIncomeTypeFields(input);

      expect(output).to.deep.equal({
        unrelatedField: 'keep me',
        incomeType: 'Lottery winnings',
        anotherUnrelatedField: 'RECURRING',
      });
    });

    it('should remap "OTHER" `incomeType` field to human-readable', () => {
      const input = {
        unrelatedField: 'keep me',
        incomeType: 'OTHER',
        anotherUnrelatedField: 'RECURRING',
      };

      const output = remapIncomeTypeFields(input);

      expect(output).to.deep.equal({
        unrelatedField: 'keep me',
        incomeType: 'Another type of income',
        anotherUnrelatedField: 'RECURRING',
      });
    });

    it('should remap "OTHER" `incomeType` field to `view:otherIncomeType`', () => {
      const input = {
        unrelatedField: 'keep me',
        incomeType: 'OTHER',
        anotherUnrelatedField: 'RECURRING',
        'view:otherIncomeType': 'other income type description',
      };

      const output = remapIncomeTypeFields(input);

      expect(output).to.deep.equal({
        unrelatedField: 'keep me',
        incomeType: 'other income type description',
        anotherUnrelatedField: 'RECURRING',
        'view:otherIncomeType': 'other income type description',
      });
    });

    it('should NOT remap `incomeType` field to human-readable', () => {
      const input = {
        unrelatedField: 'keep me',
        incomeType: 'Does not match any key',
        anotherUnrelatedField: 'RECURRING',
      };

      const output = remapIncomeTypeFields(input);

      expect(output).to.deep.equal({
        unrelatedField: 'keep me',
        incomeType: 'Does not match any key',
        anotherUnrelatedField: 'RECURRING',
      });
    });
  });

  describe('remapRecipientRelationshipFields', () => {
    it('should NOT remap SPOUSE fields for `claimantType` VETERAN', () => {
      const input = {
        unrelatedField: 'keep me',
        recipientRelationship: 'SPOUSE',
        anotherUnrelatedField: 'RECURRING',
      };

      const output = remapRecipientRelationshipFields('VETERAN', input);

      expect(output).to.deep.equal({
        unrelatedField: 'keep me',
        recipientRelationship: 'SPOUSE',
        anotherUnrelatedField: 'RECURRING',
      });
    });

    it('should NOT remap SPOUSE fields for `claimantType` SPOUSE', () => {
      const input = {
        unrelatedField: 'keep me',
        recipientRelationship: 'SPOUSE',
        anotherUnrelatedField: 'RECURRING',
      };

      const output = remapRecipientRelationshipFields('SPOUSE', input);

      expect(output).to.deep.equal({
        unrelatedField: 'keep me',
        recipientRelationship: 'SPOUSE',
        anotherUnrelatedField: 'RECURRING',
      });
    });

    it('should NOT remap SPOUSE fields for `claimantType` CHILD', () => {
      const input = {
        unrelatedField: 'keep me',
        recipientRelationship: 'SPOUSE',
        anotherUnrelatedField: 'RECURRING',
      };

      const output = remapRecipientRelationshipFields('CHILD', input);

      expect(output).to.deep.equal({
        unrelatedField: 'keep me',
        recipientRelationship: 'SPOUSE',
        anotherUnrelatedField: 'RECURRING',
      });
    });

    it('should remap SPOUSE fields for `claimantType` CUSTODIAN', () => {
      const input = {
        unrelatedField: 'keep me',
        recipientRelationship: 'SPOUSE',
        anotherUnrelatedField: 'RECURRING',
      };

      const output = remapRecipientRelationshipFields('CUSTODIAN', input);

      expect(output).to.deep.equal({
        unrelatedField: 'keep me',
        otherRecipientRelationshipType: "Custodian's spouse",
        recipientRelationship: 'OTHER',
        anotherUnrelatedField: 'RECURRING',
      });
    });

    it('should NOT remap OTHER fields for `claimantType` CUSTODIAN', () => {
      const input = {
        unrelatedField: 'keep me',
        recipientRelationship: 'OTHER',
        otherRecipientRelationshipType: 'Other relationship description',
        anotherUnrelatedField: 'RECURRING',
      };

      const output = remapRecipientRelationshipFields('CUSTODIAN', input);

      expect(output).to.deep.equal({
        unrelatedField: 'keep me',
        otherRecipientRelationshipType: 'Other relationship description',
        recipientRelationship: 'OTHER',
        anotherUnrelatedField: 'RECURRING',
      });
    });

    it('should remap SPOUSE fields for `claimantType` PARENT', () => {
      const input = {
        unrelatedField: 'keep me',
        recipientRelationship: 'SPOUSE',
        anotherUnrelatedField: 'RECURRING',
      };

      const output = remapRecipientRelationshipFields('PARENT', input);

      expect(output).to.deep.equal({
        unrelatedField: 'keep me',
        otherRecipientRelationshipType: "Parent's spouse",
        recipientRelationship: 'OTHER',
        anotherUnrelatedField: 'RECURRING',
      });
    });

    it('should NOT remap OTHER fields for `claimantType` PARENT', () => {
      const input = {
        unrelatedField: 'keep me',
        recipientRelationship: 'OTHER',
        otherRecipientRelationshipType: 'Other relationship description',
        anotherUnrelatedField: 'RECURRING',
      };

      const output = remapRecipientRelationshipFields('PARENT', input);

      expect(output).to.deep.equal({
        unrelatedField: 'keep me',
        otherRecipientRelationshipType: 'Other relationship description',
        recipientRelationship: 'OTHER',
        anotherUnrelatedField: 'RECURRING',
      });
    });
  });

  describe('remapRecipientRelationshipsInArrays', () => {
    it('remaps SPOUSE to OTHER with correct label for CUSTODIAN', () => {
      const formData = {
        claimantType: 'CUSTODIAN',
        incomes: [{ recipientRelationship: 'SPOUSE', amount: 100 }],
      };
      const result = remapRecipientRelationshipsInArrays(formData);
      expect(result.incomes[0]).to.deep.equal({
        recipientRelationship: 'OTHER',
        otherRecipientRelationshipType: "Custodian's spouse",
        amount: 100,
      });
    });

    it('remaps SPOUSE to OTHER with correct label for PARENT', () => {
      const formData = {
        claimantType: 'PARENT',
        incomes: [{ recipientRelationship: 'SPOUSE', amount: 200 }],
      };
      const result = remapRecipientRelationshipsInArrays(formData);
      expect(result.incomes[0]).to.deep.equal({
        recipientRelationship: 'OTHER',
        otherRecipientRelationshipType: "Parent's spouse",
        amount: 200,
      });
    });

    it('does not modify items without recipientRelationship', () => {
      const formData = {
        claimantType: 'CUSTODIAN',
        incomes: [{ amount: 100 }],
      };
      const result = remapRecipientRelationshipsInArrays(formData);
      expect(result.incomes[0]).to.deep.equal({ amount: 100 });
    });

    it('does not modify files array', () => {
      const fileObj = { name: 'doc.pdf' };
      const formData = {
        claimantType: 'CUSTODIAN',
        files: [fileObj],
      };
      const result = remapRecipientRelationshipsInArrays(formData);
      expect(result.files).to.deep.equal([fileObj]);
    });

    it('leaves empty arrays untouched', () => {
      const formData = {
        claimantType: 'CUSTODIAN',
        incomes: [],
      };
      const result = remapRecipientRelationshipsInArrays(formData);
      expect(result.incomes).to.deep.equal([]);
    });

    it('handles multiple array fields correctly', () => {
      const formData = {
        claimantType: 'PARENT',
        incomes: [{ recipientRelationship: 'SPOUSE', amount: 50 }],
        benefits: [{ recipientRelationship: 'CHILD', amount: 75 }],
      };
      const result = remapRecipientRelationshipsInArrays(formData);
      expect(result.incomes[0]).to.deep.equal({
        recipientRelationship: 'OTHER',
        otherRecipientRelationshipType: "Parent's spouse",
        amount: 50,
      });
      // Non-SPOUSE item stays unchanged
      expect(result.benefits[0]).to.deep.equal({
        recipientRelationship: 'CHILD',
        amount: 75,
      });
    });

    it('does not mutate the original formData', () => {
      const formData = {
        claimantType: 'CUSTODIAN',
        incomes: [{ recipientRelationship: 'SPOUSE', amount: 100 }],
      };
      const clone = { ...formData, incomes: [...formData.incomes] };
      remapRecipientRelationshipsInArrays(formData);
      expect(formData).to.deep.equal(clone);
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

    it('should normalize claimant phone number', () => {
      const formConfig = {
        chapters: {},
      };
      const formData = {
        data: { mailingAddress: {}, claimantPhone: '555-867-5309' },
      };
      const transformed = transformForSubmit(formConfig, formData, replacer);

      expect(transformed).to.equal(
        JSON.stringify({ claimantPhone: '5558675309' }),
      );
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
