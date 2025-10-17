import Timeouts from 'platform/testing/e2e/timeouts';
import benefitsData from '../fixtures/mocks/benefitsData.json';
import data from '../fixtures/data/calculator-constants.json';

// Read inside Shadow DOM for this spec
Cypress.config('includeShadowDom', true);

describe('CH31 Your eligibility and benefits', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('GET', '**/v1/gi/calculator_constants*', {
      statusCode: 200,
      body: data,
    });

    cy.intercept('GET', '**/data/cms/*.json', { statusCode: 200 }).as('cms');

    cy.intercept('GET', '**/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [{ name: 'vre_eligibility_status_updates', value: true }],
      },
    }).as('featureToggles');

    cy.intercept('GET', '**/vre/v0/ch31_eligibility_status*', {
      statusCode: 200,
      body: benefitsData,
    }).as('enrollmentData');
  });

  it('renders eligibility criteria, alert, and benefits summary from payload (Option A hidden-content assertion)', () => {
    cy.visit('/careers-employment/your-vre-eligibility');

    cy.wait('@featureToggles', { timeout: 20000 });
    cy.wait('@enrollmentData', { timeout: 20000 });
    cy.wait('@cms', { timeout: 20000 });

    cy.contains('h1', /your vr&e eligibility and benefits/i, {
      timeout: Timeouts.slow,
    }).should('be.visible');

    cy.injectAxeThenAxeCheck();

    cy.contains(/you meet the basic eligibility criteria/i).should(
      'be.visible',
    );

    cy.contains(/character of discharge:\s*honorable/i).should('be.visible');
    cy.contains(/\b50%\b/).should('be.visible');

    cy.window().then(win =>
      win.customElements.whenDefined('va-additional-info'),
    );
    cy.get('va-additional-info[trigger="SCD details"]', { timeout: 10000 })
      .should('exist')
      .should('have.class', 'hydrated')
      .invoke('text')
      .then(txt => {
        const normalized = txt.replace(/\s+/g, ' ');
        expect(normalized).to.match(/7908 - Acromegaly - 50%/i);
      });

    cy.contains(/initial rating notification date/i).should('be.visible');
    cy.contains(/eligibility termination date/i).should('be.visible');

    cy.contains(/total months of entitlement/i).should('be.visible');
    cy.contains(/\b48 months,\s*0 days\b/i).should('be.visible'); // max
    cy.contains(/months of entitlement you have used/i).should('be.visible');
    cy.contains(/\b0 months,\s*0 days\b/i).should('be.visible'); // used
    cy.contains(/potential months of remaining entitlement/i).should(
      'be.visible',
    );
    cy.contains(/\b48 months,\s*0 days\b/i).should('be.visible'); // remaining
  });

  it('verifies the intercepted payload shape for key fields (API contract)', () => {
    cy.visit('/careers-employment/your-vre-eligibility');

    cy.wait('@enrollmentData', { timeout: 20000 }).then(({ response }) => {
      const attrs = response?.body?.data?.attributes;

      expect(attrs?.resEligibilityRecommendation).to.eq('Eligible');
      expect(attrs?.disabilityRating?.combinedScd).to.eq(50);
      expect(attrs?.disabilityRating?.scdDetails?.[0]?.code).to.eq('7908');
      expect(attrs?.disabilityRating?.scdDetails?.[0]?.name).to.eq(
        'Acromegaly',
      );
      expect(attrs?.disabilityRating?.scdDetails?.[0]?.percentage).to.eq(50);

      expect(attrs?.entitlementDetails?.maxCh31Entitlement?.month).to.eq(48);
      expect(attrs?.entitlementDetails?.maxCh31Entitlement?.days).to.eq(0);
      expect(attrs?.entitlementDetails?.ch31EntitlementRemaining?.month).to.eq(
        48,
      );
      expect(attrs?.entitlementDetails?.ch31EntitlementRemaining?.days).to.eq(
        0,
      );
      expect(attrs?.entitlementDetails?.entitlementUsed?.month).to.eq(0);
      expect(attrs?.entitlementDetails?.entitlementUsed?.days).to.eq(0);
    });
  });
});
