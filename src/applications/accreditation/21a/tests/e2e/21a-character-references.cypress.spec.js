import 'cypress-axe';
import user from './fixtures/mocks/user.json';
import { setFeatureToggles } from './intercepts/feature-toggles';
import inProgressFormsResponse from './fixtures/mocks/in-progress-forms-response.json';

Cypress.Commands.add('loginArpUser', () => {
  cy.intercept('GET', '/accredited_representative_portal/v0/user', {
    statusCode: 200,
    body: user,
  }).as('fetchUser');
});

Cypress.Commands.add('addNewCharacterReference', () => {
  cy.get('input[name="root_view:hasCharacterReferences"][value="Y"]').check({
    force: true,
  });

  cy.findByRole('button', { name: /^Continue$/ }).click();
});

Cypress.Commands.add('goToNextPage', () => {
  cy.get('input[name="root_view:hasCharacterReferences"][value="N"]').check({
    force: true,
  });
  cy.findByRole('button', { name: /^Continue$/ }).click();
});

Cypress.Commands.add(
  'createCharacterReference',
  (first = 'Harry', last = 'Potter') => {
    cy.fillVaTextInput('root_fullName_first', first);
    cy.fillVaTextInput('root_fullName_last', last);
    cy.findByRole('button', { name: /^Continue$/ }).click();

    cy.get('select[name="root_address_country"]').select('USA');
    cy.fillVaTextInput('root_address_street', '123 Main St');
    cy.fillVaTextInput('root_address_city', 'Springfield');
    cy.fillVaTextInput('root_address_postalCode', '12345');
    cy.get('select[name="root_address_state"]').select('NY');
    cy.findByRole('button', { name: /^Continue$/i }).click();

    cy.get('va-telephone-input').as('phoneField');
    cy.get('@phoneField')
      .shadow()
      .find('input[type="tel"]')
      .clear()
      .type('5551234567');
    cy.fillVaTextInput('root_email', 'test@example.com');
    cy.findByRole('button', { name: /^Continue$/i }).click();

    cy.get('select[name="root_relationship"]').select('Friend');
    cy.findByRole('button', { name: /^Continue$/i }).click();
  },
);

const baseUrl = '/representative/accreditation/attorney-claims-agent-form-21a/';
const characterReferencesUrl = `${baseUrl}character-references`;
const characterReferencesSummaryUrl = `${baseUrl}character-references-summary`;
const supplementaryStatementsIntroUrl = `${baseUrl}supplementary-statements-intro`;

const vamcUser = {
  data: {
    nodeQuery: {
      count: 0,
      entities: [],
    },
  },
};

const setUpIntercepts = (
  featureToggles = { isAppEnabled: true, isInPilot: true },
) => {
  cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
  setFeatureToggles(featureToggles);
};

describe('The 21A Character References Page', () => {
  beforeEach(() => {
    cy.loginArpUser();
    setUpIntercepts({
      isAppEnabled: true,
      isInPilot: true,
      isForm21Enabled: true,
    });
    cy.intercept(
      'PUT',
      '/accredited_representative_portal/v0/in_progress_forms/21a',
      inProgressFormsResponse,
    ).as('saveInProgressForm');
  });

  it('CHANGED NAME TO SEE IF UPDATES - allows the user to move forward with 3 references', () => {
    cy.visit(characterReferencesUrl);
    cy.location('pathname', { timeout: 1000 }).should(
      'eq',
      characterReferencesUrl,
    );

    cy.injectAxe();
    cy.axeCheck();

    cy.findByRole('button', { name: /^Continue$/ }).click();
    cy.createCharacterReference('Harry', 'Potter');
    cy.addNewCharacterReference();
    cy.createCharacterReference('Ron', 'Weasley');
    cy.addNewCharacterReference();
    cy.createCharacterReference('Hermione', 'Granger');
    cy.goToNextPage();
    cy.location('pathname', { timeout: 1000 }).should(
      'eq',
      supplementaryStatementsIntroUrl,
    );

    cy.injectAxe();
    cy.axeCheck();
  });

  it('allows the user to move forward with 4 references', () => {
    cy.visit(characterReferencesUrl);
    cy.location('pathname', { timeout: 1000 }).should(
      'eq',
      characterReferencesUrl,
    );

    cy.injectAxe();
    cy.axeCheck();

    cy.findByRole('button', { name: /^Continue$/ }).click();
    cy.createCharacterReference('Harry', 'Potter');
    cy.addNewCharacterReference();
    cy.createCharacterReference('Ron', 'Weasley');
    cy.addNewCharacterReference();
    cy.createCharacterReference('Hermione', 'Granger');
    cy.addNewCharacterReference();
    cy.createCharacterReference('Severus', 'Snape');
    cy.findByRole('button', { name: /^Continue$/i }).click();
    cy.location('pathname', { timeout: 1000 }).should(
      'eq',
      supplementaryStatementsIntroUrl,
    );

    cy.injectAxe();
    cy.axeCheck();
  });

  it('shows error if there are only 2 references', () => {
    cy.visit(characterReferencesUrl);
    cy.location('pathname', { timeout: 1000 }).should(
      'eq',
      characterReferencesUrl,
    );

    cy.injectAxe();
    cy.axeCheck();

    cy.findByRole('button', { name: /^Continue$/ }).click();
    cy.createCharacterReference('Harry', 'Potter');
    cy.addNewCharacterReference();
    cy.createCharacterReference('Ron', 'Weasley');
    cy.goToNextPage();
    cy.contains(
      'span.usa-error-message',
      'You must add at least 3 character references. You currently have 2.',
    ).should('be.visible');

    cy.injectAxe();
    cy.axeCheck();

    cy.location('pathname', { timeout: 1000 }).should(
      'eq',
      characterReferencesSummaryUrl,
    );
  });

  it('shows error if there is only 1 reference', () => {
    cy.visit(characterReferencesUrl);
    cy.location('pathname', { timeout: 1000 }).should(
      'eq',
      characterReferencesUrl,
    );

    cy.injectAxe();
    cy.axeCheck();

    cy.findByRole('button', { name: /^Continue$/ }).click();
    cy.createCharacterReference('Harry', 'Potter');
    cy.goToNextPage();

    cy.contains(
      'span.usa-error-message',
      'You must add at least 3 character references. You currently have 1.',
    ).should('be.visible');

    cy.injectAxe();
    cy.axeCheck();

    cy.location('pathname', { timeout: 1000 }).should(
      'eq',
      characterReferencesSummaryUrl,
    );
  });
});
