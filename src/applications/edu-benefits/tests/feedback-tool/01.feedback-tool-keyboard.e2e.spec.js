const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts');
const PageHelpers = require('./feedback-tool-helpers');
const FormsTestHelpers = require('../../../../platform/testing/e2e/form-helpers');
const manifest = require('../../feedback-tool/manifest.json');

module.exports = E2eHelpers.createE2eTest(client => {
  const { ARROW_DOWN, ARROW_UP, ENTER, TAB } = client.Keys;

  PageHelpers.initApplicationSubmitMock();

  client
    .openUrl(`${E2eHelpers.baseUrl}${manifest.rootUrl}`)
    .waitForElementVisible('body', Timeouts.slow)
    .waitForElementVisible('.schemaform-title', Timeouts.slow)
    .click('.schemaform-start-button');

  E2eHelpers.overrideVetsGovApi(client);
  FormsTestHelpers.overrideFormsScrolling(client);
  E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

  // Evaluate the radio buttons for whom to submit this feedback
  client
    .keys(TAB)
    .allyEvaluateRadioButtons(
      [
        'input#root_onBehalfOf_0',
        'input#root_onBehalfOf_1',
        'input#root_onBehalfOf_2',
      ],
      ARROW_DOWN,
    )
    .allyEvaluateRadioButtons(
      [
        'input#root_onBehalfOf_0',
        'input#root_onBehalfOf_1',
        'input#root_onBehalfOf_2',
      ],
      ARROW_UP,
      true,
    );

  client.assert.isActiveElement('input#root_onBehalfOf_0');

  // Let's continue to the next screen by tabbing and pressing enter
  client.repeatKeypress(TAB, 3).keys(ENTER);

  // Applicant information. Set a prefix.
  client
    .waitForElementVisible('input[name="root_fullName_first"]', Timeouts.slow)
    .keys(TAB)
    .allyEvaluateSelectMenu('#root_fullName_prefix', 'dr', 'Dr.');

  // Enter first name
  client.keys(TAB).allyEvaluateInput('#root_fullName_first', 'Benjamin');

  // Skip the middle name and enter the last name
  client
    .repeatKeypress(TAB, 2)
    .allyEvaluateInput('#root_fullName_last', 'Rhodes');

  // Skip the suffix and enter a service affiliation
  client
    .repeatKeypress(TAB, 2)
    .allyEvaluateSelectMenu('#root_serviceAffiliation', 'veteran', 'Veteran');

  // Let's continue to the next screen by tabbing and pressing enter
  client.repeatKeypress(TAB, 2).keys(ENTER);

  // Service information. Select a branch of service.
  client
    .waitForElementVisible('#root_serviceBranch', Timeouts.slow)
    .keys(TAB)
    .allyEvaluateSelectMenu('#root_serviceBranch', 'army', 'Army');

  // Set the service start date
  client
    .keys(TAB)
    .allyEvaluateSelectMenu('#root_serviceDateRange_fromMonth', 'jan', '1')
    .keys(TAB)
    .allyEvaluateSelectMenu('#root_serviceDateRange_fromDay', '15', '15')
    .keys(TAB)
    .allyEvaluateInput('#root_serviceDateRange_fromYear', '1990');

  // Set the service end date
  // *TODO: Create a month pattern helper
  client
    .keys(TAB)
    .allyEvaluateSelectMenu('#root_serviceDateRange_toMonth', 'mar', '3')
    .keys(TAB)
    .allyEvaluateSelectMenu('#root_serviceDateRange_toDay', '31', '31')
    .keys(TAB)
    .allyEvaluateInput('#root_serviceDateRange_toYear', '2010');

  // Let's continue to the next screen by keyboard submitting the form
  client.repeatKeypress(TAB, 2).keys(ENTER);

  // Contact information. Skip the country select, enter a street address.
  client
    .waitForElementVisible('select[name="root_address_country"]', Timeouts.slow)
    .repeatKeypress(TAB, 2)
    .allyEvaluateInput('#root_address_street', '11233 Nowhere St');

  // Enter a city
  client
    .repeatKeypress(TAB, 2)
    .allyEvaluateInput('#root_address_city', 'Long Beach');

  // Select a state
  client.keys(TAB).allyEvaluateSelectMenu('#root_address_state', 'cali', 'CA');

  // Enter a postal code
  client.keys(TAB).allyEvaluateInput('#root_address_postalCode', '90712');

  // Enter an email address
  client.keys(TAB).allyEvaluateInput('#root_applicantEmail', 'test@test.com');

  // Re-enter the email address
  client
    .keys(TAB)
    .allyEvaluateInput('[name*="applicantEmailConfirmation"]', 'test@test.com');

  // Let's continue to the next screen by keyboard submitting the form
  client.repeatKeypress(TAB, 3).keys(ENTER);

  // Benefit information and select benefits from checkbox group
  client
    .waitForElementPresent(
      'input[name="root_educationDetails_programs_chapter33"]',
      Timeouts.slow,
    )
    .keys(TAB)
    .allyEvaluateCheckboxes([
      '#root_educationDetails_programs_chapter33',
      '#root_educationDetails_programs_chapter30',
    ]);

  // Let's continue to the next screen by keyboard submitting the form
  client.repeatKeypress(TAB, 2).keys(ENTER);

  // School information. Skip to manual school entry.
  client
    .waitForElementPresent('input[type="checkbox"]', Timeouts.slow)
    .repeatKeypress(TAB, 4)
    .allyEvaluateCheckboxes(['input[type="checkbox"]']);

  // Enter a school name
  client
    .keys(TAB)
    .allyEvaluateInput('[name*="manualSchoolEntry_name"]', 'Long Beach Poly');

  // Enter an address
  client
    .repeatKeypress(TAB, 2)
    .allyEvaluateInput(
      '[name*="manualSchoolEntry_address_street"]',
      '123 LaBrea Blvd',
    );

  // Enter a city
  client
    .repeatKeypress(TAB, 3)
    .allyEvaluateInput(
      '[name*="manualSchoolEntry_address_city"]',
      'Los Angeles',
    );

  // Enter a state
  client
    .keys(TAB)
    .allyEvaluateSelectMenu(
      '[name*="manualSchoolEntry_address_state"]',
      'cali',
      'CA',
    );

  // Enter a postal code
  client
    .keys(TAB)
    .allyEvaluateInput(
      '[name*="manualSchoolEntry_address_postalCode"]',
      '90001',
    );

  // Let's continue to the next screen by keyboard submitting the form
  // *TODO: Investigate why pressing ENTER on the postal code doesn't submit properly
  client.repeatKeypress(TAB, 2).keys(ENTER);

  // Issue information and check the first box. Then tab a bunch of times.
  client
    .waitForElementPresent('legend#root_issue-label', Timeouts.slow)
    .keys(TAB)
    .allyEvaluateCheckboxes(['#root_issue_recruiting'])
    .repeatKeypress(TAB, 11);

  // Enter text string in the first textarea
  client
    .keys(TAB)
    .allyEvaluateInput('#root_issueDescription', 'Decent recruiting practices');

  // Enter text string in the second textarea
  client
    .keys(TAB)
    .allyEvaluateInput(
      '#root_issueResolution',
      'Follow up on my remaining tuition and fees',
    );

  // Let's continue to the next screen by tabbing. Textareas don't allow submit inside them?
  client.repeatKeypress(TAB, 2).keys(ENTER);

  // Confirmation page. Skip to the checkbox and check it.
  client
    .waitForElementPresent('input[type="checkbox"]', Timeouts.slow)
    .repeatKeypress(TAB, 5)
    .allyEvaluateCheckboxes(['input[type="checkbox"]']);

  client.end();
});
