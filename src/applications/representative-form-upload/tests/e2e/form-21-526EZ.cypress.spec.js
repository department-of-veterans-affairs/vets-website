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

const fillVeteranInfo = () => {
  fillTextWebComponent('veteranFullName_first', data.veteranFullName.first);
  fillTextWebComponent('veteranFullName_last', data.veteranFullName.last);
  fillTextWebComponent('address_postalCode', data.address.postalCode);
  cy.get('input[name="root_veteranSsn"]').type(data.ssn);
  cy.get('select[name="root_veteranDateOfBirthMonth"]').select('February');
  cy.get('input[name="root_veteranDateOfBirthDay"]').type('15');
  cy.get('input[name="root_veteranDateOfBirthYear"]').type('1990');
};

const setUpIntercepts = featureToggles => {
  cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
  setFeatureToggles(featureToggles);
};

const uploadFilePath =
  'src/applications/representative-form-upload/tests/e2e/fixtures/data/vba_21_686c.pdf';
const uploadFileDetails = {
  name: uploadFilePath,
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
        '/accredited_representative_portal/v0/submit_representative_form',
        mockSubmit,
      );
    });

    it('sets sessionStorage flag when "Start form upload and submission" is clicked', () => {
      cy.visit(
        '/representative/representative-form-upload/submit-va-form-21-526ez',
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
        '/representative/representative-form-upload/submit-va-form-21-526ez',
      );
      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/submit-va-form-21-526ez/introduction',
      );
      cy.injectAxe();
      cy.axeCheck();
    });
    const formId = '21-526ez';
    describe(`form ${formId}`, () => {
      it('allows submission', () => {
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
          `/representative/representative-form-upload/submit-va-form-${formId}/veteran-information`,
        );

        cy.axeCheck();

        fillVeteranInfo();
        cy.axeCheck();
        cy.findByRole('button', { name: /^Continue$/ }).click();
        cy.axeCheck();

        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-${formId}/upload-files`,
        );

        cy.fillVaFileInput('root_uploadedFile', uploadFileDetails);
        cy.axeCheck();

        cy.findByRole('button', { name: /^Continue$/ }).click();
        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-${formId}/review-and-submit`,
        );
        cy.axeCheck();

        cy.clickFormContinue();

        cy.axeCheck();
        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-${formId}/confirmation`,
        );
      });

      it('allows submission with supporting evidence', () => {
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
          `/representative/representative-form-upload/submit-va-form-${formId}/veteran-information`,
        );

        fillVeteranInfo();

        cy.findByRole('button', { name: /^Continue$/ }).click();
        cy.axeCheck();

        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-${formId}/upload-files`,
        );

        cy.fillVaFileInput('root_uploadedFile', uploadFileDetails);

        cy.fillVaFileInputMultiple(
          'root_supportingDocuments',
          uploadFileDetails,
        );
        cy.axeCheck();

        cy.clickFormContinue();
        cy.location('pathname').should(
          'eq',
          `/representative/representative-form-upload/submit-va-form-${formId}/review-and-submit`,
        );
        cy.axeCheck();

        cy.clickFormContinue();
        cy.axeCheck();
      });
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
      ).as('formUpload');
      cy.intercept(
        'POST',
        '/accredited_representative_portal/v0/upload_supporting_documents',
        mockScannedFormUpload,
      ).as('supportingDocsUpload');
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
        `/representative/representative-form-upload/submit-va-form-21-526ez`,
      );

      cy.injectAxe();
      cy.axeCheck();

      cy.get('a[href="#start"]')
        .contains('Start form upload and submission')
        .click();

      cy.location('pathname').should(
        'eq',
        `/representative/representative-form-upload/submit-va-form-21-526ez/veteran-information`,
      );

      cy.axeCheck();

      fillVeteranInfo();
      cy.axeCheck();
      cy.findByRole('button', { name: /^Continue$/ }).click();
      cy.axeCheck();

      cy.location('pathname').should(
        'eq',
        `/representative/representative-form-upload/submit-va-form-21-526ez/upload-files`,
      );

      cy.fillVaFileInput('root_uploadedFile', uploadFileDetails);
      cy.axeCheck();

      cy.findByRole('button', { name: /^Continue$/ }).click();
      cy.location('pathname').should(
        'eq',
        `/representative/representative-form-upload/submit-va-form-21-526ez/review-and-submit`,
      );
      cy.axeCheck();

      cy.clickFormContinue();
      cy.location('pathname').should(
        'eq',
        `/representative/representative-form-upload/submit-va-form-21-526ez/review-and-submit`,
      );
      cy.axeCheck();
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
        '/representative/representative-form-upload/submit-va-form-21-526ez/',
      );
      cy.injectAxe();
      cy.axeCheck();
      cy.location('pathname').should('eq', '/sign-in/');
    });
  });
});
