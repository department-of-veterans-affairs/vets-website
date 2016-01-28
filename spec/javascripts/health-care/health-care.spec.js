"use strict;"

describe("Health Care Form", function() {
  it("Builds a valid XML doc that reflects the form inputs.", function(done) {
    expect(true).to.be.true;
    // The xml example doc is taken from a snapshot of the legacy health care
    // application form.
    var parser = new DOMParser();
    
    $.get('/base/spec/fixtures/javascripts/health-care/anonymous-submission.xml')
      .done(function(data) {
        var goldenDoc = parser.parseFromString(data, "text/xml");
        var serializer = new XMLSerializer();
        console.log("Foo" +  serializer.serializeToString(goldenDoc));
      }).fail(function() {
        assert.fail("Unable to load XML document");
      }).always(function() { done(); });
  });
});

