import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';
import {
  getFileInputElement,
  uploadFile,
  selectDocumentType,
  setupUnknownErrorMock,
} from './claims-status-helpers';

describe('When feature toggle cst_5103_update_enabled enabled', () => {
  context('A user can view primary alert details from the status tab', () => {
    context('when alert is a Submit Buddy Statement', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsOpen,
          false,
          false,
          false,
          true,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyPrimaryAlertforSubmitBuddyStatement();
        trackClaimsPage.verifyDocRequestforDefaultPage();
        trackClaimsPage.verifyDocRequestBreadcrumbs();
        trackClaimsPage.submitFilesForReview();
        cy.axeCheck();
      });
    });

    context('when alert is a Automated 5103 Notice', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsOpen,
          true,
          false,
          false,
          true,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyPrimaryAlertfor5103Notice(false, true);
        trackClaimsPage.verifyDocRequestfor5103Notice();
        trackClaimsPage.verifyDocRequestBreadcrumbs(false, true);
        trackClaimsPage.submitEvidenceWaiver();
        cy.axeCheck();
      });
    });
  });
  context('A user can view primary alert details from the files tab', () => {
    context('when alert is a Submit Buddy Statement', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsOpen,
          false,
          false,
          false,
          true,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.navigateToFilesTab();
        trackClaimsPage.verifyPrimaryAlertforSubmitBuddyStatement();
        trackClaimsPage.verifyDocRequestforDefaultPage();
        trackClaimsPage.verifyDocRequestBreadcrumbs(true);
        trackClaimsPage.submitFilesForReview();
        cy.axeCheck();
      });
    });

    context('when alert is a Automated 5103 Notice', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsOpen,
          true,
          false,
          false,
          true,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.navigateToFilesTab();
        trackClaimsPage.verifyPrimaryAlertfor5103Notice(false, true);
        trackClaimsPage.verifyDocRequestfor5103Notice();
        trackClaimsPage.verifyDocRequestBreadcrumbs(true, true);
        trackClaimsPage.submitEvidenceWaiver();
        cy.axeCheck();
      });
    });
  });
});

describe('Type 1 Error Alert', () => {
  const setDocumentUploadStatusToggle = enabled => ({
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'cst_show_document_upload_status',
          value: enabled,
        },
      ],
    },
  });

  context('when cst_show_document_upload_status is disabled', () => {
    it('should not display the type 1 unknown error alert', () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpen,
        false,
        false,
        false,
        false,
        setDocumentUploadStatusToggle(false),
      );

      // Navigate from status page to a document request page
      trackClaimsPage.verifyPrimaryAlert();
      trackClaimsPage.verifyDocRequestforDefaultPage();
      cy.injectAxe();

      setupUnknownErrorMock();

      // Upload a file and select a document type
      uploadFile('test-document.txt');
      getFileInputElement(0)
        .find('va-select')
        .should('be.visible');
      selectDocumentType(0, 'L034');

      // Submit files
      cy.get('.add-files-form va-button[text="Submit documents for review"]')
        .shadow()
        .find('button')
        .click();
      cy.wait('@uploadRequest');

      // Verify Type 1 alert is not present
      cy.get('.claims-alert').should(
        'not.contain.text',
        'We need you to submit files by mail or in person',
      );
      cy.get('.claims-alert').should('contain.text', 'Error uploading');

      cy.axeCheck();
    });
  });

  context('when cst_show_document_upload_status is enabled', () => {
    it('should not display the type 1 unknown error alert for known errors', () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpen,
        false,
        false,
        false,
        false,
        setDocumentUploadStatusToggle(true),
      );

      // Navigate from status page to a document request page
      trackClaimsPage.verifyPrimaryAlert();
      trackClaimsPage.verifyDocRequestforDefaultPage();
      cy.injectAxe();

      // Mock a known error (422 - duplicate file)
      cy.intercept('POST', '/v0/benefits_claims/*/benefits_documents', {
        statusCode: 422,
        body: {
          errors: [
            {
              title: 'Unprocessable Entity',
              detail: 'DOC_UPLOAD_DUPLICATE',
              code: '422',
              status: '422',
              source: 'BenefitsDocuments::Service',
            },
          ],
        },
      }).as('uploadRequest');

      // Upload a file and select a document type
      uploadFile('test-document.txt');
      getFileInputElement(0)
        .find('va-select')
        .should('be.visible');
      selectDocumentType(0, 'L034');

      // Submit files
      cy.get('.add-files-form va-button[text="Submit files for review"]')
        .shadow()
        .find('button')
        .click();
      cy.wait('@uploadRequest');

      // Verify Type 1 alert is not present
      cy.get('.claims-alert').should(
        'not.contain.text',
        'We need you to submit files by mail or in person',
      );
      cy.get('.claims-alert')
        .should('be.visible')
        .and('contain.text', "You've already uploaded");

      cy.axeCheck();
    });

    it('should display the type 1 unknown error alert for unknown errors', () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpen,
        false,
        false,
        false,
        false,
        setDocumentUploadStatusToggle(true),
      );

      // Navigate from status page to the document request page
      trackClaimsPage.verifyPrimaryAlert();
      trackClaimsPage.verifyDocRequestforDefaultPage();
      cy.injectAxe();

      setupUnknownErrorMock();

      // Upload a file and select a document type
      uploadFile('test-document.txt');
      getFileInputElement(0)
        .find('va-select')
        .should('be.visible');
      selectDocumentType(0, 'L034');

      // Submit files
      cy.get('.add-files-form va-button[text="Submit files for review"]')
        .shadow()
        .find('button')
        .click();
      cy.wait('@uploadRequest');

      // Verify Type 1 Unknown error alert is visible
      cy.get('.claims-alert')
        .should('be.visible')
        .and(
          'contain.text',
          'We need you to submit files by mail or in person',
        );

      cy.axeCheck();
    });
  });
});
