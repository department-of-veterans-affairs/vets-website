/* eslint-disable cypress/no-unnecessary-waiting */
import 'cypress-axe';
import user from './fixtures/mocks/user.json';
import prefillTransformer from './fixtures/data/transformed/prefill-transformer.json';
import { setFeatureToggles } from './intercepts/features-toggles';

const fillTextWebComponent = (fieldName, value) => {
  cy.fillVaTextInput(`root_${fieldName}`, value);
};
const data = prefillTransformer.formData;
Cypress.Commands.add('loginArpUser', () => {
  cy.intercept('GET', '/accredited_representative_portal/v0/user', {
    statusCode: 200,
    body: user,
  }).as('fetchUser');
});

Cypress.Commands.add('denyArpUser', () => {
  cy.intercept('GET', '/accredited_representative_portal/v0/user', {
    statusCode: 401,
    body: user,
  }).as('denyUser');
});

const vamcUser = {
  data: {
    nodeQuery: {
      count: 0,
      entities: [],
    },
  },
};

const setUpIntercepts = featureToggles => {
  cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
  cy.intercept('GET', '/accredited_representative_portal/v0/intent_to_file', {
    statusCode: 404,
    body: {
      errors: [
        {
          title: 'Resource not found',
          detail: "No active 'C' intent to file found.",
        },
      ],
    },
  }).as('itfCheck');

  setFeatureToggles(featureToggles);
};

describe('Intent to file submission', () => {
  describe('Authorized VSO Rep', () => {
    beforeEach(() => {
      cy.loginArpUser();
      setUpIntercepts({
        isAppEnabled: true,
      });
      cy.intercept(
        'POST',
        '/accredited_representative_portal/v0/intent_to_file',
        {},
      );
    });

    it('sets sessionStorage flag when "Start the submission" is clicked', () => {
      cy.visit(
        '/representative/representative-form-upload/submit-va-form-21-0966',
      );

      cy.get('a[href="#start"]')
        .contains('Start the submission')
        .click();

      cy.window().then(win => {
        const flag = win.sessionStorage.getItem('formIncompleteARP');
        expect(flag).to.equal('true');
      });
      cy.injectAxe();
      cy.axeCheck();
    });

    describe('submit itf', () => {
      it('allows veteran claimant submission', () => {
        cy.visit(
          `/representative/representative-form-upload/submit-va-form-21-0966`,
        );
        cy.injectAxe();
        cy.axeCheck();
        cy.location('pathname').should(
          'eq',
          '/representative/representative-form-upload/submit-va-form-21-0966/introduction',
        );

        cy.get('a[href="#start"]')
          .contains('Start the submission')
          .click();

        cy.injectAxe();
        cy.axeCheck();

        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-21-0966/claimant-background`,
        );

        cy.findByLabelText(/^The claimant is the Veteran$/).click();
        cy.findByRole('button', { name: /^Continue$/ }).click();
        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-21-0966/veteran-information`,
        );

        cy.axeCheck();

        fillTextWebComponent(
          'veteranFullName_first',
          data.veteranFullName.first,
        );
        fillTextWebComponent('veteranFullName_last', data.veteranFullName.last);
        cy.get('input[name="root_veteranSsn"]').type(data.ssn);

        cy.get('select[name="root_veteranDateOfBirthMonth"]').select(
          'February',
        );
        cy.get('input[name="root_veteranDateOfBirthDay"]').type('15');
        cy.get('input[name="root_veteranDateOfBirthYear"]').type('1990');
        cy.axeCheck();
        cy.get('input[name="root_vaFileNumber"]').type('123456789');
        cy.get('input[name="root_benefitType"][value="compensation"]').click();

        cy.findByRole('button', { name: /^Continue$/ }).click();

        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-21-0966/get-itf-status`,
        );
        cy.wait(1000);

        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-21-0966/review-and-submit`,
        );

        cy.get("va-button[text='Submit form']").click();
        cy.axeCheck();
        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-21-0966/confirmation`,
        );
        cy.get('va-alert').should(
          'contain',
          'You submitted the form and supporting evidence',
        );
      });
    });

    it('allows non-veteran claimant submission', () => {
      cy.visit(
        `/representative/representative-form-upload/submit-va-form-21-0966/`,
      );
      cy.injectAxe();
      cy.axeCheck();
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/submit-va-form-21-0966/introduction',
      );

      cy.get('a[href="#start"]')
        .contains('Start the submission')
        .click();

      cy.injectAxe();
      cy.axeCheck();

      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/submit-va-form-21-0966/claimant-background',
      );

      cy.findByLabelText(
        /^The claimant is a survivor or dependent of the Veteran$/,
      ).click();
      cy.findByRole('button', { name: /^Continue$/ }).click();
      cy.axeCheck();
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/submit-va-form-21-0966/claimant-information',
      );

      fillTextWebComponent(
        'claimantFullName_first',
        data.claimantFullName.first,
      );
      fillTextWebComponent('claimantFullName_last', data.claimantFullName.last);
      cy.get('input[name="root_claimantSsn"]').type(data.claimantSsn);
      cy.get('select[name="root_claimantDateOfBirthMonth"]').select(
        'September',
      );
      cy.get('input[name="root_claimantDateOfBirthDay"]').type('21');
      cy.get('input[name="root_claimantDateOfBirthYear"]').type('2009');
      fillTextWebComponent('veteranFullName_first', data.veteranFullName.first);
      fillTextWebComponent('veteranFullName_last', data.veteranFullName.last);
      cy.get('input[name="root_veteranSsn"]').type(data.ssn);
      cy.get('input[name="root_vaFileNumber"]').type('123456789');
      cy.get('input[name="root_selectBenefits_SURVIVOR"]').click();
      cy.axeCheck();
      cy.findByRole('button', { name: /^Continue$/ }).click();
      cy.axeCheck();

      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/submit-va-form-21-0966/get-itf-status',
      );

      cy.wait(1000);

      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/submit-va-form-21-0966/review-and-submit',
      );

      cy.get("va-button[text='Submit form']").click();
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/submit-va-form-21-0966/confirmation',
      );
      cy.get('va-alert').should(
        'contain',
        'You submitted the form and supporting evidence',
      );
    });
  });

  describe('Transient server error (Service Unavailable)', () => {
    beforeEach(() => {
      cy.loginArpUser();
      setUpIntercepts({
        isAppEnabled: true,
      });
      cy.intercept(
        'POST',
        '/accredited_representative_portal/v0/intent_to_file',
        {
          statusCode: 503,
        },
      );
    });

    it('shows the appropriate error message', () => {
      cy.visit(
        `/representative/representative-form-upload/submit-va-form-21-0966`,
      );

      cy.injectAxe();
      cy.axeCheck();

      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/submit-va-form-21-0966/introduction',
      );

      cy.get('a[href="#start"]')
        .contains('Start the submission')
        .click();

      cy.injectAxe();
      cy.axeCheck();

      cy.location('pathname').should(
        'eq',
        `/representative/representative-form-upload/submit-va-form-21-0966/claimant-background`,
      );

      cy.findByLabelText(/^The claimant is the Veteran$/).click();
      cy.findByRole('button', { name: /^Continue$/ }).click();
      cy.location('pathname').should(
        'eq',
        `/representative/representative-form-upload/submit-va-form-21-0966/veteran-information`,
      );

      cy.axeCheck();

      fillTextWebComponent('veteranFullName_first', data.veteranFullName.first);
      fillTextWebComponent('veteranFullName_last', data.veteranFullName.last);
      cy.get('input[name="root_veteranSsn"]').type(data.ssn);

      cy.get('select[name="root_veteranDateOfBirthMonth"]').select('February');
      cy.get('input[name="root_veteranDateOfBirthDay"]').type('15');
      cy.get('input[name="root_veteranDateOfBirthYear"]').type('1990');
      cy.axeCheck();
      cy.get('input[name="root_vaFileNumber"]').type('123456789');
      cy.get('input[name="root_benefitType"][value="compensation"]').click();

      cy.findByRole('button', { name: /^Continue$/ }).click();

      cy.location('pathname').should(
        'eq',
        `/representative/representative-form-upload/submit-va-form-21-0966/get-itf-status`,
      );
      cy.wait(1000);

      cy.location('pathname').should(
        'eq',
        `/representative/representative-form-upload/submit-va-form-21-0966/review-and-submit`,
      );

      cy.get("va-button[text='Submit form']").click();

      cy.location('pathname').should(
        'eq',
        `/representative/representative-form-upload/submit-va-form-21-0966/review-and-submit`,
      );
      cy.get('#submission-error').contains(
        'The form couldn’t be submitted because of high system traffic',
      );
    });
  });

  describe('Unauthorized VSO Rep', () => {
    it('should not allow access to the ITF page', () => {
      cy.denyArpUser();
      setUpIntercepts({
        isAppEnabled: true,
      });
      cy.visit(
        '/representative/representative-form-upload/submit-va-form-21-0966/',
      );
      cy.injectAxe();
      cy.axeCheck();
      cy.location('pathname').should('eq', '/sign-in/');
    });
  });
});
