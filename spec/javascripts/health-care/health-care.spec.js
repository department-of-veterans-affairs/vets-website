"use strict;"

describe("Health Care Form", function() {
  it("Builds a valid XML doc that reflects the form inputs.", function(done) {
    expect(true).to.be.true;
    // The xml example doc is taken from a snapshot of the legacy health care
    // application form.
    
    $.get('/base/spec/fixtures/javascripts/health-care/anonymous-submission.xml')
      .done(function(data) {
        var serializer = new XMLSerializer();
        var goldenDoc = serializer.serializeToString(data);
        var xmlDoc = HealthApp.build1010ezXml(HealthApp.getFormRoot());
        expect(xmlDoc).to.equal(goldenDoc);
      }).fail(function() {
        assert.fail("Unable to load XML document");
      }).always(function() { done(); });
  });
});

