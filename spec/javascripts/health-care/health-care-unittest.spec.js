let HealthApp = require('../../../_health-care/_js/_form.js');

describe('Health Care Form UnitTests', function() {
  before(function(){
    fixture.setBase('spec/fixtures')
  });
  afterEach(function(){
    fixture.cleanup();
  });

  describe('Extract Functions', function() {
    it('extracts date from a composite date component', function() {
      const form = fixture.load('html/date_form.html')[0];
      // TODO(awong): Use ES6 destructured imports rather than const locals..
      const getFormData = HealthApp.forTest.getFormData;
      const extractDateWithSlashTransform = HealthApp.forTest.extractDateWithSlashTransform;
      const fieldPrefix = 'test[date_of_birth]';

      expect(extractDateWithSlashTransform(getFormData(form), fieldPrefix)).equals('');

      form.elements[fieldPrefix + '[month]'].value = 1;
      form.elements[fieldPrefix + '[date]'].value = 2;
      form.elements[fieldPrefix + '[year]'].value = 1987;
      expect(extractDateWithSlashTransform(getFormData(form), fieldPrefix)).equals('01/02/1987');

      form.elements[fieldPrefix + '[month]'].value = 11;
      form.elements[fieldPrefix + '[date]'].value = 31;
      expect(extractDateWithSlashTransform(getFormData(form), fieldPrefix)).equals('11/31/1987');

      // TODO(awong) write out-of-bound date validation logic.
    });
  });
});

