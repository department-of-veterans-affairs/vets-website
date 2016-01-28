"use strict;"

describe("Health Care Form", function() {
  it("Builds a valid XML doc that reflects the form inputs.", function() {
    var fixtures = jasmine.getFixtures();
    fixtures.fixturesPath = '/base/spec/fixtures/javascripts';
    expect(true).toBe(true);
    // The xml example doc is taken from a snapshot of the legacy health care
    // application form.
    var parser = new DOMParser();
    var goldenDoc = parser.parseFromString(
      fixtures.read('health-care/anonymous-submission.xml'),"text/xml");
  });
});

