import { expect } from 'chai';
import _ from 'lodash';

import {
  formTitles,
  formLinks,
  handleIncompleteInformation,
  handleNonSIPEnabledForm,
  sipEnabledForms,
} from '../../src/js/user-profile/helpers';

import fullSchema1010ez from '../../src/js/hca/config/form';
import fullSchema1990 from '../../src/js/edu-benefits/1990-rjsf/config/form';
import fullSchema1990e from '../../src/js/edu-benefits/1990e/config/form';
import fullSchema1990n from '../../src/js/edu-benefits/1990n/config/form';
import fullSchema1995 from '../../src/js/edu-benefits/1995/config/form';
import fullSchema5490 from '../../src/js/edu-benefits/5490/config/form';
import fullSchema5495 from '../../src/js/edu-benefits/5495/config/form';
import fullSchema527EZ from '../../src/js/pensions/config/form';
import fullSchema530 from '../../src/js/burials/config/form';

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
      const sipEnabledSchemas = [
        fullSchema1010ez,
        fullSchema1990,
        fullSchema1990e,
        fullSchema1990n,
        fullSchema1995,
        fullSchema5490,
        fullSchema5495,
        fullSchema527EZ,
        fullSchema530
      ].filter(schema => !!schema.savedFormMessages);
      const sipEnabledFormIds = sipEnabledSchemas.reduce((accumulator, schema) => {
        accumulator.push(schema.formId);
        return accumulator;
      }, []);
      expect(_.isEqual(sipEnabledForms, new Set(sipEnabledFormIds))).to.be.true;
    });
  });
  describe('handleIncompleteInformation', () => {
    it('should push error into window if a form is missing title or link information', () => {
      const oldWindow = global.window;
      global.window = { dataLayer: [] };
      handleIncompleteInformation('missingInfoForm');
      expect(global.window.dataLayer[0]).to.deep.equal({ event: 'missingInfoFormsip-list-item-missing-info' });
      global.window = oldWindow;
    });
  });
  describe('handleNonSIPEnabledForm', () => {
    it('should throw an error if a form is not included the list of sipEnabledForms', () => {
      expect(() => handleNonSIPEnabledForm('notSIPEnabledForm')).to.throw('Could not find form');
    });
  });
});
