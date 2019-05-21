import { expect } from 'chai';

import {
  formTitles,
  formLinks,
  isSIPEnabledForm,
  sipEnabledForms,
} from '../helpers';

import fullSchema1010ez from 'applications/hca/config/form';
import fullSchema0993 from 'applications/edu-benefits/0993/config/form';
import fullSchema0994 from 'applications/edu-benefits/0994/config/form';
import fullSchema1990 from 'applications/edu-benefits/1990/config/form';
import fullSchema1990e from 'applications/edu-benefits/1990e/config/form';
import fullSchema1990n from 'applications/edu-benefits/1990n/config/form';
import fullSchema1995 from 'applications/edu-benefits/1995/config/form';
import fullSchema1995Stem from 'applications/edu-benefits/1995-STEM/config/form';
import fullSchema5490 from 'applications/edu-benefits/5490/config/form';
import fullSchema5495 from 'applications/edu-benefits/5495/config/form';
import fullSchemaFeedbackTool from 'applications/edu-benefits/feedback-tool/config/form';
import fullSchema526EZ from 'applications/disability-benefits/526EZ/config/form';
import fullSchema527EZ from 'applications/pensions/config/form';
import fullSchema530 from 'applications/burials/config/form';
import fullSchema10007 from 'applications/pre-need/config/form';
import fullSchemaVIC from 'applications/vic-v2/config/form';
import fullSchema686 from 'applications/disability-benefits/686/config/form';

import schemas from 'vets-json-schema/dist/schemas';

// Maps schema id to config id
const schemaToConfigIds = {
  '10-10EZ': '1010ez',
  '21-526EZ': '21-526EZ',
  '21-686C': '21-686C',
  '21P-527EZ': '21P-527EZ',
  '21P-530': '21P-530',
  '22-0993': '0993',
  '22-0994': '0994',
  '22-1990': '1990',
  '22-1990E': '1990e',
  '22-1990N': '1990n',
  '22-1995': '1995',
  '22-1995-STEM': '1995-STEM',
  '22-5490': '5490',
  '22-5495': '5495',
  '40-10007': '40-10007',
  'FEEDBACK-TOOL': 'FEEDBACK-TOOL',
  VIC: 'VIC',
  definitions: 'N/A',
  constants: 'N/A',
  vaMedicalFacilities: 'N/A',
};

const excludedForms = new Set([
  '28-1900',
  '28-8832',
  '24-0296',
  '21-4142',
  '21-526EZ-ALLCLAIMS', // TODO: remove this when we can?
]);

describe('profile helpers:', () => {
  describe('formTitles', () => {
    it('should have title information for each verified form', () => {
      sipEnabledForms.forEach(form => {
        expect(formTitles[form]).to.exist;
      });
    });
  });
  describe('formLinks', () => {
    it('should have link information for each verified form', () => {
      sipEnabledForms.forEach(form => {
        expect(formLinks[form]).to.exist;
      });
    });
  });
  describe('sipEnabledForms', () => {
    it('should include all and only SIP enabled forms', () => {
      const configs = [
        fullSchema1010ez,
        fullSchema686,
        fullSchema0993,
        fullSchema0994,
        fullSchema1990,
        fullSchema1990e,
        fullSchema1990n,
        fullSchema1995,
        fullSchema1995Stem,
        fullSchema5490,
        fullSchema5495,
        fullSchemaFeedbackTool,
        fullSchema526EZ,
        fullSchema527EZ,
        fullSchema530,
        fullSchema10007,
        fullSchemaVIC,
      ];
      const allFormIds = Object.keys(schemas).filter(
        formId => !excludedForms.has(formId),
      );
      const allMappedIds = Object.keys(schemaToConfigIds);
      const sipEnabledConfigs = configs.filter(config => !config.disableSave);
      const sipEnabledFormIds = sipEnabledConfigs.map(
        sipEnabledConfig => sipEnabledConfig.formId,
      );
      sipEnabledFormIds.push('complaint-tool');
      expect(new Set(allFormIds)).to.deep.equal(new Set(allMappedIds));
      expect(sipEnabledForms).to.deep.equal(new Set(sipEnabledFormIds));
    });
  });
  describe('handleIncompleteInformation', () => {
    it('should push error into window if a form is missing title or link information', () => {
      expect(isSIPEnabledForm('missingInfoForm')).to.be.false;
    });
  });
});
