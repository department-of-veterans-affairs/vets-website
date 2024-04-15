import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import {
  veteranSignatureContent,
  primaryCaregiverContent,
  secondaryCaregiverContent,
  veteranLabel,
  primaryLabel,
  secondaryOneLabel,
  secondaryTwoLabel,
  representativeLabel,
  representativeSignatureContent,
} from '../../definitions/content';
import {
  veteranFields,
  primaryCaregiverFields,
  secondaryOneFields,
  secondaryTwoFields,
} from '../../definitions/constants';
import {
  fillAddressWithoutAutofill,
  fillDateWebComponentPattern,
} from '../helpers';
import featureToggles from './fixtures/mocks/feature-toggles.json';
import mockUpload from './fixtures/mocks/mock-upload.json';
import mockFacilities from './fixtures/mocks/mock-facilities.json';

export const mockVeteranSignatureContent = [
  'I certify that I give consent to the individual(s) named in this application to perform personal care services for me upon being approved as Primary and/or Secondary Family Caregivers in the Program of Comprehensive Assistance for Family Caregivers.',
];
export const mockRepresentativeSignatureContent = [
  'Signed by the Veteran’s legal representative on behalf of the Veteran.',
  'I certify that I give consent to the individual(s) named in this application to perform personal care services for me (or if the Veteran’s Representative, the Veteran) upon being approved as a Primary and/or Secondary Family Caregiver(s) in the Program of Comprehensive Assistance for Family Caregivers.',
];
export const mockPrimaryCaregiverContent = [
  'I certify that I am at least 18 years of age.',
  'I certify that either: (1) I am a member of the Veteran\u2019s family (including a parent, spouse, a son or daughter, a step-family member, or an extended family member) OR (2) I am not a member of the Veteran\u2019s family, and I reside with the Veteran full-time or will do so upon designation as the Veteran\u2019s Primary Family Caregiver.',
  'I agree to perform personal care services as the Primary Family Caregiver for the Veteran named on this application.',
  'I understand that the Veteran or the Veteran\u2019s surrogate may request my discharge from the Program of Comprehensive Assistance for Family Caregivers (PCAFC) at any time and that my designation as a Primary Family Caregiver may be revoked or I may be discharged from PCAFC by the Secretary of Veterans Affairs (or designee) as set forth in 38 CFR 71.45.',
  'I understand that participation in the PCAFC does not create an employment relationship between me and the Department of Veterans Affairs.',
];
export const mockSecondaryCaregiverContent = [
  'I certify that I am at least 18 years of age.',
  'I certify that either: (1) I am a member of the Veteran\u2019s family (including a parent, spouse, a son or daughter, a step-family member, or an extended family member) OR (2) I am not a member of the Veteran\u2019s family, and I reside with the Veteran full-time or will do so upon designation as the Veteran\u2019s Secondary Family Caregiver.',
  'I agree to perform personal care services as the Secondary Family Caregiver for the Veteran named on this application.',
  'I understand that the Veteran or the Veteran\u2019s surrogate may request my discharge from the Program of Comprehensive Assistance for Family Caregivers (PCAFC) at any time and that my designation as a Secondary Family Caregiver may be revoked or I may be discharged from PCAFC by the Secretary of Veterans Affairs (or designee) as set forth in 38 CFR 71.45.',
  'I understand that participation in the PCAFC does not create an employment relationship between me and the Department of Veterans Affairs.',
];

const checkContent = (partyLabel, content, mockContent) => {
  content.forEach((contentItem, idx) => {
    cy.get(`[data-testid="${partyLabel}"]`)
      .contains(contentItem, { matchCase: true })
      .should(signatureParagraph =>
        expect(signatureParagraph[0].innerText).to.eq(mockContent[idx]),
      );
  });
};

const signAsParty = (partyLabel, signature) => {
  cy.findByTestId(partyLabel)
    .find('.signature-input')
    .shadow()
    .find('input')
    .first()
    .type(signature);

  cy.findByTestId(partyLabel)
    .find('.signature-checkbox')
    .shadow()
    .find('label')
    .click();
};

const testSecondaryTwo = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: [
      'requiredOnly',
      'secondaryOneOnly',
      'oneSecondaryCaregivers',
      'twoSecondaryCaregivers',
      // 'signAsRepresentativeNoRep',
      'signAsRepresentativeNo',
      'signAsRepresentativeYes',
    ],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', 'v0/form1010cg/attachments', mockUpload);
      cy.intercept('GET', '/v1/facilities/va?*', mockFacilities).as(
        'getFacilities',
      );
    },
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          // Hit the start button
          cy.findAllByText(/start/i, { selector: 'a' })
            .first()
            .click();
        });
      },
      'vet-1': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();
            fillDateWebComponentPattern(
              veteranFields.dateOfBirth,
              data.veteranDateOfBirth,
            );
            cy.get('.usa-button-primary').click();
          });
        });
      },
      'select-facility': ({ afterHook }) => {
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
      'primary-2': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();
            fillDateWebComponentPattern(
              primaryCaregiverFields.dateOfBirth,
              data.primaryDateOfBirth,
            );
            cy.get('.usa-button-primary').click();
          });
        });
      },
      'primary-3': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.get('#root_primaryAddress_autofill')
            .shadow()
            .find('label')
            .click();
          cy.get('.usa-button-primary').click();
        });
      },
      'secondary-one-2': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();
            fillDateWebComponentPattern(
              secondaryOneFields.dateOfBirth,
              data.secondaryOneDateOfBirth,
            );
            cy.get('.usa-button-primary').click();
          });
        });
      },
      'secondary-one-3': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();
            fillAddressWithoutAutofill(
              secondaryOneFields.address,
              data.secondaryOneAddress,
            );
            cy.get('.usa-button-primary').click();
          });
        });
      },
      'secondary-two-1': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();
            fillDateWebComponentPattern(
              secondaryTwoFields.dateOfBirth,
              data.secondaryTwoDateOfBirth,
            );
            cy.get('.usa-button-primary').click();
          });
        });
      },
      'secondary-two-2': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();
            fillAddressWithoutAutofill(
              secondaryTwoFields.address,
              data.secondaryTwoAddress,
            );
            cy.get('.usa-button-primary').click();
          });
        });
      },
      'review-and-submit': () => {
        cy.get('@testKey').then(testKey => {
          switch (testKey) {
            case 'secondaryOneOnly':
              // Check veteran content && sign
              checkContent(
                veteranLabel,
                veteranSignatureContent,
                mockVeteranSignatureContent,
              );
              signAsParty(veteranLabel, 'Micky Mouse');

              // check secondary caregiver content && sign
              checkContent(
                secondaryOneLabel,
                secondaryCaregiverContent,
                mockSecondaryCaregiverContent,
              );
              signAsParty(secondaryOneLabel, 'George Geef Goofus');

              break;
            case 'oneSecondaryCaregivers':
              // check veteran content && sign
              checkContent(
                veteranLabel,
                veteranSignatureContent,
                mockVeteranSignatureContent,
              );
              signAsParty(veteranLabel, 'Micky Mouse');

              // Check primary caregiver content && sign
              checkContent(
                primaryLabel,
                primaryCaregiverContent,
                mockPrimaryCaregiverContent,
              );
              signAsParty(primaryLabel, 'Mini Mouse');

              // Check secondaryOne caregiver content && sign
              checkContent(
                secondaryOneLabel,
                secondaryCaregiverContent,
                mockSecondaryCaregiverContent,
              );
              signAsParty(secondaryOneLabel, 'George Geef Goofus');

              break;
            case 'twoSecondaryCaregivers':
              // check veteran content && sign
              checkContent(
                veteranLabel,
                veteranSignatureContent,
                mockVeteranSignatureContent,
              );
              signAsParty(veteranLabel, 'Micky Mouse');

              // Check primary caregiver content && sign
              checkContent(
                primaryLabel,
                primaryCaregiverContent,
                mockPrimaryCaregiverContent,
              );
              signAsParty(primaryLabel, 'Mini Mouse');

              // Check secondaryOne caregiver content && sign
              checkContent(
                secondaryOneLabel,
                secondaryCaregiverContent,
                mockSecondaryCaregiverContent,
              );
              signAsParty(secondaryOneLabel, 'George Geef Goofus');

              // Check secondaryTwo caregiver content && sign
              checkContent(
                secondaryTwoLabel,
                secondaryCaregiverContent,
                mockSecondaryCaregiverContent,
              );
              signAsParty(secondaryTwoLabel, 'Donald Duck');
              break;
            case 'signAsRepresentativeYes':
            case 'signAsRepresentativeNoRep':
              // check veteran content && sign as representative
              checkContent(
                representativeLabel,
                representativeSignatureContent,
                mockRepresentativeSignatureContent,
              );
              signAsParty(representativeLabel, 'Mini Mouse');

              // Check primary caregiver && sign
              checkContent(
                primaryLabel,
                primaryCaregiverContent,
                mockPrimaryCaregiverContent,
              );
              signAsParty(primaryLabel, 'Mini Mouse');
              break;
            default:
              // check veteran content && sign
              checkContent(
                veteranLabel,
                veteranSignatureContent,
                mockVeteranSignatureContent,
              );
              signAsParty(veteranLabel, 'Micky Mouse');

              // Check primary caregiver && sign
              checkContent(
                primaryLabel,
                primaryCaregiverContent,
                mockPrimaryCaregiverContent,
              );
              signAsParty(primaryLabel, 'Mini Mouse');
              break;
          }
        });
        // sign signature as veteran

        cy.intercept('POST', '/v0/caregivers_assistance_claims', {
          statusCode: 200,
          body: {
            data: {
              id: '',
              type: 'form1010cg_submissions',
              attributes: {
                confirmationNumber: 'aB935000000F3VnCAK',
                submittedAt: '2020-08-06T19:18:11+00:00',
              },
            },
          },
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testSecondaryTwo);
