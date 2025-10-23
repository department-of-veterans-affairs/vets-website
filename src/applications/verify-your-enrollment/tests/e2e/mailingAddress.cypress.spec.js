import { mockUserWithOutIDME } from './login';

describe('Contact information', () => {
  beforeEach(() => {
    cy.intercept('GET', '/vye/v1', { statusCode: 200 }).as('mockVye');
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          { name: 'toggle_vye_application', value: true },
          { name: 'toggle_vye_address_direct_deposit_forms', value: true },
          { name: 'mgib_verifications_maintenance', value: false },
        ],
      },
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.login(mockUserWithOutIDME);
    cy.visit('/education/verify-school-enrollment/mgib-enrollments/', {
      onBeforeLoad(win) {
        cy.stub(win.performance, 'getEntriesByType').returns([
          { type: 'reload' },
        ]);
      },
    });
    cy.wait('@mockUser');
  });
  const fillForm = () => {
    cy.wait('@mockVye');
    cy.get(
      '[href="/education/verify-school-enrollment/mgib-enrollments/benefits-profile/"]',
    )
      .first()
      .click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get('input[name="root_addressLine1"]').type('322 26th ave apt 1');
    cy.get('input[name="root_city"]').type('San Francisco');
    cy.get('select[name="root_stateCode"]')
      .last()
      .select('California');
    cy.get('input[name="root_zipCode"]').type('94121');
  };

  it('should navigate to benefits-profile when "Manage your Montgomery GI Bill benefits information" link is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-school-enrollment/mgib-enrollments/benefits-profile/"]',
    ).should('exist');
    cy.get(
      '[href="/education/verify-school-enrollment/mgib-enrollments/benefits-profile/"]',
    )
      .first()
      .click();
    cy.url().should('include', '/benefits-profile');
    cy.get(
      '[class="vads-u-line-height--4 vads-u-font-size--base vads-u-font-family--sans vads-u-margin-y--0"]',
    ).should('contain', 'Mailing address');
  });
  it('Should expand the form when Edit button is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-school-enrollment/mgib-enrollments/benefits-profile/"]',
    )
      .first()
      .click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get(
      '[class="vads-u-margin-y--2 vads-u-line-height--4 vads-u-font-size--base vads-u-font-family--sans"]',
    ).should('contain', 'Change mailing address');
  });
  it('Should shows error if one requried field is missing', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-school-enrollment/mgib-enrollments/benefits-profile/"]',
    )
      .first()
      .click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get(
      '[aria-label="save your mailing address for GI Bill benefits"]',
    ).click();
    cy.get('[class="usa-error-message"]').should('contain', 'City is required');
    cy.get('[class="usa-error-message"]').should(
      'contain',
      'State is required',
    );
  });
  it('should send address after save button is clicked', () => {
    cy.injectAxeThenAxeCheck();
    fillForm();
    cy.get(
      '[aria-label="save your mailing address for GI Bill benefits"]',
    ).click();
  });
  it('should close address form when cancel button is clicked without editing the form', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-school-enrollment/mgib-enrollments/benefits-profile/"]',
    )
      .first()
      .click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get(
      '[label="cancel updating your mailing address for GI Bill benefits"]',
    ).click();
    cy.get(
      '[class="vads-u-line-height--4 vads-u-font-size--base vads-u-font-family--sans vads-u-margin-y--0"]',
    ).should('contain', 'Mailing address');
  });
  it('should show warning alert if user hits cancel after editing form', () => {
    cy.injectAxeThenAxeCheck();
    fillForm();
    cy.get(
      '[label="cancel updating your mailing address for GI Bill benefits"]',
    ).click();
    cy.get('h2[class="usa-modal__heading va-modal-alert-title"]').should(
      'contain',
      'Are you sure?',
    );
  });
  it('should show warning alert if user hits cancel after editing form and it should go back to the form when user clicks "No, go back to editing" button', () => {
    cy.injectAxeThenAxeCheck();
    fillForm();
    cy.get(
      '[label="cancel updating your mailing address for GI Bill benefits"]',
    ).click();
    cy.get('h2[class="usa-modal__heading va-modal-alert-title"]').should(
      'contain',
      'Are you sure?',
    );
    cy.get('va-button')
      .last()
      .click({ force: true });
    cy.contains(
      'I live on a United States military base outside of the U.S.',
    ).should('be.visible');
  });
  it('should show warning alert if user hits cancel after editing form and it should close alert and form when user clicks Yes, cancel my changes', () => {
    cy.injectAxeThenAxeCheck();
    fillForm();
    cy.get(
      '[label="cancel updating your mailing address for GI Bill benefits"]',
    ).click();
    cy.get('h2[class="usa-modal__heading va-modal-alert-title"]').should(
      'contain',
      'Are you sure?',
    );
    cy.get('va-button')
      .first()
      .click();
    cy.get(
      '[class="vads-u-line-height--4 vads-u-font-size--base vads-u-font-family--sans vads-u-margin-y--0"]',
    ).should('contain', 'Mailing address');
  });
});
