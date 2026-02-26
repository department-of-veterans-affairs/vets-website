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
} = formConfig.chapters.sectionTwoP1Chapter.pages.doctorInformationPage;
const pageTitle = 'doctor information';

const expectedNumberOfFields = 1;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 1;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);

const expectedNumberOfWebComponentFields = 7;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
);

const expectedNumberOfWebComponentErrors = 5;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);

describe('doctorInformationPage updateSchema', () => {
  const { updateSchema } = uiSchema.doctors['ui:options'];

  it('returns empty object when connected schema is missing', () => {
    const result = updateSchema({}, { items: [{}] }, {}, 0, '', {});
    expect(result).to.deep.equal({});
  });

  it('removes connectedDisabilities from required when there are no options', () => {
    const baseSchema = {
      items: [
        {
          properties: {
            connectedDisabilities: {
              items: { enum: ['PTSD'] },
              additionalItems: { type: 'string' },
            },
          },
          required: ['connectedDisabilities'],
        },
      ],
    };

    const result = updateSchema({}, baseSchema, {}, 0, '', {});
    const updated = result.items[0].properties.connectedDisabilities;

    expect(updated.minItems).to.equal(0);
    expect(updated.items.type).to.equal('string');
    expect(result.items[0].required).to.be.undefined;
  });

  it('adds connectedDisabilities to required when options exist', () => {
    const baseSchema = {
      items: [
        {
          properties: {
            connectedDisabilities: {
              enum: ['Legacy'],
              items: { enum: [] },
            },
          },
          required: ['doctorName'],
        },
      ],
      additionalItems: {
        properties: {
          connectedDisabilities: {
            items: {},
          },
        },
        required: ['connectedDisabilities'],
      },
    };

    const fullData = {
      disabilityDescription: [{ disability: 'Back pain' }],
    };

    const result = updateSchema({}, baseSchema, {}, 0, '', fullData);
    const updated = result.items[0].properties.connectedDisabilities;

    expect(updated.minItems).to.equal(1);
    expect(updated.items.enum).to.deep.equal(['Back pain']);
    expect(result.items[0].required).to.include('connectedDisabilities');
    expect(result.additionalItems.required).to.include('connectedDisabilities');
  });
});
