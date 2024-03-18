import Timeouts from 'platform/testing/e2e/timeouts';

import burial1234 from './e2e/fixtures/mocks/burial-1234.json';
import burialPost from './e2e/fixtures/mocks/burial-post.json';
import testData from './schema/maximal-test.json';

describe('Burial claim test', () => {
  it.skip('Fills out and submits the form', () => {
    cy.intercept('GET', '/v0/burial_claims/1234', burial1234);
    cy.intercept('POST', '/v0/burial_claims', { body: burialPost });

    cy.visit('/burials-and-memorials/application/530');
    cy.get('body').should('be.visible');
    cy.title().should(
      'contain',
      'Apply for Burial Benefits (VA Form 21P-530) | Veterans Affairs',
    );
    cy.get('.schemaform-title', { timeout: Timeouts.slow }).should(
      'be.visible',
    );
    cy.get('.schemaform-start-button')
      .last()
      .click()
      .then(() => {
        cy.url().should('not.contain', '/introduction');
      });

    // Claimant Information
    cy.get('input[name="root_claimantFullName_first"]');
    cy.get('va-segmented-progress-bar')
      .shadow()
      .find('.progress-bar-segmented div.progress-segment:nth-child(1)')
      .should('have.class', 'progress-segment-complete');
    cy.fillName('root_claimantFullName', testData.data.claimantFullName);
    cy.selectRadio('root_relationship_type', testData.data.relationship.type);
    if (testData.data.relationship.type === 'other') {
      cy.get('input[name="root_relationship_other"]').should('be.visible');
      cy.fill(
        'input[name="root_relationship_other"]',
        testData.data.relationship.other,
      );
    }
    cy.injectAxeThenAxeCheck();

    cy.get('.form-panel .usa-button-primary')
      .click()
      .then(() => {
        cy.url().should('not.contain', '/claimant-information');
      });

    // Veteran Information
    cy.get('input[name="root_veteranFullName_first"]').should('be.visible');
    cy.fillName('root_veteranFullName', testData.data.veteranFullName);
    cy.fill(
      'input[name="root_veteranSocialSecurityNumber"]',
      testData.data.veteranSocialSecurityNumber,
    );
    cy.fill('input[name="root_vaFileNumber"]', testData.data.vaFileNumber);
    cy.fillDate('root_veteranDateOfBirth', testData.data.veteranDateOfBirth);
    cy.fill('input[name="root_placeOfBirth"]', testData.data.placeOfBirth);
    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();

    // Burial Information
    cy.get('input[name="root_deathDateYear"]').should('be.visible');
    cy.fillDate('root_deathDate', testData.data.deathDate);
    cy.fillDate('root_burialDate', testData.data.burialDate);
    cy.selectRadio(
      'root_locationOfDeath_location',
      testData.data.locationOfDeath.location,
    );
    if (testData.data.locationOfDeath.location === 'other') {
      cy.fill(
        'input[name="root_locationOfDeath_other"]',
        testData.data.locationOfDeath.other,
      );
    }
    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/veteran-information/burial');

    // Service Periods
    cy.get('input[name="root_toursOfDuty_0_dateRange_fromYear"]').should(
      'be.visible',
    );

    testData.data.toursOfDuty.forEach((tour, index) => {
      cy.get(
        `input[name="root_toursOfDuty_${index}_dateRange_fromYear"]`,
      ).should('be.visible');
      cy.fillDate(
        `root_toursOfDuty_${index}_dateRange_from`,
        tour.dateRange.from,
      );
      cy.fillDate(`root_toursOfDuty_${index}_dateRange_to`, tour.dateRange.to);
      cy.fill(
        `input[name="root_toursOfDuty_${index}_serviceBranch"]`,
        tour.serviceBranch,
      );
      cy.fill(`input[name="root_toursOfDuty_${index}_rank"]`, tour.rank);
      cy.fill(
        `input[name="root_toursOfDuty_${index}_serviceNumber"]`,
        tour.serviceNumber,
      );
      cy.fill(
        `input[name="root_toursOfDuty_${index}_placeOfEntry"]`,
        tour.placeOfEntry,
      );
      cy.fill(
        `input[name="root_toursOfDuty_${index}_placeOfSeparation"]`,
        tour.placeOfEntry,
      );
      if (index < testData.data.toursOfDuty.length - 1) {
        cy.get('.usa-button-secondary.va-growable-add-btn').click();
      }
    });

    cy.get('va-segmented-progress-bar')
      .shadow()
      .find('.progress-bar-segmented div.progress-segment:nth-child(3)')
      .should('have.class', 'progress-segment-complete');

    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/military-history/service-periods');

    // Previous Names
    cy.get('label[for$="serveUnderOtherNamesYes"]');
    if (testData.data.previousNames.length) {
      cy.selectYesNo('root_view:serveUnderOtherNames', true);
      testData.data.previousNames.forEach((name, index) => {
        cy.fillName(`root_previousNames_${index}`, name);
        if (index < testData.data.previousNames.length - 1) {
          cy.get('.usa-button-secondary.va-growable-add-btn').click();
        }
      });
    } else {
      cy.selectYesNo('root_view:serveUnderOtherNames', false);
    }

    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/military-history/previous-names');

    // Benefit Selection
    cy.get('label[for="root_view:claimedBenefits_burialAllowance"]');
    cy.get('va-segmented-progress-bar')
      .shadow()
      .find('.progress-bar-segmented div.progress-segment:nth-child(4)')
      .should('have.class', 'progress-segment-complete');
    cy.clickIf(
      'input[name="root_view:claimedBenefits_burialAllowance"]',
      testData.data['view:claimedBenefits'].burialAllowance,
    );
    cy.clickIf(
      'input[name="root_view:claimedBenefits_plotAllowance"]',
      testData.data['view:claimedBenefits'].plotAllowance,
    );
    // TODO: Uncomment this when we get file upload working and testable
    // if (data['view:claimedBenefits'].transportation) {
    //   client
    //     .click('input[name="root_view:claimedBenefits_transportation"]')
    //     .fill('input[name="root_view:claimedBenefits_amountIncurred"]', data['view:claimedBenefits'].amountIncurred);
    // }

    // Dragged the above over from existing nightwatch test - to be addressed at a later date
    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/benefits/selection');

    // Burial Allowance -- conditional
    if (testData.data['view:claimedBenefits'].burialAllowance) {
      cy.get('label[for="root_burialAllowanceRequested_0"]');
      cy.selectRadio(
        'root_burialAllowanceRequested',
        testData.data.burialAllowanceRequested,
      );
      if (testData.data.burialAllowanceRequested === 'vaMC') {
        cy.fill('input[name="root_burialCost"]', testData.data.burialCost);
      }
      if (testData.data.relationship.type === 'spouse') {
        cy.selectYesNo(
          'root_previouslyReceivedAllowance',
          testData.data.previouslyReceivedAllowance,
        );
      } else if (testData.data.relationship.type === 'other') {
        cy.selectYesNo(
          'root_benefitsUnclaimedRemains',
          testData.data.benefitsUnclaimedRemains,
        );
      }
      cy.axeCheck();
      cy.get('.form-panel .usa-button-primary').click();
      cy.url().should('not.contain', '/benefits/burial-allowance');
    }
    // Plot Allowance -- conditional
    if (testData.data['view:claimedBenefits'].plotAllowance) {
      cy.get('input[name="root_placeOfRemains"]');
      cy.fill(
        'input[name="root_placeOfRemains"]',
        testData.data.placeOfRemains,
      );
      cy.selectYesNo('root_federalCemetery', testData.data.federalCemetery);

      if (!testData.data.federalCemetery) {
        cy.selectYesNo('root_stateCemetery', testData.data.stateCemetery);
      }

      cy.selectYesNo('root_govtContributions', testData.data.govtContributions);
      if (testData.data.govtContributions) {
        cy.fill(
          'input[name="root_amountGovtContribution"]',
          testData.data.amountGovtContribution,
        );
      }
      cy.axeCheck();
      cy.get('.form-panel .usa-button-primary').click();
      cy.url().should('not.contain', '/benefits/plot-allowance');
    }

    // Additional Information
    cy.get('select[name="root_claimantAddress_country"]');
    cy.get('va-segmented-progress-bar')
      .shadow()
      .find('.progress-bar-segmented div.progress-segment:nth-child(5)')
      .should('have.class', 'progress-segment-complete');
    if (!testData.data.relationship['view:isEntity']) {
      cy.fill(
        'input[name="root_officialPosition"]',
        testData.data.officialPosition,
      );
    }
    cy.fillAddress('root_claimantAddress', testData.data.claimantAddress);
    cy.fill('input[name="root_claimantEmail"]', testData.data.claimantEmail);
    cy.fill('input[name="root_claimantPhone"]', testData.data.claimantPhone);
    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/claimant-contact-information');

    // TODO: Test file upload
    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/documents');

    cy.get('va-segmented-progress-bar')
      .shadow()
      .find('.progress-bar-segmented div.progress-segment:nth-child(6)')
      .should('have.class', 'progress-segment-complete');

    // Review and Submit

    cy.get('[name="privacyAgreementAccepted"]')
      .find('label[for="checkbox-element"]')
      .should('be.visible');

    cy.get('[name="privacyAgreementAccepted"]')
      .find('[type="checkbox"]')
      .check({
        force: true,
      });

    cy.axeCheck();
    cy.get('.form-progress-buttons .usa-button-primary').click();
    cy.url().should('not.contain', '/review-and-submit');
    cy.get('.js-test-location', { timeout: Timeouts.slow })
      .invoke('attr', 'data-location')
      .should('not.contain', '/review-and-submit');
    cy.get('.confirmation-page-title');
    cy.axeCheck();
  });
});
