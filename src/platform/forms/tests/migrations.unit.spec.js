import { expect } from 'chai';
import fullSchema1010ez from 'applications/hca/config/form';
import fullSchema0993 from 'applications/edu-benefits/0993/config/form';
import fullSchema1990 from 'applications/edu-benefits/1990/config/form';
import fullSchema1990e from 'applications/edu-benefits/1990e/config/form';
import fullSchema1990n from 'applications/edu-benefits/1990n/config/form';
import fullSchema1995 from 'applications/edu-benefits/1995/config/form';
import fullSchema5490 from 'applications/edu-benefits/5490/config/form';
import fullSchema5495 from 'applications/edu-benefits/5495/config/form';
import fullSchema527EZ from 'applications/pensions/config/form';
import fullSchema526AllClaims from 'applications/disability-benefits/all-claims/config/form';
import fullSchema530 from 'applications/burials/config/form';
import fullSchema10007 from 'applications/pre-need/config/form';
import fullSchema686 from 'applications/disability-benefits/686/config/form';
import fullSchemaFeedbackTool from 'applications/edu-benefits/feedback-tool/config/form';

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
  VA_FORM_IDS.FORM_22_1990,
  VA_FORM_IDS.FORM_22_1990E,
  VA_FORM_IDS.FORM_22_1990N,
  VA_FORM_IDS.FORM_22_1995,
  VA_FORM_IDS.FORM_22_5490,
  VA_FORM_IDS.FORM_22_5495,
  VA_FORM_IDS.FORM_40_10007,
  VA_FORM_IDS.FEEDBACK_TOOL,
];

const configs = [
  fullSchema1010ez,
  // Remap the formId to match the name in vets-json-schema
  // This should only affect the mapping in the "check all forms" test
  { ...fullSchema526AllClaims, formId: '21-526EZ-ALLCLAIMS' },
  fullSchema686,
  fullSchema527EZ,
  fullSchema530,
  fullSchema0993,
  fullSchema1990,
  fullSchema1990e,
  fullSchema1990n,
  fullSchema1995,
  fullSchema5490,
  fullSchema5495,
  fullSchema10007,
  fullSchemaFeedbackTool,
];

const excludedForms = new Set([
  '28-1900',
  VA_FORM_IDS.FORM_21_526EZ,
  '28-8832',
  '24-0296',
  '21-4142',
  VA_FORM_IDS.VIC,
  VA_FORM_IDS.FORM_22_0994, // TODO: remove this when 0994 is ready
  VA_FORM_IDS.FORM_22_1995_STEM,
  'definitions',
  'constants',
  'vaMedicalFacilities',
]);

describe('form migrations:', () => {
  it('should check all forms', () => {
    const allFormIds = Object.keys(schemas).filter(
      formId => !excludedForms.has(formId),
    );
    const reformattedIds = mappedIds.slice(0);
    reformattedIds.splice(0, 1, VA_FORM_IDS.FORM_10_10EZ);
    const includedFormIds = configs.map(form => form.formId);
    expect(new Set(allFormIds)).to.deep.equal(new Set(mappedIds));
    expect(includedFormIds).to.deep.equal(reformattedIds);
  });
  it('should have a length equal to the version number', () => {
    configs.forEach(form => {
      if (form.migrations || form.version > 0) {
        expect(form.migrations.length).to.equal(form.version);
      }
    });
  });
});
