import { expect } from 'chai';
import sinon from 'sinon';
import formConfig from '../../../../config/form';
import {
  royaltiesAndOtherPropertyPages,
  options,
} from '../../../../config/chapters/05-royalties-and-other-properties/royaltiesAndOtherPropertyPages';
import { formatFullNameNoSuffix } from '../../../../helpers';
import {
  generatedIncomeTypeLabels,
  relationshipLabels,
} from '../../../../labels';
import * as helpers from '../../../../helpers';
import testData from '../../../e2e/fixtures/data/test-data.json';
import testDataZeroes from '../../../e2e/fixtures/data/test-data-all-zeroes.json';

import {
  testOptionsIsItemIncomplete,
  testOptionsIsItemIncompleteWithZeroes,
  testOptionsTextCardDescription,
} from '../multiPageTests.spec';
import {
  testNumberOfFieldsByType,
  testComponentFieldsMarkedAsRequired,
  testSelectAndValidateField,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('royalties list and loop pages', () => {
  let showUpdatedContentStub;

  beforeEach(() => {
    showUpdatedContentStub = sinon.stub(helpers, 'showUpdatedContent');
  });

  afterEach(() => {
    if (showUpdatedContentStub && showUpdatedContentStub.restore) {
      showUpdatedContentStub.restore();
    }
  });

  const {
    royaltyPagesSummary,
    royaltyNonVeteranRecipientPage,
    royaltyVeteranRecipientPage,
    royaltySpouseRecipientPage,
    royaltyCustodianRecipientPage,
    royaltyParentRecipientPage,
    royaltyChildRecipientNamePage,
    royaltyRecipientNamePage,
  } = royaltiesAndOtherPropertyPages;

  describe('isItemIncomplete function', () => {
    const baseItem = testData.data.royaltiesAndOtherProperties[0];
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    const baseItem = testDataZeroes.data.royaltiesAndOtherProperties[0];
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    const mockFormData = {
      isLoggedIn: true,
      veteranFullName: { first: 'John', last: 'Doe' },
      otherVeteranFullName: { first: 'Alex', last: 'Smith' },
    };
    it('should return "John Doe’s income" if recipient is Veteran', () => {
      const item = {
        recipientRelationship: 'VETERAN',
        incomeGenerationMethod: 'INTELLECTUAL_PROPERTY',
      };
      expect(options.text.getItemName(item, 0, mockFormData)).to.equal(
        'John Doe’s income from intellectual property rights',
      );
    });
    it('should return "Alex Smith’s income" if recipient is Veteran and not logged in', () => {
      const item = {
        recipientRelationship: 'VETERAN',
        incomeGenerationMethod: 'USE_OF_LAND',
      };
      expect(
        options.text.getItemName(item, 0, {
          ...mockFormData,
          isLoggedIn: false,
        }),
      ).to.equal('Alex Smith’s income from land usage fees');
    });
    it('should return "Jane Doe’s income', () => {
      const recipientName = { first: 'Jane', middle: 'A', last: 'Doe' };
      const formattedName = formatFullNameNoSuffix(recipientName);

      Object.keys(relationshipLabels).forEach(relationshipKey => {
        if (relationshipKey !== 'VETERAN') {
          it(`should return "${formattedName}'s income" for relationship "${relationshipKey}"`, () => {
            const item = {
              recipientRelationship: relationshipKey,
              recipientName,
            };
            expect(options.text.getItemName(item)).to.equal(
              `${formattedName}’s income`,
            );
          });
        }
      });
    });
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      recipientRelationship,
      recipientName,
      incomeGenerationMethod,
      canBeSold,
      ...baseItem
    } = testData.data.royaltiesAndOtherProperties[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(
      options,
      baseItem,
      generatedIncomeTypeLabels,
    );
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      recipientRelationship,
      recipientName,
      incomeGenerationMethod,
      canBeSold,
      ...baseItem
    } = testDataZeroes.data.royaltiesAndOtherProperties[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(
      options,
      baseItem,
      generatedIncomeTypeLabels,
    );
  });

  describe('MVP summary page', () => {
    const { schema, uiSchema } = royaltyPagesSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'summary page',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="Are you or your dependents receiving or expecting to receive any income and intellectual property royalties, mineral royalties, land use, or other royalties/properties?"]',
      ],
      'summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'summary page',
      testData.data,
      { loggedIn: true },
    );
  });

  describe('MVP income recipient page', () => {
    const schema =
      royaltiesAndOtherPropertyPages.royaltyNonVeteranRecipientPage.schema
        .properties.royaltiesAndOtherProperties.items;
    const uiSchema =
      royaltiesAndOtherPropertyPages.royaltyNonVeteranRecipientPage.uiSchema
        .royaltiesAndOtherProperties.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'recipient',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[label="Who receives the income?"]'],
      'recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'recipient',
      testData.data.royaltiesAndOtherProperties[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'recipient',
      'root_otherRecipientRelationshipType',
    );
  });

  describe('Updated recipient pages', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(true);
    });

    describe('Veteran recipient page', () => {
      const formData = { ...testData.data, claimantType: 'VETERAN' };

      it('should display when showUpdatedContent is true and claimantType is VETERAN', () => {
        const { depends } = royaltyVeteranRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Spouse recipient page', () => {
      const formData = { ...testData.data, claimantType: 'SPOUSE' };

      it('should display when showUpdatedContent is true and claimantType is SPOUSE', () => {
        const { depends } = royaltySpouseRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Custodian recipient page', () => {
      const formData = { ...testData.data, claimantType: 'CUSTODIAN' };

      it('should display when showUpdatedContent is true and claimantType is CUSTODIAN', () => {
        const { depends } = royaltyCustodianRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Parent recipient page', () => {
      const formData = { ...testData.data, claimantType: 'PARENT' };

      it('should display when showUpdatedContent is true and claimantType is PARENT', () => {
        const { depends } = royaltyParentRecipientPage;
        expect(depends(formData)).to.be.true;
      });
    });

    describe('Income recipient pages', () => {
      const formData = { ...testData.data, claimantType: 'CHILD' };

      it('should NOT display any recipient pages when claimantType is CHILD', () => {
        expect(royaltyNonVeteranRecipientPage.depends(formData)).to.be.false;
        expect(royaltyVeteranRecipientPage.depends(formData)).to.be.false;
        expect(royaltySpouseRecipientPage.depends(formData)).to.be.false;
        expect(royaltyCustodianRecipientPage.depends(formData)).to.be.false;
        expect(royaltyParentRecipientPage.depends(formData)).to.be.false;
      });
    });
  });

  describe('recipient name page', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(false);
    });
    const schema =
      royaltiesAndOtherPropertyPages.royaltyRecipientNamePage.schema.properties
        .royaltiesAndOtherProperties.items;
    const uiSchema =
      royaltiesAndOtherPropertyPages.royaltyRecipientNamePage.uiSchema
        .royaltiesAndOtherProperties.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 3 },
      'recipient',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-text-input[label="Income recipient’s first or given name"]',
        'va-text-input[label="Income recipient’s last or family name"]',
      ],
      'recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'recipient',
      testData.data.royaltiesAndOtherProperties[0],
      { loggedIn: true },
    );

    it('should show recipient name page when claimantType is not CHILD', () => {
      const formData = { ...testData.data, claimantType: 'SPOUSE' };
      expect(royaltyRecipientNamePage.depends(formData)).to.be.true;
    });

    it('should not show recipient name page when claimantType is CHILD', () => {
      showUpdatedContentStub.returns(true);
      const formData = { ...testData.data, claimantType: 'CHILD' };
      expect(royaltyRecipientNamePage.depends(formData)).to.be.false;
    });
  });

  describe('child recipient name page', () => {
    beforeEach(() => {
      showUpdatedContentStub.returns(true);
    });

    const schema =
      royaltyChildRecipientNamePage.schema.properties
        .royaltiesAndOtherProperties.items;
    const uiSchema =
      royaltyChildRecipientNamePage.uiSchema.royaltiesAndOtherProperties.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 3 },
      'child recipient',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-text-input[label="Income recipient’s first or given name"]',
        'va-text-input[label="Income recipient’s last or family name"]',
      ],
      'child recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'child recipient',
      testData.data.royaltiesAndOtherProperties[0],
      { loggedIn: true },
    );

    it('should show child recipient name page when claimantType is CHILD', () => {
      const formData = { ...testData.data, claimantType: 'CHILD' };
      expect(royaltyChildRecipientNamePage.depends(formData)).to.be.true;
    });

    it('should not show child recipient name page when claimantType is not CHILD', () => {
      const formData = { ...testData.data, claimantType: 'SPOUSE' };
      expect(royaltyChildRecipientNamePage.depends(formData)).to.be.false;
    });
  });

  describe('income type page', () => {
    const schema =
      royaltiesAndOtherPropertyPages.generatedIncomeTypePage.schema.properties
        .royaltiesAndOtherProperties.items;
    const uiSchema =
      royaltiesAndOtherPropertyPages.generatedIncomeTypePage.uiSchema
        .royaltiesAndOtherProperties.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 2, 'va-text-input': 2 },
      'income type',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="How is income generated from this asset?"]',
        'va-text-input[label="What’s the gross monthly income from this asset?"]',
        'va-text-input[label="What’s the fair market value of this asset?"]',
        'va-radio[label="Can the asset be sold?"]',
      ],
      'income type',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'income type',
      testData.data.royaltiesAndOtherProperties[0],
      { loggedIn: true },
    );
  });
});
