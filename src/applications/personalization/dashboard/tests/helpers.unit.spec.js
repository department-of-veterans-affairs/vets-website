import { expect } from 'chai';

import {
  formTitles,
  formLinks,
  isFormAuthorizable,
  isSIPEnabledForm,
  presentableFormIDs,
  sipEnabledForms,
  sipFormSorter,
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
  '21-526EZ-ALLCLAIMS': '21-526EZ-ALLCLAIMS',
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

const excludedForms = new Set(['28-1900', '28-8832', '24-0296', '21-4142']);

describe('profile helpers:', () => {
  describe('formTitles', () => {
    it('should have title information for each verified form', () => {
      sipEnabledForms.forEach(form => {
        expect(formTitles[form]).to.exist;
      });
    });
  });

  describe('prefixedFormIDs', () => {
    it('should have an entry for each verified form', () => {
      sipEnabledForms.forEach(form => {
        expect(presentableFormIDs[form]).to.exist;
      });
    });
    it('should handle the standard case', () => {
      expect(presentableFormIDs['22-0993']).to.equal('FORM 22-0993');
    });
    it('should handle VIC differently', () => {
      expect(presentableFormIDs.VIC).to.equal('VETERAN ID CARD');
    });
    it('should handle Feedback Tool differently', () => {
      expect(presentableFormIDs['FEEDBACK-TOOL']).to.equal('FEEDBACK TOOL');
    });
  });

  describe('formLinks', () => {
    it('should have link information for each verified form', () => {
      sipEnabledForms.forEach(form => {
        expect(formLinks[form]).to.exist;
      });
    });
  });

  describe('isFormAuthorizable', () => {
    it('should return `true` if `authorize` is defined on the passed-in form config', () => {
      const formConfig = {
        authorize: () => {},
      };
      expect(isFormAuthorizable(formConfig)).to.be.true;
    });
    it('should return `false` if `authorize` is not defined on the passed-in form config', () => {
      const formConfig = {};
      expect(isFormAuthorizable(formConfig)).to.be.false;
    });
    it('should return `false` if it is passed in an undefined form config', () => {
      let formConfig;
      expect(isFormAuthorizable(formConfig)).to.be.false;
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
      expect(new Set(allFormIds)).to.deep.equal(new Set(allMappedIds));
      expect(sipEnabledForms).to.deep.equal(new Set(sipEnabledFormIds));
    });
  });

  describe('handleIncompleteInformation', () => {
    it('should push error into window if a form is missing title or link information', () => {
      expect(isSIPEnabledForm('missingInfoForm')).to.be.false;
    });
  });

  describe('sipFormSorter', () => {
    const formA = {
      form: '21P-527EZ',
      metadata: {
        version: 3,
        returnUrl: '/review-and-submit',
        savedAt: 1557507430028,
        expiresAt: 1562691437,
        lastUpdated: 1557507437,
      },
      lastUpdated: 1557507437,
    };
    const formB = {
      form: '1010ez',
      metadata: {
        version: 6,
        returnUrl: '/military-service/documents',
        savedAt: 1558027285255,
        expiresAt: 1563211286,
        lastUpdated: 1558027286,
      },
      lastUpdated: 1558027286,
    };
    const formC = {
      form: '22-1995-STEM',
      metadata: {
        version: 1,
        returnUrl: '/personal-information/contact-information',
        savedAt: 1558440074236,
        expiresAt: 1563624074,
        lastUpdated: 1558440074,
      },
      lastUpdated: 1558440074,
    };
    const invalidExpiresAt = {
      metadata: {
        expiresAt: 'not a number',
      },
    };
    const notAForm = {
      veteranStatus: {
        status: 'OK',
        isVeteran: true,
        servedInMilitary: true,
      },
    };
    describe('unhappy path', () => {
      it('should throw an error when no args are passed', () => {
        expect(() => sipFormSorter()).to.throw(TypeError, 'plain object');
      });
      it('should throw an error when a single invalid object is passed', () => {
        expect(() => sipFormSorter(notAForm)).to.throw(
          TypeError,
          'metadata.expiresAt',
        );
      });
      it('should throw an error when a single valid form is passed', () => {
        expect(() => sipFormSorter(formA)).to.throw(TypeError, 'plain object');
      });
      it('should throw an error when the second arg is a string', () => {
        expect(() => sipFormSorter(formA, 'not a form')).to.throw(
          TypeError,
          'plain object',
        );
      });
      it('should throw an error when the second arg is an array', () => {
        expect(() => sipFormSorter(formA, [])).to.throw(
          TypeError,
          'plain object',
        );
      });
      it('should throw an error when the second arg is a number', () => {
        expect(() => sipFormSorter(formA, 42)).to.throw(
          TypeError,
          'plain object',
        );
      });
      it('should throw an error when the second arg is an invalid object', () => {
        expect(() => sipFormSorter(formA, notAForm)).to.throw(
          TypeError,
          'metadata.expiresAt',
        );
      });
      it('should throw an error when the second arg is an empty object', () => {
        expect(() => sipFormSorter(formA, {})).to.throw(
          TypeError,
          'metadata.expiresAt',
        );
      });
      it('should throw an error when an arg has an invalid value for `metadata.expiresAt`', () => {
        expect(() => sipFormSorter(formA, invalidExpiresAt)).to.throw(
          TypeError,
          'metadata.expiresAt',
        );
      });
    });

    it('should sort forms correctly when used with Array.sort', () => {
      expect([formA].sort(sipFormSorter)).to.deep.equal([formA]);
      expect([formA, formB].sort(sipFormSorter)).to.deep.equal([formA, formB]);
      expect([formB, formA].sort(sipFormSorter)).to.deep.equal([formA, formB]);
      expect([formB, formC, formA].sort(sipFormSorter)).to.deep.equal([
        formA,
        formB,
        formC,
      ]);
    });
  });
});
