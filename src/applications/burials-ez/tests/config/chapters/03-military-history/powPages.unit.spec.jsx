import { expect } from 'chai';
import sinon from 'sinon';
import formConfig from '../../../../config/form';
import {
  powPages,
  options,
} from '../../../../config/chapters/03-military-history/powPages';
import * as helpers from '../../../../utils/helpers';

import { testOptionsIsItemIncomplete } from '../multiPageTests.spec';
import {
  testNumberOfFieldsByType,
  testComponentFieldsMarkedAsRequired,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('prisoner of war confinement period list and loop pages', () => {
  let showPdfFormAlignmentStub;

  beforeEach(() => {
    showPdfFormAlignmentStub = sinon.stub(helpers, 'showPdfFormAlignment');
  });

  afterEach(() => {
    if (showPdfFormAlignmentStub && showPdfFormAlignmentStub.restore) {
      showPdfFormAlignmentStub.restore();
    }
  });

  const testData = {
    'view:isAddingPeriods': true,
    powPeriods: [
      {
        powDateRange: {
          from: '1971-02-26',
          to: '1973-03-02',
        },
      },
    ],
  };
  const { powSummary, powDateRangePage } = powPages;

  describe('isItemIncomplete function', () => {
    const baseItem = testData.powPeriods[0];
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('text getItemName function', () => {
    it('returns undefined when dates are missing', () => {
      expect(options.text.getItemName({ powDateRange: {} })).to.be.undefined;
      expect(options.text.getItemName({ powDateRange: { from: '1971-02-26' } }))
        .to.be.undefined;
      expect(options.text.getItemName({ powDateRange: { to: '1973-03-02' } }))
        .to.be.undefined;
    });

    it('returns formatted range when dates are present', () => {
      expect(options.text.getItemName(testData.powPeriods[0])).to.equal(
        'February 26, 1971 - March 2, 1973',
      );
    });
  });

  describe('summaryTitle function', () => {
    it('should show content', () => {
      expect(options.text.summaryTitle).to.eql(
        'Review your prisoner of war confinement periods',
      );
    });
  });

  describe('summary page', () => {
    const pageTitle = 'summary page';
    beforeEach(() => {
      showPdfFormAlignmentStub.returns(true);
    });

    const { schema, uiSchema } = powSummary;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      pageTitle,
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[label="Was the Veteran ever a prisoner of war?"]'],
      pageTitle,
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      pageTitle,
      testData,
      { loggedIn: true },
    );
  });

  describe('POW date range page', () => {
    const pageTitle = 'date range page';
    const schema = powDateRangePage.schema.properties.powPeriods.items;
    const uiSchema = powDateRangePage.uiSchema.powPeriods.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-memorable-date': 2 },
      pageTitle,
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-memorable-date[label="Start of confinement"]',
        'va-memorable-date[label="End of confinement"]',
      ],
      'date range page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      pageTitle,
      testData.powPeriods[0],
      { loggedIn: true },
    );
  });
});
