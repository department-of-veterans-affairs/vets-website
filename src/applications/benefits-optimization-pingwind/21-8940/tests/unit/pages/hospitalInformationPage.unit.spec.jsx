import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { expect } from 'chai';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.sectionTwoP1Chapter.pages.hospitalInformationPage;
const pageTitle = 'hospital information';

const expectedNumberOfFields = 0;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 0;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);

const expectedNumberOfWebComponentFields = 8;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
);

const expectedNumberOfWebComponentErrors = 6;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);

describe('hospitalInformationPage updateSchema', () => {
  const { updateSchema } = uiSchema.hospitals['ui:options'];

  it('returns empty object when connected schema is missing', () => {
    const result = updateSchema({}, { items: [{}] }, {}, 0, '', {});
    expect(result).to.deep.equal({});
  });

  it('keeps required list when options exist', () => {
    const baseSchema = {
      items: {
        properties: {
          connectedDisabilities: {
            enum: ['Legacy'],
            items: {},
            additionalItems: { type: 'string' },
          },
        },
        required: ['connectedDisabilities'],
      },
    };

    const fullData = {
      disabilityDescription: [{ disability: 'Tinnitus' }],
    };

    const result = updateSchema({}, baseSchema, {}, 0, '', fullData);

    expect(result.items.properties.connectedDisabilities.minItems).to.equal(1);
    expect(
      result.items.properties.connectedDisabilities.items.enum,
    ).to.deep.equal(['Tinnitus']);
    expect(result.items.required).to.include('connectedDisabilities');
  });

  it('removes connectedDisabilities from required when no options exist', () => {
    const baseSchema = {
      items: [
        {
          properties: {
            connectedDisabilities: {
              items: { enum: ['Legacy'] },
            },
          },
          required: ['connectedDisabilities'],
        },
      ],
      additionalItems: {
        properties: {
          connectedDisabilities: {
            items: { type: 'string' },
          },
        },
        required: ['connectedDisabilities'],
      },
    };

    const result = updateSchema({}, baseSchema, {}, 0, '', {});

    expect(result.items[0].required).to.be.undefined;
    expect(result.additionalItems.required).to.be.undefined;
  });
});
