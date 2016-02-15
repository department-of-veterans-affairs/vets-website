function compareXml(doc1, doc2) {
  var nodeStack1 = [doc1.firstChild];
  var nodeStack2 = [doc2.firstChild];

  var result = {};
  result.pass = true;

  function expectNodeName(node) {
    if (node.parentNode !== null) {
      return node.parentNode.nodeName + "/" + node.nodeName;
    }
    return node.nodeName;
  }

  while (nodeStack1.length > 0 && nodeStack2.length > 0) {
    // Continue the DFS of both documents.
    var node1 = nodeStack1.pop();
    var childNodes = node1.childNodes;
    for (var i = 0; i < childNodes.length; ++i) {
      nodeStack1.push(childNodes[i]);
    }

    var node2 = nodeStack2.pop();
    childNodes = node2.childNodes;
    for (i = 0; i < childNodes.length; ++i) {
      nodeStack2.push(childNodes[i]);
    }

    if (node1.nodeType != node2.nodeType) {
      result.pass = false;
      result.message = "Expected " + expectNodeName(node1) + " type "
        + node1.nodeType + " to equal " + expectNodeName(node2) + " type "
        + node2.nodeType;
      return result;
    }

    if (node1.nodeType == 1) {
      // Compare the namespace and localName.
      if (node1.namespaceURI != node2.namespaceURI ||
          node1.localName != node2.localName) {
        result.pass = false;
        result.message = "Expected " + expectNodeName(node1)
          + " to have same qualified name as " + expectNodeName(node2);
        return result;
      }

      // Compare the attributes.
      var attributeMap = {};
      var attributes = node1.attributes;
      var numNode1Attributes = 0;
      for (i = 0; i < attributes.length; ++i) {
        let attr = attributes[i];
        // Skip namespace attributes. They're not really attributes.
        if (attr.slice(0, 6) !== "xmlns:") {
          ++numNode1Attributes;
          // Mangle the namepsace URI with the attribute localName. This
          // allows comparing across different namespace prefixes in documents.
          // The "<" is a good separator because it's an invalid character in
          // an attribute ID.
          attributeMap[attr.namespaceURI + "<" + attr.localName] = attr.value;
        }
      }

      // Now there's a map of attributes in node1, we can look through node2
      // and ensure everything matches.
      attributes = node2.attributes;
      var numNode2Attributes = 0;
      for (i = 0; i < attributes.length; ++i) {
        let attr = attributes[i];
        // Skip namespace attributes. They're not really attributes.
        if (attr.slice(0, 6) !== "xmlns:") {
          ++numNode2Attributes;
          var mangledAttrName = attr.namespaceURI + "<" + attr.localName;
          if (attributeMap[mangledAttrName] != attr.value) {
            result.pass = false;
            result.message = "Expected " + expectNodeName(node1) + " attribute "
              + mangledAttrName + " to be " + attr.value;
            return result;
          }
        }
      }
      if (numNode1Attributes != numNode2Attributes) {
        result.pass = false;
        result.message = "Expected " + expectNodeName(node1)
          + " to have same number of attributes as "
          + expectNodeName(node2);
        return result;
      }
    } else if (node1.nodeType == 3) {
      // Text node.
      if (node1.textContent != node2.textContent) {
        result.pass = false;
        result.message = "Expected " + expectNodeName(node1)
          + ": " + node1.textContent + " to equal "
          + expectNodeName(node2) + ": " + node2.textContent;
        return result;
      }
    }
  }

  if (nodeStack1.length != nodeStack2.length) {
    result.pass = false;
    result.message = "Documents are differnet size";
  }

  return result;
}

chai.use(function(_chai, utils) {
  var flag = utils.flag;
  var Assertion = _chai.Assertion;
    Assertion.addProperty('xml', function () {
      //flag it as xml
      flag(this, 'xml', true);
    });

    var compare = function(_super){
      return function assertEqual(value){
        if (flag(this, 'xml')) {
          var result = compareXml(this._obj, value);
          if (flag(this, 'negate')) {
            new Assertion(result.pass).to.equal(false, "Documents match");
          } else {
            new Assertion(result.pass).to.equal(true, result.message);
          }
        } else {
          _super.apply(this, arguments);
        }
      };
    };
   Assertion.overwriteMethod('equal', compare);
   Assertion.overwriteMethod('equals', compare);
   Assertion.overwriteMethod('eq', compare);
});

describe("Health Care Form", function() {
  beforeEach(function(done){
    var fixtureFrame = document.createElement('iframe');
    fixtureFrame.id = "fixture-frame";
    fixtureFrame.src = '/health-care/form/index.html';
    fixtureFrame.onload = function() {
      // Signal async complete immediately otherwise assertions deadlock the
      // test.
      done();

      assert.isNotNull(
        fixtureFrame.contentWindow.HealthApp,
        "The iframe fixture didn't load or is corrupt.");
    };
    document.body.appendChild(fixtureFrame);
  });

  afterEach(function(){
    var fixtureFrame = document.getElementById("fixture-frame");
    if (fixtureFrame !== null) {
      fixtureFrame.parentNode.removeChild(fixtureFrame);
    }
  });


  it("Auto-saves on change events in the form.", function() {
    var contentWindow = document.getElementById("fixture-frame").contentWindow;
    var HealthApp = contentWindow.HealthApp;
    var form = HealthApp.getFormRoot();

    // Trigger an auto-save on a text change.
    form.elements['veteran[first_name]'].value = 'testname';
    var changeEvent = contentWindow.document.createEvent("UIEvents");
    changeEvent.initEvent("change", true, true);
    form.dispatchEvent(changeEvent);
    expect(JSON.parse(sessionStorage.getItem('voa_form'))['veteran[first_name]']).to.equal('testname');
    // TODO(awong): Trigger auto-save for radio, checkbox, and select controls.
  });

  it("Builds a valid XML doc that reflects the form inputs.", function(done) {
    // The xml example doc is taken from a snapshot of the legacy health care
    // application form.
    var HealthApp = document.getElementById("fixture-frame").contentWindow.HealthApp;

    // Set the form data to match the golden file.
    var form = HealthApp.getFormRoot();
    form.elements['veteran[ssn]'].value = '111-22-3333';
    form.elements['veteran[date_of_birth][month]'].value = "1";
    form.elements['veteran[date_of_birth][date]'].value = "1";
    form.elements['veteran[date_of_birth][year]'].value = "1970";
    form.elements['veteran[gender]'].value = "M";
    form.elements['veteran[last_name]'].value = "ALastName";
    form.elements['veteran[first_name]'].value = "AFirstName";
    form.elements['veteran[suffix_name]'].value = "SR";
    form.elements['veteran[middle_name]'].value = "AMiddleName";
    form.elements['veteran[city_of_birth]'].value = "Kent";
    form.elements['veteran[state_of_birth]'].value = "WA";
    form.elements['veteran[email]'].value = "test@foo.com";
    form.elements['veteran[gross_wage_income]'].value = "55000.00";
    form.elements['veteran[net_business_income]'].value = "1200.00";
    form.elements['veteran[other_income]'].value = "123.00";
    form.elements['veteran[spouses][gross_wage_income]'].value = "60000.00";
    form.elements['veteran[spouses][net_business_income]'].value = "2400.00";
    form.elements['veteran[spouses][other_income]'].value = "234.00";
    form.elements['veteran[children][gross_wage_income]'].value = "54.00";
    form.elements['veteran[children][net_business_income]'].value = "43.00";
    form.elements['veteran[children][other_income]'].value = "32.00";
    form.elements['veteran[children][education_expenses]'].value = "11235.00";

    $.get('/base/spec/fixtures/javascripts/health-care/anonymous-submission.xml')
      .done(function(data) {
        var xmlDoc = HealthApp.build1010ezXml(form);
        expect(data).to.xml.equal(xmlDoc);
      }).fail(function() {
        expect(true).to.be.false;
      }).always(function() {
        done();
      });
  });

  it("should return true for valid monetary value input", function() {
    var HealthApp = document.getElementById("fixture-frame").contentWindow.HealthApp;
    var form = HealthApp.getFormRoot();
    var testElement = form.elements['veteran[gross_wage_income]'];
    var validInput = ['55000.00', '100', '1.99', '10.'];

    for (var i = 0; i < validInput.length; i++) {
      testElement.value = validInput[i];
      expect(HealthApp.validate(testElement)).to.be.true;
    }
  });

  it("should return false for invalid monetary value input", function() {
    var HealthApp = document.getElementById("fixture-frame").contentWindow.HealthApp;
    var form = HealthApp.getFormRoot();
    var testElement = form.elements['veteran[gross_wage_income]'];
    var invalidInput = ['1,000', 'abc', '$100', '10.0.0', '#$#', '\'\''];

    for (var i = 0; i < invalidInput.length; i++) {
      testElement.value = invalidInput[i];
      expect(HealthApp.validate(testElement)).to.be.false;
    }
  });

  it("should contain the correct data validation type for the field", function() {
    var HealthApp = document.getElementById("fixture-frame").contentWindow.HealthApp;
    var form = HealthApp.getFormRoot();

    expect(form.elements['veteran[gross_wage_income]'].dataset.validationType).to.be.equal('monetary');
    expect(form.elements['veteran[net_business_income]'].dataset.validationType).to.be.equal('monetary');
    expect(form.elements['veteran[other_income]'].dataset.validationType).to.be.equal('monetary');
    expect(form.elements['veteran[spouses][gross_wage_income]'].dataset.validationType).to.be.equal('monetary');
    expect(form.elements['veteran[spouses][net_business_income]'].dataset.validationType).to.be.equal('monetary');
    expect(form.elements['veteran[spouses][other_income]'].dataset.validationType).to.be.equal('monetary');
    expect(form.elements['veteran[children][gross_wage_income]'].dataset.validationType).to.be.equal('monetary');
    expect(form.elements['veteran[children][net_business_income]'].dataset.validationType).to.be.equal('monetary');
    expect(form.elements['veteran[children][other_income]'].dataset.validationType).to.be.equal('monetary');
    expect(form.elements['veteran[children][other_income]'].dataset.validationType).to.be.equal('monetary');
  });
});

