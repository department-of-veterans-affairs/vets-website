import { expect } from 'chai';
import _ from 'lodash/fp';

import { veteranToApplication, completeVeteran } from '../../../src/js/common/model/veteran';
import applicationSchema from 'vets-json-schema/dist/10-10EZ-schema.json';
import { Validator } from 'jsonschema';

import fakeApplication from './fake-application.json';

// This is a trivial test that shows the CI system is sane.
describe.only('Veteran model', () => {
  describe('veteranToApplication', () => {
    const v = new Validator();
    it('completeVeteran translates exactly to fake-application.json.', () => {
      const application = JSON.parse(veteranToApplication(completeVeteran));
      application.privacyAgreementAccepted = true;
      const result = v.validate(application, applicationSchema);

      expect(result.valid).to.be.true;
      expect(application).to.eql(fakeApplication);
    });
    it('should remove children array if no financial disclosure', () => {
      const vetNoDisclose = _.set('discloseFinancialInformation.value', 'N', completeVeteran);
      const application = JSON.parse(veteranToApplication(vetNoDisclose));
      application.privacyAgreementAccepted = true;
      const result = v.validate(application, applicationSchema);

      expect(result.valid).to.be.true;
      expect(application.children).to.be.undefined;
    });
  });
});
