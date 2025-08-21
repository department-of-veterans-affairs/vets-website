import content from '../../../locales/en/content.json';
import mockFacilities from '../fixtures/mocks/facilities.json';
import mockFeatures from '../fixtures/mocks/feature-toggles.json';
import mockMaintenanceWindows from '../fixtures/mocks/maintenance-windows.json';
import mockMapbox from '../fixtures/mocks/mapbox.json';
import mockPdfDownload from '../fixtures/mocks/pdf-download.json';
import mockSubmission from '../fixtures/mocks/submission.json';
import mockUpload from '../fixtures/mocks/upload.json';
import mockVamc from '../fixtures/mocks/vamc-ehr.json';
import { fillStatementOfTruthPattern, fillVaFacilitySearch } from './fillers';
import { goToNextPage, startAsGuestUser } from './helpers';

const APIs = {
  downloadPdf: '/v0/caregivers_assistance_claims/download_pdf',
  facilities: '/v0/caregivers_assistance_claims/facilities',
  features: '/v0/feature_toggles*',
  maintenance: '/v0/maintenance_windows',
  mapbox: 'https://api.mapbox.com/**/*',
  submit: '/v0/caregivers_assistance_claims',
  upload: '/v0/form1010cg/attachments',
  vamc: '/data/cms/vamc-ehr.json',
};

export const setupBasicTest = (props = {}) => {
  Cypress.config({ scrollBehavior: 'nearest' });

  const { features = mockFeatures } = props;

  cy.intercept('GET', APIs.mapbox, mockMapbox).as('getCoordinates');
  cy.intercept('GET', APIs.features, features).as('mockFeatures');
  cy.intercept('GET', APIs.maintenance, mockMaintenanceWindows);
  cy.intercept('GET', APIs.vamc, mockVamc);
  cy.intercept('HEAD', APIs.maintenance, {});
  cy.intercept('POST', APIs.upload, mockUpload);
  cy.intercept('POST', APIs.submit, mockSubmission);
  cy.intercept('POST', APIs.downloadPdf, mockPdfDownload).as('downloadPdf');
  cy.intercept('POST', APIs.facilities, mockFacilities).as('getFacilities');
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
    cy.get('@testData').then(testData => {
      const labels = {
        veteran: content['vet-input-label'],
        primary: content['primary-signature-label'],
        representative: content['sign-as-rep-signature-label'],
        secondaryOne: content['secondary-one-signature-label'],
        secondaryTwo: content['secondary-two-signature-label'],
      };
      const parties = {
        veteran: testData.veteranSignature,
        primary: testData.primarySignature,
        representative: testData.primarySignature,
        secondaryOne: testData.secondaryOneSignature,
        secondaryTwo: testData.secondaryTwoSignature,
      };

      cy.get('@testKey').then(testKey => {
        const statementOfTruthActions = {
          secondaryOneOnly: ['veteran', 'secondaryOne'],
          oneSecondaryCaregiver: ['veteran', 'primary', 'secondaryOne'],
          twoSecondaryCaregivers: [
            'veteran',
            'primary',
            'secondaryOne',
            'secondaryTwo',
          ],
          signAsRepresentativeYes: ['representative', 'primary'],
          default: ['veteran', 'primary'],
        };
        const signatures =
          statementOfTruthActions[testKey] || statementOfTruthActions.default;
        signatures.forEach(role =>
          fillStatementOfTruthPattern(labels[role], parties[role]),
        );
      });
    });
  },
  confirmation: ({ afterHook }) => {
    afterHook(() => {
      cy.get(`va-link[text="${content['button-download']}"]`)
        .as('downloadButton')
        .click();

      cy.wait('@downloadPdf');
      cy.get('@downloadButton').should('be.visible');
    });
  },
};
