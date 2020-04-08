import { expect } from 'chai';
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
  '22-10203',
]);

describe('form:', () => {
  it('should check all forms', () => {
    const includedSchemaIds = Object.keys(schemas).filter(
      formId => !excludedForms.has(formId),
    );
    const includedFormIds = configs.map(form => form.formId);
    const includedSchemaIdsSet = new Set(includedSchemaIds);
    const mappedIdsSet = new Set(mappedIds);

    expect(includedSchemaIdsSet.size).to.not.lessThan(
      mappedIdsSet.size,
      'a schema may have been removed from vets-json-schema/dist/schemas',
    );
    expect(includedSchemaIdsSet.size).to.not.greaterThan(
      mappedIdsSet.size,
      'a schema may have been added to vets-json-schema/dist/schemas',
    );
    expect(includedSchemaIds).to.have.same.members(
      includedFormIds,
      'possible missing formId property in a formConfig',
    );
  });

  configs.forEach(form => {
    describe(`${form.formId}:`, () => {
      describe('migrations:', () => {
        const { migrations } = form;
        if (migrations || form.version > 0) {
          it('should have a length equal to the version number', () => {
            expect(migrations.length).to.equal(form.version);
          });
          it('should be typeof array', () => {
            expect(migrations).to.be.an('array');
          });
          it('should be array of functions', () => {
            expect(
              migrations.every(migration => typeof migration === 'function'),
            ).to.be.true;
          });
        }
      });

      it('should have chapters object', () => {
        expect(form.chapters).to.be.an('object');
      });

      it('should have defaultDefinitions object', () => {
        expect(form.defaultDefinitions).to.be.an('object');
      });

      if (form.introduction) {
        it('should have introduction function', () => {
          expect(form.introduction).to.be.a('function');
        });
      }

      if (form.prefillEnabled) {
        it('should have prefillEnabled boolean', () => {
          expect(form.prefillEnabled).to.be.a('boolean');
        });
      }

      if (form.prefillTransformer) {
        it('should have prefillTransformer function', () => {
          expect(form.prefillTransformer).to.be.a('function');
        });
      }

      it('should have trackingPrefix', () => {
        expect(form.trackingPrefix).to.be.a('string');
      });

      it('should have title', () => {
        expect(form.title).to.be.a('string');
      });

      if (form.subTitle) {
        it('should have subTitle', () => {
          expect(form.subTitle).to.be.a('string');
        });
      }

      it('should have urlPrefix', () => {
        expect(form.urlPrefix).to.be.a('string');
      });

      if (form.submitUrl) {
        it('should have submitUrl', () => {
          expect(form.submitUrl).to.be.a('string');
        });
      }

      if (form.submit) {
        it('should have submit', () => {
          expect(form.submit).to.be.a('function');
        });
      }

      if (form.savedFormMessages) {
        it('should have savedFormMessages', () => {
          expect(form.savedFormMessages).to.be.a('object');
        });
      }

      if (form.transformForSubmit) {
        it('should have transformForSubmit', () => {
          expect(form.transformForSubmit).to.be.a('function');
        });
      }

      it('should have confirmation', () => {
        expect(form.confirmation).to.be.a('function');
      });

      if (form.preSubmitInfo) {
        it('should have preSubmitInfo', () => {
          expect(form.preSubmitInfo).to.be.a('object');
        });
      }

      if (form.footerContent) {
        it('should have footerContent', () => {
          expect(form.footerContent).to.be.a('function');
        });
      }

      if (form.getHelp) {
        it('should have getHelp', () => {
          expect(form.getHelp).to.be.a('function');
        });
      }

      if (form.errorText) {
        it('should have errorText', () => {
          expect(form.errorText).to.be.a('function');
        });
      }
    });
  });
});
