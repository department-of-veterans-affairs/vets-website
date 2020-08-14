import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const veteranLabel = `Enter Veteran\u2019s or service member\u2019s full name`;
const primaryLabel = 'Enter Primary Family Caregiver\u2019s full name';
const secondaryOneLabel = 'Enter Secondary Family Caregiver\u2019s full name';
const secondaryTwoLabel =
  'Enter Secondary Family Caregiver\u2019s (2) full name';

const testSecondaryTwo = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: [
      'requiredOnly',
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

    // disable all tests until 1010CG is in production
    skip: true,
  },
  manifest,
  formConfig,
);

testForm(testSecondaryTwo);
