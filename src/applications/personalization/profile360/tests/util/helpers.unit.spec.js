import { expect } from 'chai';

import { formDescriptions } from '../../util/helpers';

import { sipEnabledForms } from '../../../dashboard/helpers';

import fullSchema1010ez from '../../../../hca/config/form';
import fullSchema0993 from '../../../../edu-benefits/0993/config/form';
import fullSchema1990 from '../../../../edu-benefits/1990/config/form';
import fullSchema1990e from '../../../../edu-benefits/1990e/config/form';
import fullSchema1990n from '../../../../edu-benefits/1990n/config/form';
import fullSchema1995 from '../../../../edu-benefits/1995/config/form';
import fullSchema5490 from '../../../../edu-benefits/5490/config/form';
import fullSchema5495 from '../../../../edu-benefits/5495/config/form';
import fullSchemaFeedbackTool from '../../../../edu-benefits/feedback-tool/config/form';
import fullSchema526EZ from '../../../../disability-benefits/526EZ/config/form';
import fullSchema527EZ from '../../../../pensions/config/form';
import fullSchema530 from '../../../../burials/config/form';
import fullSchema10007 from '../../../../pre-need/config/form';
import fullSchemaVIC from '../../../../vic-v2/config/form';
import fullSchema686 from '../../../../disability-benefits/686/config/form';

const configs = [
  fullSchema1010ez,
  fullSchema686,
  fullSchema0993,
  fullSchema1990,
  fullSchema1990e,
  fullSchema1990n,
  fullSchema1995,
  fullSchema5490,
  fullSchema5495,
  fullSchemaFeedbackTool,
  fullSchema526EZ,
  fullSchema527EZ,
  fullSchema530,
  fullSchema10007,
  fullSchemaVIC,
];

describe('profile helpers:', () => {
  describe('formDescriptions', () => {
    it('should have description information for each verified form', () => {
      sipEnabledForms.forEach(form => {
        expect(formDescriptions[form]).to.exist;
      });
    });
  });
  describe('handleAuthorizableForms', () => {
    it('should include authorization message if authorizable', () => {
      configs.forEach(config => {
        if (config.authorize) {
          expect(config.authorizationMessage).to.exist;
        }
      });
    });
    it('should include getAuthorizationState if authorizable', () => {
      configs.forEach(config => {
        if (config.authorize) {
          expect(config.getAuthorizationState).to.exist;
        }
      });
    });
  });
});
