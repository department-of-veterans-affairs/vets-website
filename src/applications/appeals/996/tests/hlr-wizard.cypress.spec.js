/**
 * [TestRail-integrated] Spec for Higher Level Review - Wizard
 * @testrailinfo projectId 5
 * @testrailinfo suiteId 6
 * @testrailinfo groupId 2896
 * @testrailinfo runName HLR-e2e-Wizard
 */
import Timeouts from 'platform/testing/e2e/timeouts';

import {
  BASE_URL,
  WIZARD_STATUS,
  SAVED_CLAIM_TYPE,
  CONTESTABLE_ISSUES_API,
  BENEFIT_OFFICES_URL,
} from '../constants';

import cypressSetup from '../../shared/tests/cypress.setup';

Cypress.Commands.add('checkStorage', (key, expectedValue) => {
  cy.window()
    .its(`sessionStorage.${key}`)
    .should('eq', expectedValue);
});

Cypress.Commands.add('checkFormChange', ({ label, value }) => {
  cy.window().then(win => {
    const data = win.dataLayer.find(obj => obj?.['form-field-value'] === value);
    assert.equal(data?.event, 'howToWizard-formChange');
    assert.equal(data['form-field-type'], 'form-radio-buttons');
    assert.equal(data['form-field-label'], label);
    assert.equal(data['form-field-value'], value);
  });
});

Cypress.Commands.add('checkFormAlert', value => {
  cy.window().then(win => {
    const data = win.dataLayer.find(obj =>
      (obj?.['reason-for-alert'] || '').includes(value),
    );
    assert.equal(data.event, 'howToWizard-alert-displayed');
    expect(data['reason-for-alert']).to.contain(value);
  });
});

const checkOpt = {
  waitForAnimations: true,
};

describe('HLR wizard', () => {
  beforeEach(() => {
    cypressSetup();

    window.dataLayer = [];
    cy.intercept('GET', `/v1${CONTESTABLE_ISSUES_API}*`, []);

    sessionStorage.removeItem(WIZARD_STATUS);
    cy.visit(BASE_URL);
    cy.injectAxe();
  });

  it('should show the form wizard - C12065', () => {
    cy.url().should('include', BASE_URL);
    cy.axeCheck();
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Request a Higher-Level Review');
    cy.axeCheck();
  });
  // other claims flow
  it('should show other claims - C12066', () => {
    cy.get('va-radio-option[value="other"]').click(checkOpt);
    cy.checkStorage(SAVED_CLAIM_TYPE, undefined);
    // #8622 set by public websites accordion anchor ID
    cy.get(`a[href*="${BENEFIT_OFFICES_URL}"]`).should('exist');
    cy.checkFormChange({
      label: 'For what type of claim are you requesting a Higher-Level Review?',
      value: 'other',
    });
    cy.checkFormAlert('unsupported claim type');
    cy.axeCheck();
  });

  it('should show form start for HLR v2 - C12069', () => {
    // reload the page, so the intercept override takes effect
    // cy.visit(BASE_URL);
    cy.reload();
    cy.injectAxe();

    const h1Text = 'Request a Higher-Level Review';
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', h1Text);

    cy.get('va-radio-option[value="compensation"]').click(checkOpt);
    cy.checkStorage(SAVED_CLAIM_TYPE, 'compensation');
    cy.checkFormChange({
      label: 'For what type of claim are you requesting a Higher-Level Review?',
      value: 'compensation',
    });

    // start form
    const h1Addition = ' with VA Form 20-0996';
    cy.findAllByText(/higher-level review online/i, { selector: 'a' })
      .first()
      .click();

    cy.location('pathname').should('eq', `${BASE_URL}/introduction`);
    // title changes & gets focus
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', h1Text + h1Addition);
    cy.focused().should('have.text', h1Text + h1Addition);
    cy.checkStorage(WIZARD_STATUS, 'complete');
    cy.injectAxe();
    cy.axeCheck();
    Cypress.config('features', '');
  });
});
