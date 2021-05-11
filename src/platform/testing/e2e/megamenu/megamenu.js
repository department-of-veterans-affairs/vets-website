const E2eHelpers = require('../helpers');
const Timeouts = require('../timeouts');

function assertBenefitsAndHealthCareIsPresent(client) {
  client
    .waitForElementVisible('#vetnav-menu', Timeouts.normal)
    .elements('css selector', '#vetnav-menu li', results => {
      client.expect(results.value.length).to.equal(4);
    })
    .click('.va-modal-close')
    .elements(
      'css selector',
      '#vetnav-va-benefits-and-health-care',
      results => {
        client.expect(results.value.length).to.equal(1);
      },
    );
}

function assertBenefitsAndHealthCareTopLevelLinksArePresent(client) {
  client
    .elements(
      'css selector',
      '#vetnav-va-benefits-and-health-care > ul > li',
      results => {
        client.expect(results.value.length).to.equal(11);
      },
    )

    // Health care
    .elements(
      'css selector',
      '#vetnav-health-care-ms .column-one ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(4);
      },
    )
    .elements(
      'css selector',
      '#vetnav-health-care-ms .column-two ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(5);
      },
    )
    .expect.element('#vetnav-health-care-ms .panel-bottom-link')
    .text.to.equal('View all in health care');
}

function assertDisabilityLinksArePresent(client) {
  client
    .click(
      'css selector',
      '#vetnav-va-benefits-and-health-care > ul li:nth-child(2) button',
    )
    .elements(
      'css selector',
      '#vetnav-disability-ms .column-one > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(3);
      },
    )
    .elements(
      'css selector',
      '#vetnav-disability-ms .column-two > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(5);
      },
    )
    .expect.element('#vetnav-disability-ms .panel-bottom-link')
    .text.to.equal('View all in disability');
}

function assertEducationAndTrainingLinksArePresent(client) {
  client
    .click(
      'css selector',
      '#vetnav-va-benefits-and-health-care > ul li:nth-child(3) button',
    )
    .elements(
      'css selector',
      '#vetnav-education-and-training-ms .column-one > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(5);
      },
    )
    .elements(
      'css selector',
      '#vetnav-education-and-training-ms .column-two > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(5);
      },
    )
    .expect.element('#vetnav-education-and-training-ms .panel-bottom-link')
    .text.to.equal('View all in education');
}

function assertCareersAndEmploymentLinksArePresent(client) {
  client
    .click(
      'css selector',
      '#vetnav-va-benefits-and-health-care > ul li:nth-child(4) button',
    )
    .elements(
      'css selector',
      '#vetnav-careers-and-employment-ms .column-one > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(3);
      },
    )
    .elements(
      'css selector',
      '#vetnav-careers-and-employment-ms .column-two > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(5);
      },
    )
    .expect.element('#vetnav-careers-and-employment-ms .panel-bottom-link')
    .text.to.equal('View all in careers and employment');
}

function assertPensionLinksArePresent(client) {
  client
    .click(
      'css selector',
      '#vetnav-va-benefits-and-health-care > ul li:nth-child(5) button',
    )
    .elements(
      'css selector',
      '#vetnav-pension-ms .column-one > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(5);
      },
    )
    .elements(
      'css selector',
      '#vetnav-pension-ms .column-two > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(4);
      },
    )
    .expect.element('#vetnav-pension-ms .panel-bottom-link')
    .text.to.equal('View all in pension');
}

function assertHousingAssistanceLinksArePresent(client) {
  client
    .click(
      'css selector',
      '#vetnav-va-benefits-and-health-care > ul li:nth-child(6) button',
    )
    .elements(
      'css selector',
      '#vetnav-housing-assistance-ms .column-one > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(3);
      },
    )
    .elements(
      'css selector',
      '#vetnav-housing-assistance-ms .column-two > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(3);
      },
    )
    .expect.element('#vetnav-housing-assistance-ms .panel-bottom-link')
    .text.to.equal('View all in housing assistance');
}

function assertLifeInsuranceLinkArePresent(client) {
  client
    .click(
      'css selector',
      '#vetnav-va-benefits-and-health-care > ul li:nth-child(7) button',
    )
    .elements(
      'css selector',
      '#vetnav-life-insurance-ms .column-one > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(3);
      },
    )
    .elements(
      'css selector',
      '#vetnav-life-insurance-ms .column-two > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(4);
      },
    )
    .expect.element('#vetnav-life-insurance-ms .panel-bottom-link')
    .text.to.equal('View all in life insurance');
}

function assertBurialsAndMemorialsLinksArePresent(client) {
  client
    .click(
      'css selector',
      '#vetnav-va-benefits-and-health-care > ul li:nth-child(8) button',
    )
    .elements(
      'css selector',
      '#vetnav-burials-and-memorials-ms .column-one > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(5);
      },
    )
    .elements(
      'css selector',
      '#vetnav-burials-and-memorials-ms .column-two > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(4);
      },
    )
    .expect.element('#vetnav-burials-and-memorials-ms .panel-bottom-link')
    .text.to.equal('View all in burials and memorials');
}

function assertRecordsLinksArePresent(client) {
  client
    .click(
      'css selector',
      '#vetnav-va-benefits-and-health-care > ul li:nth-child(9) button',
    )
    .elements(
      'css selector',
      '#vetnav-records-ms .column-one > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(4);
      },
    )
    .elements(
      'css selector',
      '#vetnav-records-ms .column-two > ul > li.mm-link-container',
      results => {
        client.expect(results.value.length).to.equal(5);
      },
    )
    .expect.element('#vetnav-records-ms .panel-bottom-link')
    .text.to.equal('View all in records');
}

function assertAboutVANavIsPresent(client) {
  client.elements(
    'css selector',
    '#vetnav-about-va > ul .vetnav-panel--submenu',
    results => {
      client.expect(results.value.length).to.equal(4);
    },
  );
}

function assertMainColumnElementsArePresent(client) {
  client.elements(
    'css selector',
    '#vetnav-main-column-col li.mm-link-container',
    results => {
      client.expect(results.value.length).to.equal(7);
    },
  );
}

function assertColumnOneElementsArePresent(client) {
  client.elements(
    'css selector',
    '#vetnav-column-one-col li.mm-link-container',
    results => {
      client.expect(results.value.length).to.equal(8);
    },
  );
}

function assertColumnTwoElementsArePresent(client) {
  client.elements(
    'css selector',
    '#vetnav-column-two-col li.mm-link-container',
    results => {
      client.expect(results.value.length).to.equal(6);
    },
  );
}

function testDataDrivenMegamenu(client, path) {
  const appURL = `${E2eHelpers.baseUrl}${path}`;

  client.openUrl(appURL).waitForElementVisible('body', Timeouts.normal);

  assertBenefitsAndHealthCareIsPresent(client);

  // Click on "VA Benefits and Health Care" nav button
  client.click('button[aria-controls="vetnav-va-benefits-and-health-care"]');

  // VA Benefits and Health Care top level links
  assertBenefitsAndHealthCareTopLevelLinksArePresent(client);

  // Disability links
  assertDisabilityLinksArePresent(client);

  // Education and training links
  assertEducationAndTrainingLinksArePresent(client);

  // Careers and employment links
  assertCareersAndEmploymentLinksArePresent(client);

  // Pension links
  assertPensionLinksArePresent(client);

  // Housing assistance links
  assertHousingAssistanceLinksArePresent(client);

  // Life insurance links
  assertLifeInsuranceLinkArePresent(client);

  // Burials and memorials links
  assertBurialsAndMemorialsLinksArePresent(client);

  // Records links
  assertRecordsLinksArePresent(client);

  client.expect
    .element('#vetnav-va-benefits-and-health-care > ul li:nth-child(10) a')
    .text.to.equal('Service member benefits');

  client.expect
    .element('#vetnav-va-benefits-and-health-care > ul li:nth-child(11) a')
    .text.to.equal('Family member benefits');

  // Click on "About VA" nav button
  client.click('button[aria-controls="vetnav-about-va"]');

  // About VA nav
  assertAboutVANavIsPresent(client);

  // About VA links column one
  client.expect
    .element('#vetnav-main-column-header')
    .text.to.equal('VA organizations');

  assertMainColumnElementsArePresent(client);

  // About VA links column two
  client.expect
    .element('#vetnav-column-one-header')
    .text.to.equal('Innovation at VA');

  assertColumnOneElementsArePresent(client);

  // About VA links column two
  client.expect
    .element('#vetnav-column-two-header')
    .text.to.equal('Learn about VA');

  assertColumnTwoElementsArePresent(client);

  // Find a VA Location
  client.expect
    .element('#vetnav-menu > li:last-child a')
    .text.to.equal('Find a VA Location');
}

module.exports = {
  testDataDrivenMegamenu,
};
