import manifest from '../manifest.json';

import mockFeatureToggles from '../../form/tests/fixtures/mocks/feature-toggles.json';
import mockDocuments from '../../form/tests/fixtures/mocks/documents.json';
import mockUser from '../../form/tests/fixtures/mocks/user.json';

import { COE_ELIGIBILITY_STATUS } from '../../shared/constants';

const uploadImgPath =
  'src/applications/lgy/coe/status/tests/components/DocumentUploader/testPicture.jpeg';

describe(manifest.appName, () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);
    cy.intercept('GET', '/v0/coe/documents', mockDocuments);
    cy.intercept('GET', '/v0/coe/status', {
      statusCode: 201,
      body: {
        data: {
          attributes: {
            status: COE_ELIGIBILITY_STATUS.pendingUpload,
          },
        },
      },
    }).as('pendingUpload');
  });

  it('Should render on pending-upload status', () => {
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();
    cy.get('@pendingUpload').then(() => {
      // A status alert should be visible
      cy.findByText(/We need more information from you/i).should('exist');
      cy.get('va-select').should('exist');
    });
  });

  it('Should show an error message when no file is added and the user tries to submit', () => {
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();

    cy.get('@pendingUpload').then(() => {
      // Find the submit button and click it
      cy.get('va-button[text="Submit files"]').click();
      cy.get('va-file-input')
        .shadow()
        .find('#file-input-error-alert')
        .should('have.id', 'file-input-error-alert');
    });
  });

  it('Should add a single file and show in file list', () => {
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();

    cy.get('@pendingUpload').then(() => {
      cy.get('va-select')
        .shadow()
        .find('select')
        .select('Statement of service');
      cy.get('input[type="file"]').selectFile(uploadImgPath, { force: true });
      cy.findByText(/testPicture.jpeg/i).should('exist');
    });
  });

  it('Should add multiple files and show in file list', () => {
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();

    cy.get('@pendingUpload').then(() => {
      cy.get('input[type="file"]').selectFile(uploadImgPath, { force: true });
      cy.get('va-select')
        .shadow()
        .find('select')
        .select('Statement of service');
      cy.get('input[type="file"]').selectFile(uploadImgPath, { force: true });
      cy.findByText(/Statement of service/i).should('exist');
    });
  });

  it('Should delete a file when delete file button is clicked', () => {
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();

    cy.get('@pendingUpload').then(() => {
      cy.get('va-select')
        .shadow()
        .find('select')
        .select('Statement of service');
      cy.get('input[type="file"]').selectFile(uploadImgPath, { force: true });
      cy.findByText(/testPicture.jpeg/i).should('exist');
      cy.findByText(/Delete file/i).click();
      cy.findByText(/testPicture.jpeg/i).should('not.exist');
    });
  });
});
