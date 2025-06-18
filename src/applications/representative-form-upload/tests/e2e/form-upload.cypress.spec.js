import user from './fixtures/mocks/user.json';
import prefillTransformer from './fixtures/data/transformed/prefill-transformer.json';
import mockScannedFormUpload from './fixtures/mocks/scanned-form-upload.json';
import { setFeatureToggles } from './intercepts/features-toggles';

const mockSubmit = JSON.stringify({
  // eslint-disable-next-line camelcase
  confirmation_number: '48fac28c-b332-4549-a45b-3423297111f4',
});

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
  setFeatureToggles(featureToggles);
};

const uploadImgPath =
  'src/applications/representative-form-upload/tests/e2e/fixtures/data/vba_21_686c.pdf';

describe('Representative Form Upload', () => {
  describe('Authorized VSO Rep', () => {
    beforeEach(() => {
      cy.loginArpUser();
      setUpIntercepts({
        isAppEnabled: true,
        isInPilot: true,
      });
      cy.intercept(
        'POST',
        '/accredited_representative_portal/v0/representative_form_upload',
        mockScannedFormUpload,
      );
      cy.intercept(
        'POST',
        '/accredited_representative_portal/v0/submit_representative_form',
        mockSubmit,
      );
    });

    it('allows veteran claimant submission', () => {
      cy.visit('/representative/representative-form-upload/21-686c');
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/21-686c/introduction',
      );

      cy.get('a[href="#start"]')
        .contains('Start form')
        .click();

      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/21-686c/is-veteran',
      );

      cy.findByLabelText(/^The claimant is the Veteran$/).click();
      cy.findByRole('button', { name: /^Continue$/ }).click();

      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/21-686c/veteran-information',
      );

      fillTextWebComponent('veteranFullName_first', data.veteranFullName.first);
      fillTextWebComponent('veteranFullName_last', data.veteranFullName.last);
      fillTextWebComponent('address_postalCode', data.address.postalCode);

      cy.get('select[name="root_veteranDateOfBirthMonth"]').select('February');
      cy.get('input[name="root_veteranDateOfBirthDay"]').type('15');
      cy.get('input[name="root_veteranDateOfBirthYear"]').type('1990');

      cy.findByRole('button', { name: /^Continue$/ }).click();

      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/21-686c/upload',
      );

      cy.get('va-file-input')
        .shadow()
        .find('input')
        .selectFile(uploadImgPath, { force: true });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);

      cy.findByRole('button', { name: /^Continue$/ }).click();

      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/21-686c/review-and-submit',
      );

      cy.findByText(/^Submit form/, { selector: 'button' })
        .last()
        .click();

      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/21-686c/confirmation',
      );
    });

    it('allows non-veteran claimant submission', () => {
      cy.visit('/representative/representative-form-upload/21-686c/');
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/21-686c/introduction',
      );
      cy.get('a[href="#start"]')
        .contains('Start form')
        .click();
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/21-686c/is-veteran',
      );
      cy.findByLabelText(
        /^The claimant is a survivor or dependent of the Veteran$/,
      ).click();
      cy.findByRole('button', { name: /^Continue$/ }).click();
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/21-686c/claimant-information',
      );
      fillTextWebComponent(
        'claimantFullName_first',
        data.claimantFullName.first,
      );
      fillTextWebComponent('claimantFullName_last', data.claimantFullName.last);

      fillTextWebComponent('veteranFullName_first', data.veteranFullName.first);
      fillTextWebComponent('veteranFullName_last', data.veteranFullName.last);
      fillTextWebComponent('address_postalCode', data.address.postalCode);

      cy.get('input[name="root_veteranDateOfBirth"]').select('1992-08-17');
      cy.fillVaTextInput(`root_email`, data.email);

      cy.findByRole('button', { name: /^Continue$/ }).click();
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/21-686c/upload',
      );
      cy.get('va-file-input')
        .shadow()
        .find('input')
        .selectFile(uploadImgPath, {
          force: true,
        });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.findByRole('button', { name: /^Continue$/ }).click();
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/21-686c/review-and-submit',
      );
      cy.findByText(/^Submit form/, { selector: 'button' })
        .last()
        .click();
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/21-686c/confirmation',
      );
    });
  });

  describe('Unauthorized VSO Rep', () => {
    it('should not allow access to the form upload page', () => {
      cy.denyArpUser();
      setUpIntercepts({
        isAppEnabled: true,
        isInPilot: true,
      });
      cy.visit('/representative/representative-form-upload/21-686c/');
      cy.location('pathname').should('eq', '/sign-in/');
    });
  });
});
