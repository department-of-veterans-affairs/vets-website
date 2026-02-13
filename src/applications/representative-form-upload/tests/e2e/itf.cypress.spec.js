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

Cypress.Commands.add('fillVeteranDetail', (fillBirthday = true) => {
  fillTextWebComponent(
    'veteranSubPage_veteranFullName_first',
    data.veteranFullName.first,
  );
  fillTextWebComponent(
    'veteranSubPage_veteranFullName_last',
    data.veteranFullName.last,
  );
  cy.get('input[name="root_veteranSubPage_veteranSsn"]').type(data.ssn);

  if (fillBirthday) {
    cy.get('select[name="root_veteranSubPage_veteranDateOfBirthMonth"]').select(
      'February',
    );
    cy.get('input[name="root_veteranSubPage_veteranDateOfBirthDay"]').type(
      '15',
    );
    cy.get('input[name="root_veteranSubPage_veteranDateOfBirthYear"]').type(
      '1990',
    );
  }
  cy.axeCheck();
  cy.get('input[name="root_veteranSubPage_vaFileNumber"]').type('123456789');
});

Cypress.Commands.add('fillClaimantDetail', () => {
  fillTextWebComponent(
    'claimantSubPage_claimantFullName_first',
    data.claimantFullName.first,
  );
  fillTextWebComponent(
    'claimantSubPage_claimantFullName_last',
    data.claimantFullName.last,
  );
  cy.get('input[name="root_claimantSubPage_claimantSsn"]').type(
    data.claimantSsn,
  );
  cy.get('select[name="root_claimantSubPage_claimantDateOfBirthMonth"]').select(
    'September',
  );
  cy.get('input[name="root_claimantSubPage_claimantDateOfBirthDay"]').type(
    '21',
  );
  cy.get('input[name="root_claimantSubPage_claimantDateOfBirthYear"]').type(
    '2009',
  );
});

Cypress.Commands.add('mockItfCheck', () => {
  // No ITF exists, allowing user to continue. Delay 500ms so that loading
  // screen can be checked.
  cy.intercept(
    {
      method: 'GET',
      url: '/accredited_representative_portal/v0/intent_to_file**',
    },
    req => {
      req.reply({
        statusCode: 404,
        body: {
          errors: [
            {
              title: 'Resource not found',
              detail: "No active 'C' intent to file found.",
              code: '404',
              status: '404',
            },
          ],
        },
        delay: 500,
      });
    },
  ).as('itfCheck');
});

Cypress.Commands.add('mockFoundItfCheck', () => {
  // Mock existing ITF. Delay 500ms so that loading screen can be checked.
  cy.intercept(
    {
      method: 'GET',
      url: '/accredited_representative_portal/v0/intent_to_file**',
    },
    req => {
      req.reply({
        statusCode: 200,
        body: {
          data: {
            id: '193685',
            type: 'intent_to_file',
            attributes: {
              creationDate: '2021-03-16T19:15:21.000-05:00',
              expirationDate: '2022-03-16T19:15:20.000-05:00',
              type: 'compensation',
              status: 'active',
            },
          },
        },
        delay: 500,
      });
    },
  ).as('itfCheck');
});

Cypress.Commands.add('mockMissingPoaItfCheck', () => {
  // Mock missing POA for veteran. Delay 500ms so that loading screen can be checked.
  cy.intercept(
    {
      method: 'GET',
      url: '/accredited_representative_portal/v0/intent_to_file**',
    },
    req => {
      req.reply({
        body: {
          errors: ['not allowed to IntentToFile'],
        },
        statusCode: 403,
        delay: 500,
      });
    },
  ).as('itfCheck');
});

Cypress.Commands.add('mockMissingVeteranItfCheck', () => {
  // Mock missing veteran. Delay 500ms so that loading screen can be checked.
  cy.intercept(
    {
      method: 'GET',
      url: '/accredited_representative_portal/v0/intent_to_file**',
    },
    req => {
      req.reply({
        body: {
          errors: [
            { title: 'Bad request', detail: 'Record not found', code: '400' },
          ],
        },
        statusCode: 400,
        delay: 500,
      });
    },
  ).as('itfCheck');
});

Cypress.Commands.add('mockFailedItfCheck', () => {
  // Mock itf check failure. Delay 500ms so that loading screen can be checked.
  cy.intercept(
    {
      method: 'GET',
      url: '/accredited_representative_portal/v0/intent_to_file**',
    },
    req => {
      req.reply({
        body: {
          errors: ['unknown error'],
        },
        statusCode: 500,
        delay: 500,
      });
    },
  ).as('itfCheck');
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
  setFeatureToggles(featureToggles);
};

describe('Intent to file submission', () => {
  describe('Authorized VSO Rep', () => {
    beforeEach(() => {
      cy.loginArpUser();
      setUpIntercepts({
        isAppEnabled: true,
      });
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

    describe('successfully submit itf', () => {
      beforeEach(() => {
        cy.mockItfCheck();
        // Mock form submission
        cy.intercept(
          'POST',
          '/accredited_representative_portal/v0/intent_to_file',
          data,
        );
      });

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

        cy.fillVeteranDetail();
        cy.get('input[name="root_benefitType"][value="compensation"]').click();

        cy.findByRole('button', { name: /^Continue$/ }).click();

        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-21-0966/get-itf-status`,
        );
        cy.wait('@itfCheck');

        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-21-0966/review-and-submit`,
        );
        cy.get("button[data-testid='expand-all-accordions']").click();

        // hide the edit button that could cause issues with submission
        cy.get("va-button[text='Edit']").should('be.hidden');

        cy.get("va-button[text='Submit form']").click();
        cy.axeCheck();
        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-21-0966/confirmation`,
        );
        cy.get('va-alert').should('contain', 'We recorded the intent to file');
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

        cy.fillClaimantDetail();
        cy.fillVeteranDetail();
        cy.get('input[name="root_selectBenefits_SURVIVOR"]').click();
        cy.axeCheck();
        cy.findByRole('button', { name: /^Continue$/ }).click();
        cy.axeCheck();

        cy.location('pathname').should(
          'eq',
          '/representative/representative-form-upload/submit-va-form-21-0966/get-itf-status',
        );

        cy.wait('@itfCheck');

        cy.location('pathname').should(
          'eq',
          '/representative/representative-form-upload/submit-va-form-21-0966/review-and-submit',
        );

        // hide the edit button that could cause issues with submission
        cy.get("va-button[text='Edit']").should('be.hidden');

        cy.get("va-button[text='Submit form']").click();
        cy.location('pathname').should(
          'eq',
          '/representative/representative-form-upload/submit-va-form-21-0966/confirmation',
        );
        cy.get('va-alert').should('contain', 'We recorded the intent to file');
      });
    });

    describe('Transient server error (Service Unavailable)', () => {
      beforeEach(() => {
        cy.mockItfCheck();
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

        cy.fillVeteranDetail();
        cy.get('input[name="root_benefitType"][value="compensation"]').click();

        cy.findByRole('button', { name: /^Continue$/ }).click();

        cy.location('pathname').should(
          'eq',
          '/representative/representative-form-upload/submit-va-form-21-0966/get-itf-status',
        );

        cy.wait('@itfCheck');

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

    describe('existing ITF', () => {
      beforeEach(() => {
        cy.mockFoundItfCheck();
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

        cy.fillVeteranDetail();
        cy.get('input[name="root_benefitType"][value="compensation"]').click();

        cy.findByRole('button', { name: /^Continue$/ }).click();

        cy.location('pathname').should(
          'eq',
          '/representative/representative-form-upload/submit-va-form-21-0966/get-itf-status',
        );

        cy.wait('@itfCheck');

        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-21-0966/existing-itf`,
        );
        cy.get('va-alert').should(
          'contain',
          'This claimant has an intent to file',
        );
      });
    });

    describe('veteran does not have representation established', () => {
      beforeEach(() => {
        cy.mockMissingPoaItfCheck();
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

        cy.fillVeteranDetail();
        cy.get('input[name="root_benefitType"][value="compensation"]').click();

        cy.findByRole('button', { name: /^Continue$/ }).click();

        cy.location('pathname').should(
          'eq',
          '/representative/representative-form-upload/submit-va-form-21-0966/get-itf-status',
        );

        cy.wait('@itfCheck');

        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-21-0966/intent-to-file-no-representation`,
        );
        cy.get('va-alert')
          .find('h2')
          .should('have.text', 'You don’t represent this claimant');
      });
    });

    describe('veteran does not exist in the system', () => {
      beforeEach(() => {
        cy.mockMissingVeteranItfCheck();
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

        cy.fillVeteranDetail();
        cy.get('input[name="root_benefitType"][value="compensation"]').click();

        cy.findByRole('button', { name: /^Continue$/ }).click();

        cy.location('pathname').should(
          'eq',
          '/representative/representative-form-upload/submit-va-form-21-0966/get-itf-status',
        );

        cy.wait('@itfCheck');

        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-21-0966/intent-to-file-no-representation`,
        );
        cy.get('va-alert')
          .find('h2')
          .should('have.text', 'You don’t represent this claimant');
      });
    });

    describe('representation/itf check fails', () => {
      beforeEach(() => {
        cy.mockFailedItfCheck();
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

        cy.fillVeteranDetail();
        cy.get('input[name="root_benefitType"][value="compensation"]').click();

        cy.findByRole('button', { name: /^Continue$/ }).click();

        cy.location('pathname').should(
          'eq',
          '/representative/representative-form-upload/submit-va-form-21-0966/get-itf-status',
        );

        cy.wait('@itfCheck');

        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-21-0966/intent-to-file-unknown`,
        );
        cy.get('va-alert')
          .find('h2')
          .should(
            'have.text',
            'We can’t confirm whether this claimant already has an intent to file',
          );
      });
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
