import path from 'path';

import formConfig from 'applications/caregivers/config/form';
import manifest from 'applications/caregivers/manifest.json';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import {
  veteranSignatureContent,
  primaryCaregiverContent,
  secondaryCaregiverContent,
  veteranLabel,
  primaryLabel,
  secondaryOneLabel,
  secondaryTwoLabel,
} from 'applications/caregivers/definitions/content';

export const mockVeteranSignatureContent = [
  'I certify that I give consent to the individual(s) named in this application to perform personal care services for me upon being approved as Primary and/or Secondary Family Caregivers in the Program of Comprehensive Assistance for Family Caregivers.',
];
export const mockPrimaryCaregiverContent = [
  'I certify that I am at least 18 years of age.',
  "I certify that either: (1) I am a member of the Veteran's family (including a parent, spouse, a son or daughter, a step-family member, or an extended family member) OR (2) I am not a member of the Veteran's family, and I reside with the Veteran full-time or will do so upon designation as the Veteran's Primary Family Caregiver.",
  'I agree to perform personal care services as the Primary Family Caregiver for the Veteran named on this application.',
  "I understand that the Veteran or the Veteran's surrogate may request my discharge from the Program of Comprehensive Assistance for Family Caregivers (PCAFC) at any time and that my designation as a Primary Family Caregiver may be revoked or I may be discharged from PCAFC by the Secretary of Veterans Affairs (or designee) as set forth in 38 CFR 71.45.",
  'I understand that participation in the PCAFC does not create an employment relationship between me and the Department of Veterans Affairs.',
];
export const mockSecondaryCaregiverContent = [
  'I certify that I am at least 18 years of age.',
  "I certify that either: (1) I am a member of the Veteran's family (including a parent, spouse, a son or daughter, a step-family member, or an extended family member) OR (2) I am not a member of the Veteran's family, and I reside with the Veteran full-time or will do so upon designation as the Veteran's Secondary Family Caregiver.",
  'I agree to perform personal care services as the Secondary Family Caregiver for the Veteran named on this application.',
  "I understand that the Veteran or the Veteran's surrogate may request my discharge from the Program of Comprehensive Assistance for Family Caregivers (PCAFC) at any time and that my designation as a Secondary Family Caregiver may be revoked or I may be discharged from PCAFC by the Secretary of Veterans Affairs (or designee) as set forth in 38 CFR 71.45.",
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
    .find('input')
    .first()
    .type(signature);

  cy.findByTestId(partyLabel)
    .find('[type="checkbox"]')
    .check();
};

const testSecondaryTwo = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: [
      'requiredOnly',
      'secondaryOneOnly',
      'oneSecondaryCaregivers',
      'twoSecondaryCaregivers',
    ],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },

    setupPerTest: () => {
      cy.route('GET', '/v0/feature_toggles?*', 'fx:mocks/feature-toggles');
    },
    pageHooks: {
      introduction: () => {
        // Hit the start button
        cy.findAllByText(/start/i, { selector: 'button' })
          .first()
          .click();
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

        cy.route({
          method: 'POST',
          url: '/v0/caregivers_assistance_claims',
          status: 200,
          response: {
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
          },
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testSecondaryTwo);
