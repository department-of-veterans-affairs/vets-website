import { expect } from 'chai';

import {
  formTitles,
  formLinks,
  isSIPEnabledForm,
  sipEnabledForms,
} from '../../src/js/user-profile/helpers';

import fullSchema1010ez from '../../src/js/hca/config/form';
import fullSchema1990 from '../../src/js/edu-benefits/1990/config/form';
import fullSchema1990e from '../../src/js/edu-benefits/1990e/config/form';
import fullSchema1990n from '../../src/js/edu-benefits/1990n/config/form';
import fullSchema1995 from '../../src/js/edu-benefits/1995/config/form';
import fullSchema5490 from '../../src/js/edu-benefits/5490/config/form';
import fullSchema5495 from '../../src/js/edu-benefits/5495/config/form';
import fullSchema527EZ from '../../src/js/pensions/config/form';
import fullSchema530 from '../../src/js/burials/config/form';
import fullSchema10007 from '../../src/js/pre-need/config/form';

import schemas from 'vets-json-schema/dist/schemas';

// Maps schema id to config id
const schemaToConfigIds = {
  '10-10EZ': '1010ez',
  '21P-527EZ': '21P-527EZ',
  '21P-530': '21P-530',
  '22-1990': '1990',
  '22-1990E': '1990e',
  '22-1990N': '1990n',
  '22-1995': '1995',
  '22-5490': '5490',
  '22-5495': '5495',
  '40-10007': '40-10007',
  definitions: 'N/A'
};

const excludedForms = new Set([
  '28-1900',
  '28-8832',
  'VIC'
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
        fullSchema1990,
        fullSchema1990e,
        fullSchema1990n,
        fullSchema1995,
        fullSchema5490,
        fullSchema5495,
        fullSchema527EZ,
        fullSchema530,
        fullSchema10007
      ];
      const allFormIds = Object.keys(schemas).filter(formId => !excludedForms.has(formId));
      const allMappedIds = Object.keys(schemaToConfigIds);
      const sipEnabledConfigs = configs.filter(config => !config.disableSave);
      const sipEnabledFormIds = sipEnabledConfigs.map(sipEnabledConfig => sipEnabledConfig.formId);
      expect(allFormIds).to.deep.equal(allMappedIds);
      expect(sipEnabledForms).to.deep.equal(new Set(sipEnabledFormIds));
    });
  });
  describe('handleIncompleteInformation', () => {
    it('should push error into window if a form is missing title or link information', () => {
      expect(isSIPEnabledForm('missingInfoForm')).to.be.false;
    });
  });
});
