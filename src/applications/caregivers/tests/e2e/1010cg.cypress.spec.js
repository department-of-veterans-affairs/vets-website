import path from 'path';

import formConfig from 'applications/caregivers/config/form';
import manifest from 'applications/caregivers/manifest.json';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import {
  veteranSignatureContent,
  primaryCaregiverContent,
  secondaryCaregiverContent,
} from 'applications/caregivers/definitions/content';

const veteranLabel = `Veteran\u2019s`;
const primaryLabel = `Primary Family Caregiver applicant\u2019s`;
const secondaryOneLabel = `Secondary Family Caregiver applicant\u2019s`;
const secondaryTwoLabel = `Secondary Family Caregiver (2) applicant\u2019s`;

export const mockVeteranSignatureContent = [
  'I certify that I give consent to the individual(s) named in this application to perform personal care services for me upon being approved as Primary and/or Secondary Family Caregivers in the Program of Comprehensive Assistance for Family Caregivers.',
];
export const mockPrimaryCaregiverContent = [
  'I certify that I am at least 18 years of age.',
  "I certify that I am a family member of the Veteran named in this application or I reside with the Veteran, or will do so upon designation as the Veteran's Primary Family Caregiver.",
  'I agree to perform personal care services as the Primary Family Caregiver for the Veteran named on this application.',
  'I understand that the Veteran or Veteran’s surrogate may request my discharge from the Program of Comprehensive Assistance for Family Caregivers (PCAFC) at any time. I understand that my designation as a Primary Family Caregiver may be revoked or I may be discharged from the program by the Secretary of Veterans Affairs or his designee, as set forth in 38 CFR 71.45.',
  'I understand that participation in Program of Comprehensive Assistance for Family Caregivers does not create an employment relationship between me and the Department of Veterans Affairs.',
];
export const mockSecondaryCaregiverContent = [
  'I certify that I am at least 18 years of age.',
  "I certify that I am a family member of the Veteran named in this application or I reside with the Veteran, or will do so upon designation as the Veteran's Secondary Family Caregiver.",
  'I agree to perform personal care services as the Secondary Family Caregiver for the Veteran named on this application.',
  'I understand that the Veteran or Veteran’s surrogate may request my discharge from the Program of Comprehensive Assistance for Family Caregivers (PCAFC) at any time. I understand that my designation as a Secondary Family Caregiver may be revoked or I may be discharged from the program by the Secretary of Veterans Affairs or his designee, as set forth in 38 CFR 71.45.',
  'I understand that participation in Program of Comprehensive Assistance for Family Caregivers does not create an employment relationship between me and the Department of Veterans Affairs.',
];

// 'secondaryOneOnly',
// 'oneSecondaryCaregivers',
// 'twoSecondaryCaregivers',

const testSecondaryTwo = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['requiredOnly'],
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
              // sign signature as veteran
              cy.findByTestId(veteranLabel)
                .find('input')
                .first()
                .type('Micky Mouse');

              cy.findByTestId(veteranLabel)
                .find('[type="checkbox"]')
                .check();

              // sign signature as secondaryOne caregiver
              cy.findByTestId(secondaryOneLabel)
                .find('input')
                .first()
                .type('George Geef Goofus');

              cy.findByTestId(secondaryOneLabel)
                .find('[type="checkbox"]')
                .check();
              break;
            case 'oneSecondaryCaregivers':
              // sign signature as veteran
              cy.findByTestId(veteranLabel)
                .find('input')
                .first()
                .type('Micky Mouse');

              cy.findByTestId(veteranLabel)
                .find('[type="checkbox"]')
                .check();

              // sign signature as primary caregiver
              cy.findByTestId(primaryLabel)
                .find('input')
                .first()
                .type('Mini Mouse');

              cy.findByTestId(primaryLabel)
                .find('[type="checkbox"]')
                .check();

              // sign signature as secondaryOne caregiver
              cy.findByTestId(secondaryOneLabel)
                .find('input')
                .first()
                .type('George Geef Goofus');

              cy.findByTestId(secondaryOneLabel)
                .find('[type="checkbox"]')
                .check();
              break;
            case 'twoSecondaryCaregivers':
              cy.findByTestId(veteranLabel)
                .find('input')
                .first()
                .type('Micky Mouse');

              cy.findByTestId(veteranLabel)
                .find('[type="checkbox"]')
                .check();

              // sign signature as primary caregiver
              cy.findByTestId(primaryLabel)
                .find('input')
                .first()
                .type('Mini Mouse');

              cy.findByTestId(primaryLabel)
                .find('[type="checkbox"]')
                .check();

              // sign signature as secondaryOne caregiver
              cy.findByTestId(secondaryOneLabel)
                .find('input')
                .first()
                .type('George Geef Goofus');

              cy.findByTestId(secondaryOneLabel)
                .find('[type="checkbox"]')
                .check();

              // sign signature as secondaryTwo caregiver
              cy.findByTestId(secondaryTwoLabel)
                .find('input')
                .first()
                .type('Donald Duck');

              cy.findByTestId(secondaryTwoLabel)
                .find('[type="checkbox"]')
                .check();
              break;
            default:
              // check veteran content
              veteranSignatureContent.forEach((veteranContent, idx) => {
                cy.get(`[data-testid=${veteranLabel}]`)
                  .contains(veteranContent, { matchCase: true })
                  .should(signatureParagraph =>
                    expect(signatureParagraph[0].innerText).to.eq(
                      mockVeteranSignatureContent[idx],
                    ),
                  );
              });

              cy.findByTestId(veteranLabel)
                .find('input')
                .first()
                .type('Micky Mouse');

              // check  checkbox as a veteran
              cy.findByTestId(veteranLabel)
                .find('[type="checkbox"]')
                .check();

              // sign signature as primary caregiver
              cy.findByTestId(primaryLabel)
                .find('input')
                .first()
                .type('Mini Mouse');

              cy.findByTestId(primaryLabel)
                .find('[type="checkbox"]')
                .check();
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
