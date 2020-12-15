import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from 'applications/caregivers/config/form';
import manifest from 'applications/caregivers/manifest.json';

const veteranLabel = `Veteran\u2019s`;
const primaryLabel = `Primary Family Caregiver applicant\u2019s`;
const secondaryOneLabel = `Secondary Family Caregiver applicant\u2019s`;
const secondaryTwoLabel = `Secondary Family Caregiver (2) applicant\u2019s`;

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
