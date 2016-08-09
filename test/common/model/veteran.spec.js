const chai = require('chai');
chai.should();

const veteran = require('../../src/common/veteran');
const applicationSchema = require('../../src/common/schema/application');
const validate = require('../../src/common/schema/validator').compile(applicationSchema);
const fakeApplication = require('../data/fake-application.json');

// This is a trivial test that shows the CI system is sane.
describe('Veteran model', () => {
  describe('veteranToApplication', () => {
    it('completeVeteran translates exactly to fake-application.json.', () => {
      const application = JSON.parse(veteran.veteranToApplication(veteran.completeVeteran));
      const valid = validate(application);
      chai.assert.isTrue(valid, JSON.stringify([validate.errors, application], null, 2));
      application.should.deep.eql(fakeApplication);
    });
  });
});
