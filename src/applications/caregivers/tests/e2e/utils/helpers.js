import content from '../../../locales/en/content.json';
import {
  goToNextPage,
  selectYesNoWebComponent,
  selectCheckboxWebComponent,
  fillStatementOfTruthPattern,
  fillAddressWebComponentPattern,
} from '.';
import featureToggles from '../fixtures/mocks/feature-toggles.json';
import mockUpload from '../fixtures/mocks/mock-upload.json';
import mockFacilities from '../fixtures/mocks/mock-facilities.json';
import mockSubmission from '../fixtures/mocks/mock-submission.json';

export const setupPerTest = () => {
  cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
  cy.intercept('POST', 'v0/form1010cg/attachments', mockUpload);
  cy.intercept('GET', '/v1/facilities/va?*', mockFacilities).as(
    'getFacilities',
  );
  cy.intercept('POST', '/v0/caregivers_assistance_claims', mockSubmission);
};

export const pageHooks = {
  introduction: ({ afterHook }) => {
    afterHook(() => {
      cy.get('[href="#start"]')
        .first()
        .click();
    });
  },
  'veteran-information/home-address': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const fieldName = 'veteranAddress';
        const fieldData = data[fieldName];
        fillAddressWebComponentPattern(fieldName, fieldData);
        cy.injectAxeThenAxeCheck();
        goToNextPage();
      });
    });
  },
  'veteran-information/va-medical-center/locator': ({ afterHook }) => {
    afterHook(() => {
      cy.fillPage();
      cy.get('va-text-input')
        .shadow()
        .find('input')
        .type('33880');
      cy.get('[data-testid="caregivers-search-btn"]').click();
      cy.wait('@getFacilities');
      cy.get('#root_plannedClinic_plannedClinic')
        .should('be.visible')
        .first()
        .click();
      cy.get('.usa-button-primary').click();
    });
  },
  'primary-caregiver/home-address': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const fieldName = 'primaryAddress';
        const fieldData = data[fieldName];
        fillAddressWebComponentPattern(fieldName, fieldData);
        cy.injectAxeThenAxeCheck();
        goToNextPage();
      });
    });
  },
  'secondary-caregiver/home-address': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const fieldName = 'view:secondaryOneHomeSameAsMailingAddress';
        const fieldData = data[fieldName];
        selectCheckboxWebComponent('caregiverAddress_autofill', true);
        selectYesNoWebComponent(fieldName, fieldData);
        goToNextPage();
      });
    });
  },
  'secondary-caregiver/mailing-address': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const fieldName = 'secondaryOneMailingAddress';
        const fieldData = data[fieldName];
        fillAddressWebComponentPattern(fieldName, fieldData);
        cy.injectAxeThenAxeCheck();
        goToNextPage();
      });
    });
  },
  'additional-secondary-caregiver/home-address': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const fieldName = 'secondaryTwoAddress';
        const fieldData = data[fieldName];
        fillAddressWebComponentPattern(fieldName, fieldData);
        cy.injectAxeThenAxeCheck();
        goToNextPage();
      });
    });
  },
  'review-and-submit': () => {
    cy.get('@testKey').then(testKey => {
      const parties = {
        veteran: 'Micky Mouse',
        primary: 'Mini Mouse',
        secondaryOne: 'George Geef Goofus II',
        secondaryTwo: 'Donald Duck',
      };

      switch (testKey) {
        case 'secondaryOneOnly':
          fillStatementOfTruthPattern(
            content['vet-input-label'],
            parties.veteran,
          );
          fillStatementOfTruthPattern(
            content['secondary-one-signature-label'],
            parties.secondaryOne,
          );
          break;
        case 'oneSecondaryCaregiver':
          fillStatementOfTruthPattern(
            content['vet-input-label'],
            parties.veteran,
          );
          fillStatementOfTruthPattern(
            content['primary-signature-label'],
            parties.primary,
          );
          fillStatementOfTruthPattern(
            content['secondary-one-signature-label'],
            parties.secondaryOne,
          );
          break;
        case 'twoSecondaryCaregivers':
          fillStatementOfTruthPattern(
            content['vet-input-label'],
            parties.veteran,
          );
          fillStatementOfTruthPattern(
            content['primary-signature-label'],
            parties.primary,
          );
          fillStatementOfTruthPattern(
            content['secondary-one-signature-label'],
            parties.secondaryOne,
          );
          fillStatementOfTruthPattern(
            content['secondary-two-signature-label'],
            parties.secondaryTwo,
          );
          break;
        case 'signAsRepresentativeYes':
          fillStatementOfTruthPattern(
            content['sign-as-rep-signature-label'],
            parties.primary,
          );
          fillStatementOfTruthPattern(
            content['primary-signature-label'],
            parties.primary,
          );
          break;
        default:
          fillStatementOfTruthPattern(
            content['vet-input-label'],
            parties.veteran,
          );
          fillStatementOfTruthPattern(
            content['primary-signature-label'],
            parties.primary,
          );
          break;
      }
    });
  },
};
