import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';
import manifest from '../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['test-data'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/Name and Date of Birth/i, { selector: 'a' })
            .first()
            .click();
        });
      },
      'name-and-date-of-birth': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            cy.get('#header-minimal').should('exist');
            cy.get('va-link[back="true"]').should('exist');
            cy.get('h1').should('contain', 'Name and date of birth');
            cy.fillPage();
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'employers-summary': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            cy.get('#header-minimal').should('exist');
            cy.get('va-link[back="true"]').should('exist');
            cy.document().then(document => {
              const hasItemCard = !!document.querySelector('va-card');
              if (hasItemCard) {
                cy.get('h1').should('contain', 'Review your employers');
                cy.get('va-card h2').should('exist');
                cy.get('va-radio')
                  .shadow()
                  .find('h2')
                  .should('exist');
              } else {
                cy.get('va-radio')
                  .shadow()
                  .find('h1')
                  .should('exist');
              }
              cy.selectYesNoVaRadioOption(
                'root_view:hasEmployers',
                !hasItemCard,
              );
            });

            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'employers/0/name': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(() => {
            cy.get('#header-minimal').should('exist');
            cy.get('va-link[back="true"]').should('exist');
            cy.get('h1').should('contain', 'Name');
            cy.fillPage();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'employers/0/date': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(() => {
            cy.get('#header-minimal').should('exist');
            cy.get('va-link[back="true"]').should('exist');
            cy.get('h1').should('contain', 'Date at name');
            cy.fillPage();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('POST', formConfig.submitUrl, { status: 200 });
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
