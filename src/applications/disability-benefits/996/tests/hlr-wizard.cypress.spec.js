import {
  BASE_URL,
  WIZARD_STATUS,
  SAVED_CLAIM_TYPE,
  CONTESTABLE_ISSUES_API,
  LEGACY_APPEALS_URL,
  BENEFIT_OFFICES_URL,
  SUPPLEMENTAL_CLAIM_URL,
  HLR_INFO_URL,
  FORM_URL,
} from '../constants';
import Timeouts from 'platform/testing/e2e/timeouts';

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
    window.dataLayer = [];
    cy.intercept('GET', '/v0/feature_toggles?*', { data: { features: [] } });
    cy.intercept('GET', `/v0${CONTESTABLE_ISSUES_API}*`, []);
    cy.intercept('GET', `/v1${CONTESTABLE_ISSUES_API}*`, []);
    sessionStorage.removeItem(WIZARD_STATUS);
    cy.visit(BASE_URL);
    cy.injectAxe();
  });

  it('should show the form wizard', () => {
    cy.url().should('include', BASE_URL);
    cy.axeCheck();
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Request a Higher-Level Review');
    cy.axeCheck();
  });
  // other claims flow
  it('should show other claims', () => {
    cy.get('[type="radio"][value="other"]').check(checkOpt);
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

  // legacy appeals flow
  it('should show legacy appeals question & alert', () => {
    cy.get('[type="radio"][value="compensation"]').check(checkOpt);
    cy.get(`a[href*="${LEGACY_APPEALS_URL}"]`).should('exist');
    cy.checkFormChange({
      label: 'For what type of claim are you requesting a Higher-Level Review?',
      value: 'compensation',
    });

    cy.get('[type="radio"][value="legacy-yes"]').check(checkOpt);
    // download form link
    cy.get(`a[href*="${FORM_URL}"]`).should('exist');
    // supplemental claim link
    cy.get(`a[href*="${SUPPLEMENTAL_CLAIM_URL}"]`).should('exist');
    cy.checkFormChange({
      label: 'Is this claim going through the legacy appeals process?',
      value: 'legacy-yes',
    });
    cy.checkFormAlert('legacy appeals process');
    cy.axeCheck();
  });

  // start form flow; skip until wizard is on /start in prod
  it.skip('should show legacy appeals question & alert', () => {
    const h1Text = 'Request a Higher-Level Review';
    // starts with focus on breadcrumb
    cy.focused().should('have.attr', 'id', 'va-breadcrumbs-list');
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', h1Text);

    cy.get('[type="radio"][value="compensation"]').check(checkOpt);
    cy.checkStorage(SAVED_CLAIM_TYPE, 'compensation');
    cy.checkFormChange({
      label: 'For what type of claim are you requesting a Higher-Level Review?',
      value: 'compensation',
    });

    cy.get(`a[href*="${LEGACY_APPEALS_URL}"]`).should('exist');
    cy.get('[type="radio"][value="legacy-no"]').check(checkOpt);
    // learn more link
    cy.get(`a[href*="${HLR_INFO_URL}"]`).should('exist');
    cy.checkFormChange({
      label: 'Is this claim going through the legacy appeals process?',
      value: 'legacy-no',
    });
    cy.axeCheck();

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
  });

  // v2 skip legacy appeals question; skip until wizard is on /start in prod
  it.skip('should show skip legacy appeals question & show form start for HLR v2', () => {
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [{ name: 'hlrV2', value: true }],
      },
    });
    // reload the page, so the intercept override takes effect
    // cy.visit(BASE_URL);
    cy.reload();
    cy.injectAxe();

    const h1Text = 'Request a Higher-Level Review';
    // starts with focus on breadcrumb
    cy.focused().should('have.attr', 'id', 'va-breadcrumbs-list');
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', h1Text);

    cy.get('[type="radio"][value="compensation"]').check(checkOpt);
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
