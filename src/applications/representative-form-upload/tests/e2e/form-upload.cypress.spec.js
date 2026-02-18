import 'cypress-axe';
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
const uploadImgDetails = {
  name: uploadImgPath,
  size: 2783621,
  password: false,
  additionalData: {},
};

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
        '/accredited_representative_portal/v0/upload_supporting_documents',
        mockScannedFormUpload,
      );
      cy.intercept(
        'POST',
        '/accredited_representative_portal/v0/submit_representative_form',
        mockSubmit,
      );
    });

    it('sets sessionStorage flag when "Start form upload and submission" is clicked', () => {
      cy.visit(
        '/representative/representative-form-upload/submit-va-form-21-686c',
      );

      cy.get('a[href="#start"]')
        .contains('Start form upload and submission')
        .click();

      cy.window().then(win => {
        const flag = win.sessionStorage.getItem('formIncompleteARP');
        expect(flag).to.equal('true');
      });
      cy.injectAxe();
      cy.axeCheck();
    });

    it('allows veteran claimant submission', () => {
      cy.visit(
        '/representative/representative-form-upload/submit-va-form-21-686c',
      );
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/submit-va-form-21-686c/introduction',
      );
      cy.injectAxe();
      cy.axeCheck();
    });

    ['21-686c'].forEach(formId => {
      describe(`form ${formId}`, () => {
        it('allows veteran claimant submission', () => {
          cy.visit(
            `/representative/representative-form-upload/submit-va-form-${formId}`,
          );
          cy.location('pathname').should(
            'eq',
            `/representative/representative-form-upload/submit-va-form-${formId}/introduction`,
          );

          cy.injectAxe();
          cy.axeCheck();

          cy.get('a[href="#start"]')
            .contains('Start form upload and submission')
            .click();

          cy.location('pathname').should(
            'eq',
            `/representative/representative-form-upload/submit-va-form-${formId}/is-veteran`,
          );

          cy.findByLabelText(/^The claimant is the Veteran$/).click();
          cy.findByRole('button', { name: /^Continue$/ }).click();
          cy.location('pathname').should(
            'eq',
            `/representative/representative-form-upload/submit-va-form-${formId}/veteran-information`,
          );

          cy.axeCheck();

          fillTextWebComponent(
            'veteranFullName_first',
            data.veteranFullName.first,
          );
          fillTextWebComponent(
            'veteranFullName_last',
            data.veteranFullName.last,
          );
          fillTextWebComponent('address_postalCode', data.address.postalCode);
          cy.get('input[name="root_veteranSsn"]').type(data.ssn);

          cy.get('select[name="root_veteranDateOfBirthMonth"]').select(
            'February',
          );
          cy.get('input[name="root_veteranDateOfBirthDay"]').type('15');
          cy.get('input[name="root_veteranDateOfBirthYear"]').type('1990');
          cy.axeCheck();
          cy.findByRole('button', { name: /^Continue$/ }).click();
          cy.axeCheck();

          cy.location('pathname').should(
            'eq',
            `/representative/representative-form-upload/submit-va-form-${formId}/upload-files`,
          );

          cy.fillVaFileInput('root_uploadedFile', uploadImgDetails);
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(1000);
          cy.axeCheck();

          cy.findByRole('button', { name: /^Continue$/ }).click();
          cy.location('pathname').should(
            'eq',
            `/representative/representative-form-upload/submit-va-form-${formId}/review-and-submit`,
          );

          cy.clickFormContinue();
          cy.axeCheck();
          cy.location('pathname').should(
            'eq',
            `/representative/representative-form-upload/submit-va-form-${formId}/confirmation`,
          );
        });

        it('allows veteran claimant submission with supporting evidence', () => {
          cy.visit(
            `/representative/representative-form-upload/submit-va-form-${formId}`,
          );
          cy.injectAxe();
          cy.axeCheck();
          cy.location('pathname').should(
            'eq',
            `/representative/representative-form-upload/submit-va-form-${formId}/introduction`,
          );

          cy.get('a[href="#start"]')
            .contains('Start form upload and submission')
            .click();

          cy.location('pathname').should(
            'eq',
            `/representative/representative-form-upload/submit-va-form-${formId}/is-veteran`,
          );

          cy.findByLabelText(/^The claimant is the Veteran$/).click();
          cy.findByRole('button', { name: /^Continue$/ }).click();
          cy.axeCheck();

          cy.location('pathname').should(
            'eq',
            `/representative/representative-form-upload/submit-va-form-${formId}/veteran-information`,
          );

          fillTextWebComponent(
            'veteranFullName_first',
            data.veteranFullName.first,
          );
          fillTextWebComponent(
            'veteranFullName_last',
            data.veteranFullName.last,
          );
          fillTextWebComponent('address_postalCode', data.address.postalCode);
          cy.get('input[name="root_veteranSsn"]').type(data.ssn);
          cy.get('select[name="root_veteranDateOfBirthMonth"]').select(
            'February',
          );
          cy.get('input[name="root_veteranDateOfBirthDay"]').type('15');
          cy.get('input[name="root_veteranDateOfBirthYear"]').type('1990');
          cy.axeCheck();

          cy.findByRole('button', { name: /^Continue$/ }).click();
          cy.axeCheck();

          cy.location('pathname').should(
            'eq',
            `/representative/representative-form-upload/submit-va-form-${formId}/upload-files`,
          );

          cy.fillVaFileInput('root_uploadedFile', uploadImgDetails);

          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(1000);

          cy.fillVaFileInputMultiple(
            'root_supportingDocuments',
            uploadImgDetails,
          );

          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(1000);
          cy.axeCheck();

          cy.clickFormContinue();
          cy.location('pathname').should(
            'eq',
            `/representative/representative-form-upload/submit-va-form-${formId}/review-and-submit`,
          );

          cy.clickFormContinue();
          cy.axeCheck();
        });
      });
    });

    it('allows non-veteran claimant submission', () => {
      cy.visit(
        `/representative/representative-form-upload/submit-va-form-21-686c/`,
      );
      cy.injectAxe();
      cy.axeCheck();
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/submit-va-form-21-686c/introduction',
      );

      cy.get('a[href="#start"]')
        .contains('Start form upload and submission')
        .click();

      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/submit-va-form-21-686c/is-veteran',
      );

      cy.findByLabelText(
        /^The claimant is a survivor or dependent of the Veteran$/,
      ).click();
      cy.findByRole('button', { name: /^Continue$/ }).click();
      cy.axeCheck();
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/submit-va-form-21-686c/claimant-information',
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
      fillTextWebComponent('address_postalCode', data.address.postalCode);
      cy.get('input[name="root_veteranSsn"]').type(data.ssn);
      cy.axeCheck();
      cy.findByRole('button', { name: /^Continue$/ }).click();
      cy.axeCheck();

      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/submit-va-form-21-686c/upload-files',
      );

      cy.fillVaFileInput('root_uploadedFile', uploadImgDetails);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.axeCheck();

      cy.findByRole('button', { name: /^Continue$/ }).click();
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/submit-va-form-21-686c/review-and-submit',
      );

      cy.clickFormContinue();
      cy.axeCheck();
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/submit-va-form-21-686c/confirmation',
      );
    });
  });

  describe('Transient server error (Service Unavailable)', () => {
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
        '/accredited_representative_portal/v0/upload_supporting_documents',
        mockScannedFormUpload,
      );
      cy.intercept(
        'POST',
        '/accredited_representative_portal/v0/submit_representative_form',
        {
          statusCode: 503,
        },
      );
    });

    it('shows the appropriate error message', () => {
      cy.visit(
        `/representative/representative-form-upload/submit-va-form-21-686c`,
      );

      cy.injectAxe();
      cy.axeCheck();

      cy.get('a[href="#start"]')
        .contains('Start form upload and submission')
        .click();

      cy.location('pathname').should(
        'eq',
        `/representative/representative-form-upload/submit-va-form-21-686c/is-veteran`,
      );

      cy.findByLabelText(/^The claimant is the Veteran$/).click();
      cy.findByRole('button', { name: /^Continue$/ }).click();
      cy.location('pathname').should(
        'eq',
        `/representative/representative-form-upload/submit-va-form-21-686c/veteran-information`,
      );

      cy.axeCheck();

      fillTextWebComponent('veteranFullName_first', data.veteranFullName.first);
      fillTextWebComponent('veteranFullName_last', data.veteranFullName.last);
      fillTextWebComponent('address_postalCode', data.address.postalCode);
      cy.get('input[name="root_veteranSsn"]').type(data.ssn);

      cy.get('select[name="root_veteranDateOfBirthMonth"]').select('February');
      cy.get('input[name="root_veteranDateOfBirthDay"]').type('15');
      cy.get('input[name="root_veteranDateOfBirthYear"]').type('1990');
      cy.axeCheck();
      cy.findByRole('button', { name: /^Continue$/ }).click();
      cy.axeCheck();

      cy.location('pathname').should(
        'eq',
        `/representative/representative-form-upload/submit-va-form-21-686c/upload-files`,
      );

      cy.fillVaFileInput('root_uploadedFile', uploadImgDetails);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.axeCheck();

      cy.findByRole('button', { name: /^Continue$/ }).click();
      cy.location('pathname').should(
        'eq',
        `/representative/representative-form-upload/submit-va-form-21-686c/review-and-submit`,
      );

      cy.clickFormContinue();
      cy.location('pathname').should(
        'eq',
        `/representative/representative-form-upload/submit-va-form-21-686c/review-and-submit`,
      );
      cy.get('#submission-error').contains(
        'The form couldn’t be submitted because of high system traffic',
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
      cy.visit(
        '/representative/representative-form-upload/submit-va-form-21-686c/',
      );
      cy.injectAxe();
      cy.axeCheck();
      cy.location('pathname').should('eq', '/sign-in/');
    });
  });
});
