import 'cypress-axe';
import { setFeatureToggles } from './intercepts/feature-toggles';
import inProgressFormsResponse from './fixtures/mocks/in-progress-forms-response.json';

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

    cy.get('select[name="root_address_country"]').select('USA', {
      force: true,
    });
    cy.fillVaTextInput('root_address_street', '123 Main St');
    cy.fillVaTextInput('root_address_city', 'Springfield');
    cy.fillVaTextInput('root_address_postalCode', '12345');
    cy.get('select[name="root_address_state"]').select('NY', { force: true });
    cy.findByRole('button', { name: /^Continue$/i }).click();

    cy.get('va-text-input[name="root_email"]').should('be.visible');

    cy.get('va-telephone-input')
      .shadow()
      .find('input[type="tel"]')
      .should('be.visible')
      .click({ force: true });

    cy.get('va-telephone-input')
      .shadow()
      .find('input[type="tel"]')
      .should('not.be.disabled')
      .clear({ force: true, delay: 100 });

    cy.get('va-telephone-input')
      .shadow()
      .find('input[type="tel"]')
      .type('5551234567', { force: true });

    cy.fillVaTextInput('root_email', 'test@example.com');
    cy.findByRole('button', { name: /^Continue$/i }).click();

    cy.get('select[name="root_relationship"]').select('Friend', {
      force: true,
    });
    cy.findByRole('button', { name: /^Continue$/i }).click();
  },
);

Cypress.Commands.add(
  'seedUserWith21aSIP',
  (returnUrlRel = '/character-references') => {
    const nowSec = 4918241875; // Fixed timestamp: 2125-11-07 00:00:00 UTC
    cy.intercept('GET', '/accredited_representative_portal/v0/user', {
      statusCode: 200,
      headers: { 'cache-control': 'no-store' },
      body: {
        account: { accountUuid: '895e72d8-cadb-4929-93dd-a61a6b8c3f61' },
        profile: {
          firstName: 'HECTOR',
          lastName: 'J',
          verified: true,
          signIn: { serviceName: 'logingov' },
          loa: { current: 3, highest: 3 },
        },
        prefillsAvailable: [],
        inProgressForms: [
          {
            form: '21a',
            metadata: {
              version: 0,
              returnUrl: returnUrlRel,
              savedAt: nowSec * 1000,
              submission: {
                status: false,
                errorMessage: false,
                id: false,
                timestamp: false,
                hasAttemptedSubmit: false,
              },
              createdAt: nowSec - 3000,
              expiresAt: nowSec + 7 * 24 * 60 * 60,
              lastUpdated: nowSec,
              inProgressFormId: 3,
            },
            lastUpdated: nowSec,
          },
        ],
      },
    }).as('fetchUserWithSIP');
  },
);

Cypress.Commands.add(
  'stub21aFormDataExact',
  (returnUrlRel = '/character-references') => {
    const nowSec = 4918241875; // Fixed timestamp: 2125-11-07 00:00:00 UTC
    const nowMs = nowSec * 1000;

    cy.intercept(
      'GET',
      '**/accredited_representative_portal/v0/in_progress_forms/21a*',
      {
        statusCode: 200,
        body: {
          formData: {
            'view:characterReferencesMissingInformation': {},
            'view:hasCharacterReferences': false,
            fullName: {},
            placeOfBirth: { 'view:militaryBaseDescription': {} },
            phone: {},
            homeAddress: { 'view:militaryBaseDescription': {} },
            otherAddress: { 'view:militaryBaseDescription': {} },
            employmentActivities: {},
            convictionDetailsDocuments: [],
            convictionDetailsCertification: {},
            courtMartialedDetailsDocuments: [],
            courtMartialedDetailsCertification: {},
            underChargesDetailsDocuments: [],
            underChargesDetailsCertification: {},
            resignedFromEducationDetailsDocuments: [],
            resignedFromEducationDetailsCertification: {},
            withdrawnFromEducationDetailsDocuments: [],
            withdrawnFromEducationDetailsCertification: {},
            disciplinedForDishonestyDetailsDocuments: [],
            disciplinedForDishonestyDetailsCertification: {},
            resignedForDishonestyDetailsDocuments: [],
            resignedForDishonestyDetailsCertification: {},
            representativeForAgencyDetailsDocuments: [],
            representativeForAgencyDetailsCertification: {},
            reprimandedInAgencyDetailsDocuments: [],
            reprimandedInAgencyDetailsCertification: {},
            resignedFromAgencyDetailsDocuments: [],
            resignedFromAgencyDetailsCertification: {},
            appliedForVaAccreditationDetailsDocuments: [],
            appliedForVaAccreditationDetailsCertification: {},
            terminatedByVsorgDetailsDocuments: [],
            terminatedByVsorgDetailsCertification: {},
            conditionThatAffectsRepresentationDetailsDocuments: [],
            conditionThatAffectsRepresentationDetailsCertification: {},
            conditionThatAffectsExaminationDetailsDocuments: [],
            conditionThatAffectsExaminationDetailsCertification: {},
            characterReferences: [],
          },
          metadata: {
            version: 0,
            returnUrl: returnUrlRel,
            savedAt: nowMs,
            submission: {
              status: false,
              errorMessage: false,
              id: false,
              timestamp: false,
              hasAttemptedSubmit: false,
            },
            createdAt: nowSec - 3000,
            expiresAt: nowSec + 7 * 24 * 60 * 60,
            lastUpdated: nowSec,
            inProgressFormId: 3,
          },
        },
      },
    ).as('getInProgressForm');
  },
);

const baseUrl = '/representative/accreditation/attorney-claims-agent-form-21a/';
const introUrl = `${baseUrl}introduction`;
const characterReferencesSummaryUrl = `${baseUrl}character-references-summary`;
const supplementaryStatementsIntroUrl = `${baseUrl}supplementary-statements-intro`;

const vamcUser = { data: { nodeQuery: { count: 0, entities: [] } } };
const setUpIntercepts = (
  featureToggles = { isAppEnabled: true, isInPilot: true },
) => {
  cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
  setFeatureToggles(featureToggles);
};

describe('The 21A Character References Page', () => {
  beforeEach(() => {
    setUpIntercepts({
      isAppEnabled: true,
      isInPilot: true,
      isForm21Enabled: true,
    });

    cy.intercept(
      'PUT',
      '**/accredited_representative_portal/v0/in_progress_forms/21a*',
      inProgressFormsResponse,
    ).as('saveInProgressForm');

    // Seed resume + form data BEFORE visiting
    cy.seedUserWith21aSIP('/character-references');
    cy.stub21aFormDataExact('/character-references');
  });

  it('allows the user to move forward with 3 references', () => {
    cy.visit(introUrl);
    cy.injectAxe();
    cy.axeCheck();

    cy.contains('button', /^Continue your application$/).click({ force: true });
    cy.wait('@getInProgressForm');
    cy.findByRole('button', { name: /^Continue$/i }).click();

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
    cy.visit(introUrl);
    cy.injectAxe();
    cy.axeCheck();

    cy.contains('button', /^Continue your application$/).click({ force: true });
    cy.wait('@getInProgressForm');
    cy.findByRole('button', { name: /^Continue$/i }).click();

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
    cy.visit(introUrl);
    cy.injectAxe();
    cy.axeCheck();

    cy.contains('button', /^Continue your application$/).click({ force: true });
    cy.wait('@getInProgressForm');
    cy.findByRole('button', { name: /^Continue$/i }).click();

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
    cy.visit(introUrl);
    cy.injectAxe();
    cy.axeCheck();

    cy.contains('button', /^Continue your application$/).click({ force: true });
    cy.wait('@getInProgressForm');
    cy.findByRole('button', { name: /^Continue$/i }).click();

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
