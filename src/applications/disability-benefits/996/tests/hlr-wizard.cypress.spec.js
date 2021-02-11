import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import {
  BASE_URL,
  WIZARD_STATUS,
  SAVED_CLAIM_TYPE,
  CONTESTABLE_ISSUES_API,
} from '../constants';

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
    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);
    cy.intercept('GET', `/v0${CONTESTABLE_ISSUES_API}*`, []);
    sessionStorage.removeItem(WIZARD_STATUS);
    cy.visit(BASE_URL);
    cy.injectAxe();
  });

  it('should show the form wizard', () => {
    cy.url().should('include', BASE_URL);
    cy.axeCheck();
    cy.get('h1').should('have.text', 'Request a Higher-Level Review');
    cy.axeCheck();
  });
  // other claims flow
  it('should show other claims', () => {
    cy.get('[type="radio"][value="other"]').check(checkOpt);
    cy.checkStorage(SAVED_CLAIM_TYPE, undefined);
    // #8622 set by public websites accordion anchor ID
    cy.get('a[href*="/decision-reviews/higher-level-review/#8622"]').should(
      'exist',
    );
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
    cy.get('a[href*="disability/file-an-appeal"]').should('exist');
    cy.checkFormChange({
      label: 'For what type of claim are you requesting a Higher-Level Review?',
      value: 'compensation',
    });

    cy.get('[type="radio"][value="legacy-yes"]').check(checkOpt);
    // download form link
    cy.get('a[href*="www.vba.va.gov/pubs/forms/VBA-20-0996-ARE.pdf"]').should(
      'exist',
    );
    // supplemental claim link
    cy.get('a[href*="/decision-reviews/supplemental-claim"]').should('exist');
    cy.checkFormChange({
      label: 'Is this claim going through the legacy appeals process?',
      value: 'legacy-yes',
    });
    cy.checkFormAlert('legacy appeals process');
    cy.axeCheck();
  });

  // start form flow
  it('should show legacy appeals question & alert', () => {
    const h1Text = 'Request a Higher-Level Review';
    // starts with focus on breadcrumb
    cy.focused().should('have.attr', 'id', 'va-breadcrumbs-list');
    cy.get('h1').should('have.text', h1Text);

    cy.get('[type="radio"][value="compensation"]').check(checkOpt);
    cy.checkStorage(SAVED_CLAIM_TYPE, 'compensation');
    cy.checkFormChange({
      label: 'For what type of claim are you requesting a Higher-Level Review?',
      value: 'compensation',
    });

    cy.get('a[href*="disability/file-an-appeal"]').should('exist');
    cy.get('[type="radio"][value="legacy-no"]').check(checkOpt);
    // learn more link
    cy.get('a[href*="/decision-reviews/higher-level-review/"]').should('exist');
    cy.checkFormChange({
      label: 'Is this claim going through the legacy appeals process?',
      value: 'legacy-no',
    });
    cy.axeCheck();

    // start form
    const h1Addition = ' with VA Form 20-0996';
    cy.findAllByText(/higher-level review online/i, { selector: 'button' })
      .first()
      .click();
    // title changes & gets focus
    cy.get('h1').should('have.text', h1Text + h1Addition);
    cy.focused().should('have.text', h1Text + h1Addition);
    cy.checkStorage(WIZARD_STATUS, 'complete');
    cy.axeCheck();
  });
});
