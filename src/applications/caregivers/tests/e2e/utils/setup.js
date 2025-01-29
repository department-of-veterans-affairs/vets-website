import content from '../../../locales/en/content.json';
import mockFacilities from '../fixtures/mocks/facilities.json';
import mockFeatures from '../fixtures/mocks/feature-toggles.json';
import mockMaintenanceWindows from '../fixtures/mocks/maintenance-windows.json';
import mockPdfDownload from '../fixtures/mocks/pdf-download.json';
import mockSubmission from '../fixtures/mocks/submission.json';
import mockUpload from '../fixtures/mocks/upload.json';
import mockVamc from '../fixtures/mocks/vamc-ehr.json';
import { fillStatementOfTruthPattern, fillVaFacilitySearch } from './fillers';
import { goToNextPage, startAsGuestUser } from './helpers';

const APIs = {
  facilities: '/v0/caregivers_assistance_claims/facilities',
  features: '/v0/feature_toggles*',
  maintenance: '/v0/maintenance_windows',
  downloadPdf: '/v0/caregivers_assistance_claims/download_pdf',
  submit: '/v0/caregivers_assistance_claims',
  upload: '/v0/form1010cg/attachments',
  vamc: '/data/cms/vamc-ehr.json',
};

export const setupBasicTest = (props = {}) => {
  Cypress.config({ scrollBehavior: 'nearest' });

  const { features = mockFeatures } = props;

  cy.intercept('GET', APIs.features, features).as('mockFeatures');
  cy.intercept('GET', APIs.maintenance, mockMaintenanceWindows);
  cy.intercept('GET', APIs.vamc, mockVamc);
  cy.intercept('POST', APIs.upload, mockUpload);
  cy.intercept('POST', APIs.downloadPdf, mockPdfDownload).as('downloadPdf');
  cy.intercept('POST', APIs.facilities, mockFacilities).as('getFacilities');
  cy.intercept('POST', APIs.submit, mockSubmission).as('mockSubmit');
};

export const pageHooks = {
  introduction: ({ afterHook }) => {
    afterHook(() => startAsGuestUser());
  },
  'veteran-information/va-medical-center/locator': ({ afterHook }) => {
    afterHook(() => {
      fillVaFacilitySearch();
      goToNextPage();
    });
  },
  'review-and-submit': () => {
    cy.get('@testKey').then(testKey => {
      const labels = {
        veteran: content['vet-input-label'],
        primary: content['primary-signature-label'],
        representative: content['sign-as-rep-signature-label'],
        secondaryOne: content['secondary-one-signature-label'],
        secondaryTwo: content['secondary-two-signature-label'],
      };
      const parties = {
        veteran: 'Micky Mouse',
        primary: 'Mini Mouse',
        secondaryOne: 'George Geef Goofus II',
        secondaryTwo: 'Donald Duck',
      };
      const statementOfTruthActions = {
        secondaryOneOnly: () => {
          fillStatementOfTruthPattern(labels.veteran, parties.veteran);
          fillStatementOfTruthPattern(
            labels.secondaryOne,
            parties.secondaryOne,
          );
        },
        oneSecondaryCaregiver: () => {
          fillStatementOfTruthPattern(labels.veteran, parties.veteran);
          fillStatementOfTruthPattern(labels.primary, parties.primary);
          fillStatementOfTruthPattern(
            labels.secondaryOne,
            parties.secondaryOne,
          );
        },
        twoSecondaryCaregivers: () => {
          fillStatementOfTruthPattern(labels.veteran, parties.veteran);
          fillStatementOfTruthPattern(labels.primary, parties.primary);
          fillStatementOfTruthPattern(
            labels.secondaryOne,
            parties.secondaryOne,
          );
          fillStatementOfTruthPattern(
            labels.secondaryTwo,
            parties.secondaryTwo,
          );
        },
        signAsRepresentativeYes: () => {
          fillStatementOfTruthPattern(labels.representative, parties.primary);
          fillStatementOfTruthPattern(labels.primary, parties.primary);
        },
        default: () => {
          fillStatementOfTruthPattern(labels.veteran, parties.veteran);
          fillStatementOfTruthPattern(labels.primary, parties.primary);
        },
      };

      (statementOfTruthActions[testKey] || statementOfTruthActions.default)();
    });
  },
  confirmation: ({ afterHook }) => {
    afterHook(() => {
      cy.get('va-link')
        .contains(content['button-download'])
        .as('button');

      cy.get('@button').click();

      cy.wait('@downloadPdf').then(() => {
        cy.get('@button').should('be.visible');
      });
    });
  },
};
