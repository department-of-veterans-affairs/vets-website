import fullSchema1010ez from 'applications/hca/config/form';
import fullSchema0993 from 'applications/edu-benefits/0993/config/form';
import fullSchema0994 from 'applications/edu-benefits/0994/config/form';
import fullSchema0996 from 'applications/disability-benefits/996/config/form';
import fullSchema1990 from 'applications/edu-benefits/1990/config/form';
import fullSchema1990e from 'applications/edu-benefits/1990e/config/form';
import fullSchema1990n from 'applications/edu-benefits/1990n/config/form';
import fullSchema1995 from 'applications/edu-benefits/1995/config/form';
import fullSchema5490 from 'applications/edu-benefits/5490/config/form';
import fullSchema5495 from 'applications/edu-benefits/5495/config/form';
import fullSchemaVIC from 'applications/vic-v2/config/form';
import fullSchema527EZ from 'applications/pensions/config/form';
import fullSchema526AllClaims from 'applications/disability-benefits/all-claims/config/form';
import fullSchema530 from 'applications/burials/config/form';
import fullSchema10007 from 'applications/pre-need/config/form';
import fullSchema686 from 'applications/disability-benefits/686/config/form';
import fullSchemaFeedbackTool from 'applications/edu-benefits/feedback-tool/config/form';
import fullSchema1010CG from 'applications/caregivers/config/form';
import fullSchemaMDOT from 'applications/disability-benefits/2346/config/form';

import { VA_FORM_IDS } from 'platform/forms/constants';

import schemas from 'vets-json-schema/dist/schemas';

// Maps schema id to config id
const mappedIds = [
  '10-10EZ',
  '21-526EZ-ALLCLAIMS',
  VA_FORM_IDS.FORM_21_686C,
  VA_FORM_IDS.FORM_21P_527EZ,
  VA_FORM_IDS.FORM_21P_530,
  VA_FORM_IDS.FORM_22_0993,
  VA_FORM_IDS.FORM_22_0994,
  VA_FORM_IDS.FORM_20_0996,
  VA_FORM_IDS.FORM_22_1990,
  VA_FORM_IDS.FORM_22_1990E,
  VA_FORM_IDS.FORM_22_1990N,
  VA_FORM_IDS.FORM_22_1995,
  VA_FORM_IDS.FORM_22_5490,
  VA_FORM_IDS.FORM_22_5495,
  VA_FORM_IDS.FORM_40_10007,
  VA_FORM_IDS.FEEDBACK_TOOL,
  VA_FORM_IDS.VIC,
  fullSchema1010CG,
  VA_FORM_IDS.FORM_VA_2346A,
];

const configs = [
  // Remap the formId to match the name in vets-json-schema
  // This should only affect the mapping in the "check all forms" test
  { ...fullSchema1010ez, formId: '10-10EZ' },
  fullSchema0996,
  { ...fullSchema526AllClaims, formId: '21-526EZ-ALLCLAIMS' },
  fullSchema686,
  fullSchema527EZ,
  fullSchema530,
  fullSchema0993,
  fullSchema0994,
  fullSchema1990,
  fullSchema1990e,
  fullSchema1990n,
  fullSchema1995,
  fullSchema5490,
  fullSchema5495,
  fullSchema10007,
  fullSchemaFeedbackTool,
  fullSchemaVIC,
  fullSchema1010CG,
  fullSchemaMDOT,
];

// These forms do not have formConfig but are found in vets-json-schema/dist/schemas
const excludedForms = new Set([
  '28-1900',
  '28-8832',
  '24-0296',
  '10-10CG-example',
  VA_FORM_IDS.FORM_21_526EZ, // old
  VA_FORM_IDS.FORM_22_1995S,
  'definitions',
  'constants',
  'vaMedicalFacilities',
]);

describe('form:', () => {
  test('should check all forms', () => {
    const includedSchemaIds = Object.keys(schemas).filter(
      formId => !excludedForms.has(formId),
    );
    const includedFormIds = configs.map(form => form.formId);
    const includedSchemaIdsSet = new Set(includedSchemaIds);
    const mappedIdsSet = new Set(mappedIds);

    expect(includedSchemaIdsSet.size).not.toBeLessThan(mappedIdsSet.size);
    expect(includedSchemaIdsSet.size).not.toBeGreaterThan(mappedIdsSet.size);
    expect(includedSchemaIds).toEqual(includedFormIds);
  });

  configs.forEach(form => {
    describe(`${form.formId}:`, () => {
      describe('migrations:', () => {
        const { migrations } = form;
        if (migrations || form.version > 0) {
          test('should have a length equal to the version number', () => {
            expect(migrations.length).toBe(form.version);
          });
          test('should be typeof array', () => {
            expect(Array.isArray(migrations)).toBe(true);
          });
          test('should be array of functions', () => {
            expect(
              migrations.every(migration => typeof migration === 'function'),
            ).toBe(true);
          });
        }
      });

      test('should have chapters object', () => {
        expect(form.chapters).toBeInstanceOf(Object);
      });

      test('should have defaultDefinitions object', () => {
        expect(form.defaultDefinitions).toBeInstanceOf(Object);
      });

      if (form.introduction) {
        test('should have introduction function', () => {
          expect(form.introduction).toBeInstanceOf(Function);
        });
      }

      if (form.prefillEnabled) {
        test('should have prefillEnabled boolean', () => {
          expect(form.prefillEnabled).toBeInstanceOf(Boolean);
        });
      }

      if (form.prefillTransformer) {
        test('should have prefillTransformer function', () => {
          expect(form.prefillTransformer).toBeInstanceOf(Function);
        });
      }

      test('should have trackingPrefix', () => {
        expect(typeof form.trackingPrefix).toBe('string');
      });

      test('should have title', () => {
        expect(typeof form.title).toBe('string');
      });

      if (form.subTitle) {
        test('should have subTitle', () => {
          expect(typeof form.subTitle).toBe('string');
        });
      }

      test('should have urlPrefix', () => {
        expect(typeof form.urlPrefix).toBe('string');
      });

      if (form.submitUrl) {
        test('should have submitUrl', () => {
          expect(typeof form.submitUrl).toBe('string');
        });
      }

      if (form.submit) {
        test('should have submit', () => {
          expect(form.submit).toBeInstanceOf(Function);
        });
      }

      if (form.savedFormMessages) {
        test('should have savedFormMessages', () => {
          expect(form.savedFormMessages).toBeInstanceOf(Object);
        });
      }

      if (form.transformForSubmit) {
        test('should have transformForSubmit', () => {
          expect(form.transformForSubmit).toBeInstanceOf(Function);
        });
      }

      test('should have confirmation', () => {
        expect(form.confirmation).toBeInstanceOf(Function);
      });

      if (form.preSubmitInfo) {
        test('should have preSubmitInfo', () => {
          expect(form.preSubmitInfo).toBeInstanceOf(Object);
        });
      }

      if (form.footerContent) {
        test('should have footerContent', () => {
          expect(form.footerContent).toBeInstanceOf(Function);
        });
      }

      if (form.getHelp) {
        test('should have getHelp', () => {
          expect(form.getHelp).toBeInstanceOf(Function);
        });
      }

      if (form.errorText) {
        test('should have errorText', () => {
          expect(form.errorText).toBeInstanceOf(Function);
        });
      }
    });
  });
});
