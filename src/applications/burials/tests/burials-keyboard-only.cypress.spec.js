import mockUser from './e2e/fixtures/mocks/mockUser';
import burial1234 from './e2e/fixtures/mocks/burial-1234.json';
import burialPost from './e2e/fixtures/mocks/burial-post.json';
// This also works with maximal-test.json
import testData from './schema/minimal-test.json';

describe('Burials keyboard only navigation', () => {
  it.skip('navigates through a selected form', () => {
    const { data } = testData;
    cy.intercept('PUT', 'v0/in_progress_forms/21P-530', {});
    cy.intercept('GET', '/v0/burial_claims/1234', burial1234);
    cy.intercept('POST', '/v0/burial_claims', { body: burialPost });

    cy.login({
      data: {
        attributes: {
          ...mockUser.data.attributes,
          // eslint-disable-next-line camelcase
          in_progress_forms: [], // clear out in-progress state
        },
      },
    });
    cy.visit('/burials-and-memorials/application/530');
    cy.injectAxeThenAxeCheck();

    // *** Intro page ***
    cy.tabToStartForm();

    // *** Claimant Info ***
    cy.typeInFullName('root_claimantFullName_', data.claimantFullName);
    cy.tabToElement('[name="root_relationship_type"]');
    cy.chooseRadio(data.relationship.type);

    // Fill in "Other" input which is revealed when the radio is selected
    if (data.relationship.type === 'other') {
      cy.typeInIfDataExists(
        '#root_relationship_other',
        data.relationship.other,
      );
      cy.setCheckboxFromData(
        '#root_relationship_isEntity',
        data.relationship['view:isEntity'],
      );
    }

    cy.tabToContinueForm();

    // *** Deceased Veteran Info, page 1 ***
    cy.typeInFullName('root_veteranFullName_', data.veteranFullName);
    cy.typeInIfDataExists(
      '#root_veteranSocialSecurityNumber',
      data.veteranSocialSecurityNumber,
    );
    cy.typeInIfDataExists(
      '#root_vaFileNumber',
      data.veteranSocialSecurityNumber,
    );

    cy.typeInDate('root_veteranDateOfBirth', data.veteranDateOfBirth);
    cy.typeInIfDataExists('#root_placeOfBirth', data.placeOfBirth);

    cy.tabToContinueForm();

    // *** Deceased Veteran Info, page 2 ***
    cy.typeInDate('root_deathDate', data.deathDate);
    cy.typeInDate('root_burialDate', data.burialDate);

    cy.tabToElement('input[name="root_locationOfDeath_location"]');
    cy.chooseRadio(data.locationOfDeath.location);

    cy.tabToContinueForm();

    // *** Military History ***
    /* Only adding one period, because tabbing takes a lot of time
    const toursLength = data.toursOfDuty.length;
    data.toursOfDuty.forEach((tour, index) => {
      // Move toursOfDuty block below here if we're adding all

      // Add more; save time, commenting this out
      if (index + 1 < toursLength) {
        cy.tabToElement('.va-growable-add-btn');
        cy.realPress('Space');
        // shift-tab up to edit button before new block
        cy.tabToElement('.usa-button-secondary.edit', false);
      }
    }); */
    if (data.toursOfDuty?.length) {
      const tour = data.toursOfDuty?.[0];
      const index = 0;
      cy.typeInDate(
        `root_toursOfDuty_${index}_dateRange_from`,
        tour.dateRange.from,
      );
      cy.typeInDate(
        `root_toursOfDuty_${index}_dateRange_to`,
        tour.dateRange.to,
      );
      cy.typeInIfDataExists(
        `#root_toursOfDuty_${index}_serviceBranch`,
        tour.serviceBranch,
      );
      cy.typeInIfDataExists(`#root_toursOfDuty_${index}_rank`, tour.rank);
      cy.typeInIfDataExists(
        `#root_toursOfDuty_${index}_serviceNumber`,
        tour.serviceNumber,
      );
      cy.typeInIfDataExists(
        `#root_toursOfDuty_${index}_placeOfEntry`,
        tour.placeOfEntry,
      );
      cy.typeInIfDataExists(
        `#root_toursOfDuty_${index}_placeOfSeparation`,
        tour.placeOfSeparation,
      );
    }

    cy.tabToContinueForm();

    // *** Serve under another name? ***
    cy.tabToElement('[name="root_view:serveUnderOtherNames"]');
    cy.chooseRadio('N'); // save time, chosing no

    cy.tabToContinueForm();

    // *** Benefits selection ***
    const claimedBenefits = data['view:claimedBenefits'];
    cy.setCheckboxFromData(
      '#root_view\\:claimedBenefits_burialAllowance',
      claimedBenefits.burialAllowance,
    );
    cy.setCheckboxFromData(
      '#root_view\\:claimedBenefits_plotAllowance',
      claimedBenefits.plotAllowance,
    );
    /*
    // If transportation is checked, then a required upload is needed.
    // TODO: Figure out how to test keyboard only uploads
    if (claimedBenefits.transportation) {
      cy.setCheckboxFromData(
        '#root_view\\:claimedBenefits_transportation',
        claimedBenefits.transportation,
      );
      // This input is visible if claimedBenefits.transportation is true
      if (claimedBenefits.amountIncurred) {
        cy.typeInIfDataExists(
          '#root_view\\:claimedBenefits_amountIncurred',
          claimedBenefits.amountIncurred,
        );
      }
    }
    */

    cy.tabToContinueForm();

    // *** Burial allowance ***
    if (claimedBenefits.burialAllowance) {
      cy.tabToElement('[name="root_burialAllowanceRequested"]');
      // If set to "service", a file upload is required, see TODO above
      cy.chooseRadio(
        data.burialAllowanceRequested === 'service'
          ? 'vaMC'
          : data.burialAllowanceRequested,
      );
      if (data.burialAllowanceRequested === 'vaMC' && data.burialCost) {
        cy.typeInIfDataExists('#root_burialCost', data.burialCost);
      }
      if (data.relationship.type === 'other') {
        cy.tabToElement('[name="root_benefitsUnclaimedRemains');
        cy.chooseRadio(data.benefitsUnclaimedRemains ? 'Y' : 'N');
      }

      cy.tabToContinueForm();
    }

    // *** Plot or interment allowance ***
    if (claimedBenefits.plotAllowance) {
      cy.typeInIfDataExists('#root_placeOfRemains', data.placeOfRemains);
      cy.tabToElement('[name="root_federalCemetery"]');
      cy.chooseRadio(data.federalCemetery ? 'Y' : 'N');
      if (!data.federalCemetery) {
        cy.tabToElement('[name="root_stateCemetery"]');
        cy.chooseRadio(data.stateCemetery ? 'Y' : 'N');
      }
      cy.tabToElement('[name="root_govtContributions"]');
      cy.chooseRadio(data.govtContributions ? 'Y' : 'N');

      cy.tabToContinueForm();
    }

    // *** Claimant contact info ***
    cy.typeInIfDataExists('#root_firmName', data.firmName);
    cy.typeInIfDataExists('#root_officialPosition', data.officialPosition);

    cy.tabToElement('#root_claimantAddress_country');
    cy.chooseSelectOptionUsingValue(data.claimantAddress.country);
    cy.typeInIfDataExists(
      '#root_claimantAddress_street',
      data.claimantAddress.street,
    );
    cy.typeInIfDataExists(
      '#root_claimantAddress_street2',
      data.claimantAddress.street2,
    );
    cy.typeInIfDataExists(
      '#root_claimantAddress_city',
      data.claimantAddress.city,
    );
    cy.tabToElement('#root_claimantAddress_state');
    cy.chooseSelectOptionUsingValue(data.claimantAddress.state);
    cy.typeInIfDataExists(
      '#root_claimantAddress_postalCode',
      data.claimantAddress.postalCode,
    );
    cy.typeInIfDataExists('#root_claimantEmail', data.claimantEmail);
    cy.typeInIfDataExists('#root_claimantPhone', data.claimantPhone);

    cy.tabToContinueForm();

    // *** Upload ***
    // Forcing uploads to not be required by setting the following:
    // - claimedBenefits.transportation to `false`
    // - data.burialAllowanceRequested to NOT be 'service'
    cy.tabToSubmitForm();

    // *** Review & Submit ***
    cy.setCheckboxFromData('input[type="checkbox"]', true);
    cy.tabToSubmitForm();

    // *** Confirmation ***
    // Look for print button
    cy.get('button.screen-only').should('exist');
  });
});
