/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { questionLabels } from '../../constants';

function axeTestPage() {
  cy.injectAxe();
  cy.axeCheck('main', {
    rules: {
      'aria-roles': {
        enabled: false,
      },
    },
  });
}

describe('functionality of discharge wizard', () => {
  it('fill out the form and expect the form to have elements', () => {
    // navigate to discharge wizard and make an axe check
    // landing page
    cy.visit('/discharge-upgrade-instructions/');
    axeTestPage();

    // questions page | fill out form
    cy.get('.main .usa-button-primary').click();

    cy.get('va-radio-option[value="army"]').click({ waitforanimations: true });

    cy.get('va-select[name="2_dischargeYear"]')
      .shadow()
      .find('select')
      .select('2016', { waitforanimations: true });

    cy.get(
      `va-radio-option[label="${
        questionLabels['4_reason']['1']
      }"] input[type="radio"]`,
    ).click({ waitforanimations: true });

    cy.get(
      `va-radio-option[label="Yes, ${
        questionLabels['6_intention']['1']
      }"] input[type="radio"]`,
    ).click({ waitforanimations: true });

    cy.get('va-radio-option[value="army"]').click({ waitforanimations: true });

    cy.get('va-radio[name="7_courtMartial"] va-radio-option')
      .first()
      .click();

    cy.get(
      'va-radio[name="8_prevApplication"] va-radio-option[value="1"]',
    ).click({
      waitforanimations: true,
    });

    cy.get(
      'va-radio[name="9_prevApplicationYear"] va-radio-option[value="1"]',
    ).click({
      waitforanimations: true,
    });

    cy.get('va-radio[name="12_priorService"] va-radio-option[value="1"]').click(
      {
        waitforanimations: true,
      },
    );

    // a11y check after all elements are visible
    axeTestPage();

    cy.get('.main .usa-button-primary').click();

    // a11y check on results page
    axeTestPage();

    // open Form download
    cy.get('.main .usa-button-primary').click();
  });
});
