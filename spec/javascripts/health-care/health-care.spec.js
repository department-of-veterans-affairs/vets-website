"use strict;"

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
    var childNodes = node2.childNodes;
    for (i = 0; i < childNodes.length; ++i) {
      nodeStack2.push(childNodes[i]);
    }

    if (node1.nodeType != node2.nodeType) {
      result.pass = false;
      result.message = "Expected " + expectNodeName(node1) + " type "
        + node1.nodeType + " to equal " + expectNodeName(node2) + " type "
        + noe2.nodeType;
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
        var attr = attributes[i];
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
        var attr = attributes[i];
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
    this.timeout(10000);
    var fixtureFrame = document.createElement('iframe');
    fixtureFrame.id = "fixture-frame";
    fixtureFrame.src = 'base/_site/health-care/form.html';
    fixtureFrame.onload = function() { done(); };
    document.body.appendChild(fixtureFrame);
  });

  afterEach(function(){
    var fixtureFrame = document.getElementById("fixture-frame");
    if (fixtureFrame !== undefined) {
      fixtureFrame.parentNode.removeChild(fixtureFrame);
    }
  });

  it("Builds a valid XML doc that reflects the form inputs.", function(done) {
    // The xml example doc is taken from a snapshot of the legacy health care
    // application form.
    var HealthApp = document.getElementById("fixture-frame").contentWindow.HealthApp;
    assert.isNotNull(HealthApp, "The iframe didn't load or is corrupt.");

    $.get('/base/spec/fixtures/javascripts/health-care/anonymous-submission.xml')
      .done(function(data) {
        var xmlDoc = HealthApp.build1010ezXml(HealthApp.getFormRoot());
        expect(data).to.xml.equal(xmlDoc);
      }).fail(function() {
        expect(true).to.be.false;
      }).always(function() { done(); });
  });
});

