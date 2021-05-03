import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataSets: [
      'test-data-veteran-no-facilities',
      'test-data-veteran',
      'test-data-spouse',
      'test-data-caregiver',
      'test-data-champva',
      'test-data-veteran-puerto-rico',
    ],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },

    pageHooks: {
      introduction: () => {
        cy.get('#introductionRadios-1').check();
        cy.findByText(/continue/i, { selector: 'button' })
          .first()
          .click();

        cy.injectAxe();
      },
      verify: () => {
        cy.fillPage();
      },
      'vaccine-location': () => {
        cy.get('@testData').then(testData => {
          if (testData.zipCode === '00000') {
            cy.wait('@getFacilitiesError');
          } else if (testData.zipCode === '00921') {
            cy.wait('@getFacilitiesPuertoRico');
            cy.get('.errorable-radio-button > input')
              .first()
              .check();
          } else {
            cy.wait('@getFacilities');
            cy.get('.errorable-radio-button > input')
              .first()
              .check();
          }
        });
      },
      // 'review-and-submit': () => {
      //   console.log('***************REVEIW AND SUBMIT');
      // },
      confirmation: () => {
        cy.get('h2').contains("We've received your information");
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/covid_vaccine/v0/facilities/00000', {
        statusCode: 422,
        body: {
          errors: [
            {
              title: 'Unprocessable Entity',
              detail: 'Invalid ZIP Code',
              code: '422',
              status: '422',
            },
          ],
        },
      }).as('getFacilitiesError');
      cy.intercept('GET', '/covid_vaccine/v0/facilities/97214', {
        statusCode: 200,
        body: {
          data: [
            {
              id: 'vha_648',
              type: 'vaccination_facility',
              attributes: {
                name: 'Portland VA Medical Center',
                distance: 2.31,
                city: 'Portland',
                state: 'OR',
              },
            },
            {
              id: 'vha_663',
              type: 'vaccination_facility',
              attributes: {
                name: 'Seattle VA Medical Center',
                distance: 142.35,
                city: 'Seattle',
                state: 'WA',
              },
            },
            {
              id: 'vha_653',
              type: 'vaccination_facility',
              attributes: {
                name: 'Roseburg VA Medical Center',
                distance: 161.95,
                city: 'Roseburg',
                state: 'OR',
              },
            },
            {
              id: 'vha_687',
              type: 'vaccination_facility',
              attributes: {
                name: 'Jonathan M. Wainwright Memorial VA Medical Center',
                distance: 209.89,
                city: 'Walla Walla',
                state: 'WA',
              },
            },
            {
              id: 'vha_692',
              type: 'vaccination_facility',
              attributes: {
                name: 'White City VA Medical Center',
                distance: 212.66,
                city: 'White City',
                state: 'OR',
              },
            },
          ],
        },
      }).as('getFacilities');
      cy.intercept('GET', '/covid_vaccine/v0/facilities/00921', {
        statusCode: 200,
        body: {
          data: [
            {
              id: 'vha_672',
              type: 'vaccination_facility',
              attributes: {
                name: 'San Juan VA Medical Center',
                distance: 5.1,
                city: 'San Juan',
                state: 'PR',
              },
            },
          ],
        },
      }).as('getFacilitiesPuertoRico');
      cy.intercept('POST', '/covid_vaccine/v0/expanded_registration', {
        statusCode: 200,
        body: {},
      }).as('submitForm');
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);

// describe('COVID-19 SAVE LIVES Act sign up', () => {
//   describe('when leaving one checkbox unchecked', () => {
//     before(() => {
//       cy.visit('health-care/covid-19-vaccine/sign-up/');
//       cy.injectAxe();
//     });

//     it('should throw a validation error', () => {
//       cy.axeCheck();

//       cy.intercept('GET', '/covid_vaccine/v0/facilities/20002', {
//         statusCode: 200,
//         body: {
//           data: [
//             {
//               id: 'vha_688',
//               type: 'vaccination_facility',
//               attributes: {
//                 name: 'Washington DC VAMC',
//                 distance: 5.2,
//                 city: 'Washington',
//                 state: 'DC',
//               },
//             },
//           ],
//         },
//       }).as('getWashingtonDCFacilities');

//       cy.intercept('POST', '/covid_vaccine/v0/expanded_registration', {
//         statusCode: 200,
//         body: {},
//       }).as('submitForm');

//       cy.get('label')
//         .contains('No')
//         .click({ force: true });

//       cy.get('button')
//         .contains('Continue')
//         .click();

//       cy.get('label')
//         .contains('CHAMPVA')
//         .click({ force: true });

//       cy.get('button')
//         .contains('Continue')
//         .click();

//       cy.findByLabelText(/First name/i)
//         .clear()
//         .type('Ralph');

//       cy.findByLabelText(/Last name/i)
//         .clear()
//         .type('Wiggum');

//       cy.findByLabelText('Month').select('1');

//       cy.findByLabelText('Day').select('1');

//       cy.findByLabelText('Year').type('1984');

//       cy.findByLabelText('Female').click();

//       cy.findByLabelText(/Social Security number/i).type('111223332');

//       cy.get('button')
//         .contains('Continue')
//         .click();

//       cy.findByLabelText(/U.S. street address where you live now/i)
//         .first()
//         .type('123 Maple Ave');

//       cy.findByLabelText(/U.S. city/i).type('Washington');

//       cy.findByLabelText(/U.S. state or territory/i).select('DC');

//       cy.findByLabelText(/Zip code/i).type('20002');

//       cy.findByLabelText(/Phone number/i).type('202-555-1122');

//       cy.get('button')
//         .contains('Continue')
//         .click();

//       cy.wait('@getWashingtonDCFacilities');

//       cy.get('.form-radio-buttons')
//         .first()
//         .click();

//       cy.get('button')
//         .contains('Continue')
//         .click();

//       cy.get('h2').contains('Review your information');

//       // Ensure link to Notice of Privacy Practices exists.
//       cy.get('a#kif-privacy-policy')
//         .should('have.attr', 'href')
//         .and(
//           'include',
//           'https://www.va.gov/vhapublications/ViewPublication.asp?pub_ID=1090',
//         );

//       // When neither truthfulness or privacy statements are checked, two errors are thrown.
//       cy.get('.usa-button-primary')
//         .contains('Submit form')
//         .click();
//       cy.get('.usa-input-error-message').contains(
//         /You must certify that your submission is truthful before submitting/i,
//       );
//       cy.get('.usa-input-error-message').contains(
//         /You must certify that you have access to VA's privacy practice information before submitting/i,
//       );

//       // Check truthful statement.
//       cy.findByLabelText(
//         /I certify that the information I’ve provided in this form is true/i,
//       ).click();

//       // When truthful statement is checked and privacy is not, correct error is thrown.
//       cy.get('.usa-button-primary')
//         .contains('Submit form')
//         .click();
//       cy.get('.usa-input-error-message').contains(
//         /You must certify that you have access to VA's privacy practice information before submitting/i,
//       );

//       // Uncheck truthful statement and check privacy statement.
//       cy.findByLabelText(
//         /I certify that the information I’ve provided in this form is true/i,
//       ).click();
//       cy.findByLabelText(
//         /I have been provided access to VA's Notice of Privacy Practices/i,
//       ).click();

//       // When privacy statement is checked and truthfulness is not, correct error is thrown.
//       cy.get('.usa-button-primary')
//         .contains('Submit form')
//         .click();
//       cy.get('.usa-input-error-message').contains(
//         /You must certify that your submission is truthful before submitting/i,
//       );

//       // When both are checked, form submits.
//       cy.findByLabelText(
//         /I certify that the information I’ve provided in this form is true/i,
//       ).click();
//       const FORCE_OPTION = { force: true };
//       cy.findByText(/Submit form/i, { selector: 'button' }).click(FORCE_OPTION);
//       // cy.get('.usa-button-primary')
//       //   .contains('Submit form')
//       //   .click();
//       cy.wait('@submitForm');
//       cy.get('h2')
//         .first()
//         .contains(/We've received your information/i);
//     });
//   });
// });
