import { daysFromToday } from '../utils/dates/formatting';

import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import {
  DISABILITY_526_V2_ROOT_URL,
  SAVED_SEPARATION_DATE,
  FORM_STATUS_BDD,
  WIZARD_STATUS,
  OMB_CONTROL,
} from '../constants';

// Date saved to window.sessionStorage includes leading zeros
const mockDate = daysFromToday(120);

const checkOpt = {
  waitForAnimations: true,
};

Cypress.Commands.add('checkStorage', (key, expectedValue) => {
  cy.window()
    .its(`window.sessionStorage.${key}`)
    .should('eq', expectedValue);
});

Cypress.Commands.add(
  'checkFormChange',
  ({ type = 'form-radio-buttons', label, value }) => {
    cy.window().then(win => {
      const data = win.dataLayer.find(
        obj => obj?.['form-field-value'] === value,
      );
      assert.equal(data?.event || '', 'howToWizard-formChange');
      assert.equal(data['form-field-type'], type);
      assert.equal(data['form-field-label'], label);
      assert.equal(data['form-field-value'], value);
    });
  },
);

Cypress.Commands.add('checkFormAlert', value => {
  cy.window().then(win => {
    const data = win.dataLayer.find(obj =>
      (obj?.event || '').includes('howToWizard-alert-displayed'),
    );
    assert.equal(data?.event || '', 'howToWizard-alert-displayed');
    expect(data['reason-for-alert']).to.contain(value);
  });
});

Cypress.Commands.add('checkCallToAction', () => {
  cy.window().then(win => {
    const data = win.dataLayer.find(obj =>
      (obj?.event || '').includes('cta-displayed'),
    );
    assert.equal(data.event, 'howToWizard-cta-displayed');
  });
});

describe('526 wizard', () => {
  beforeEach(() => {
    window.dataLayer = [];
    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);
    window.sessionStorage.removeItem(WIZARD_STATUS);
    window.sessionStorage.removeItem(FORM_STATUS_BDD);
    window.sessionStorage.removeItem(SAVED_SEPARATION_DATE);
    cy.visit(`${DISABILITY_526_V2_ROOT_URL}/start`);
    cy.injectAxe();
  });

  it('should show the form wizard', () => {
    cy.url().should('include', `${DISABILITY_526_V2_ROOT_URL}/start`);
    cy.get('h1[data-testid="form-title"]').should(
      'have.text',
      'File for disability compensation',
    );
    cy.axeCheck();
  });

  // disagreeing with a decision flow
  it('should show disagreeing with a decision questions & alert', () => {
    cy.get('va-radio-option[value="appeals"]').click(checkOpt);
    cy.checkFormChange({
      label: 'Are you on active duty right now?',
      value: 'no-appeals',
    });

    cy.get('va-radio-option[value="disagree-file-claim"]').click(checkOpt);
    cy.checkFormChange({
      label:
        'Are you filing a new claim or are you disagreeing with a VA decision on an earlier claim?',
      value: 'disagreeing',
    });
    cy.checkFormAlert('disagree with VA decision, needs a decision review');
    cy.axeCheck();
  });

  // BDD flow
  it('should show BDD questions & start button', () => {
    cy.get('va-radio-option[value="bdd"]').click(checkOpt);
    cy.checkFormChange({
      label: 'Are you on active duty right now?',
      value: 'yes-bdd',
    });

    cy.get('va-date').should('exist');
    cy.fillDate('discharge-date', mockDate);

    cy.checkStorage(FORM_STATUS_BDD, 'true');
    cy.checkStorage(SAVED_SEPARATION_DATE, mockDate);
    cy.checkFormChange({
      type: 'usa-date-of-birth',
      label:
        'What’s the date or anticipated date of your release from active duty?',
      value: mockDate,
    });
    cy.checkCallToAction();
    cy.axeCheck();
  });

  // start form flow
  it('should start all-claims/original claims flow', () => {
    const h1Text = 'File for disability compensation';
    // starts with focus on breadcrumb
    // cy.get('va-breadcrumbs').first().should('have.focus'); // not working?
    cy.get('h1[data-testid="form-title"]').should('have.text', h1Text);

    cy.get('va-radio-option[value="appeals"]').click(checkOpt);
    cy.checkFormChange({
      label: 'Are you on active duty right now?',
      value: 'no-appeals',
    });

    cy.get('va-radio-option[value="file-claim"]').click(checkOpt);
    cy.checkStorage(FORM_STATUS_BDD, undefined);
    cy.checkStorage(SAVED_SEPARATION_DATE, undefined);
    // learn more link
    cy.get('a[href*="disability/how-to-file-claim/"]').should('exist');
    cy.checkFormChange({
      label:
        'Are you filing a new claim or are you disagreeing with a VA decision on an earlier claim?',
      value: 'new-worse',
    });
    cy.axeCheck();

    // start form
    const h1Addition = ' with VA Form 21-526EZ';
    cy.findAllByText(/disability claim online/i, { selector: 'a' })
      .first()
      .click();
    // title changes & gets focus
    cy.get('h1[data-testid="form-title"]').should(
      'have.text',
      h1Text + h1Addition,
    );
    // verify that the h1 title changes, receives focus for accessibility
    cy.get('h1[data-testid="form-title"]')
      .should('have.text', h1Text + h1Addition)
      .and('have.focus');
    cy.checkStorage(WIZARD_STATUS, 'complete');
    cy.location('pathname').should(
      'eq',
      `${DISABILITY_526_V2_ROOT_URL}/introduction`,
    );

    // omb info
    cy.get('va-omb-info').contains(OMB_CONTROL);

    cy.injectAxe();
    cy.axeCheck();
  });
});
