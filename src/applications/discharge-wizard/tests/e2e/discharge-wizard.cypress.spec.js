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
    cy.get('.main .vads-c-action-link--green').click();

    cy.get('va-radio-option[name=1_branchOfService][value="army"]')
      .find('label')
      .click();

    cy.get('select[name="2_dischargeYear"]').select('2016');

    cy.get(`va-radio-option[label="${questionLabels['4_reason']['1']}"]`)
      .find('label')
      .click();

    cy.get(
      `va-radio-option[label="Yes, ${questionLabels['6_intention']['1']}"]`,
    )
      .find('label')
      .click();

    cy.get(
      `va-radio-option[label="Yes, ${questionLabels['7_courtMartial'][
        '1'
      ].toLowerCase()}"]`,
    )
      .find('label')
      .click();

    cy.get('va-radio-option[name="8_prevApplication"][value="1"]')
      .find('label')
      .click();

    cy.get('va-radio-option[name="9_prevApplicationYear"][value="1"]')
      .find('label')
      .click();

    cy.get(
      `va-radio-option[label="Yes, ${questionLabels['12_priorService']['1']}"`,
    )
      .find('label')
      .click();

    // a11y check after all elements are visible
    axeTestPage();

    cy.get('.main .vads-c-action-link--green').click();

    // a11y check on results page
    axeTestPage();

    // open Form download
    cy.get('.main .step-1-download')
      .first()
      .click();
  });
});
