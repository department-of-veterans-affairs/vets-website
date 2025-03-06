// import Timeouts from 'platform/testing/e2e/timeouts';

// describe('10282 Review Page', () => {
//   beforeEach(() => {
//     cy.visit('/education/other-va-education-benefits/ibm-skillsbuild-program/apply-form-22-10282');
//   });
//   beforeEach(() => {
//     cy.get('[text="Start your application"]').click();
//     // eslint-disable-next-line cypress/unsafe-to-chain-command
//     cy.get('[id="root_veteranFullName_first"]')
//       .focus()
//       .type('John')
//       .then(() => {
//         // eslint-disable-next-line cypress/unsafe-to-chain-command
//         cy.get('[id="root_veteranFullName_last"]')
//           .focus()
//           .type('Doe')
//           .then(() => {
//             cy.get('[class="usa-button-primary"]').click();
//           });
//       });

//     cy.get('[id="root_veteranDesc_0"]', { timeout: Timeouts.slow }).click();
//     cy.get('[class="usa-button-primary"]').click();
//     // eslint-disable-next-line cypress/unsafe-to-chain-command
//     cy.get('[name="root_contactInfo_email"]')
//       .first()
//       .type('someEmail@mail.com')
//       .then(() => {
//         cy.get('[class="usa-button-primary"]').click();
//       });
//     cy.get('[name="root_country"]')
//       .first()
//       .select('United States');
//     cy.get('[class="usa-button-primary"]').click();
//     cy.get('[name="root_state"]')
//       .first()
//       .select('New York');
//     cy.get('[class="usa-button-primary"]').click();
//     cy.get('[id="root_raceAndGender_0"]').click();
//     cy.get('[class="usa-button-primary"]').click();
//     cy.get('[id="root_ethnicity_1"]').click();
//     cy.get('[data-testid="American Indian or Alaskan Native"]').click();
//     cy.get('[class="usa-button-primary"]').click();
//     cy.get('[id="root_gender_0"]').click();
//     cy.get('[class="usa-button-primary"]').click();
//     cy.get('[id="root_highestLevelOfEducation_level_2"]').click();
//     cy.get('[class="usa-button-primary"]').click();
//     cy.get('[id="root_currentlyEmployed_0"]').click();
//     cy.get('[class="usa-button-primary"]').click();
//     cy.get('[id="root_currentAnnualSalary_4"]').click();
//     cy.get('[class="usa-button-primary"]').click();
//     cy.get('[id="root_isWorkingInTechIndustry_0"]').click();
//     cy.get('[class="usa-button-primary"]').click();
//     cy.get('[id="root_techIndustryFocusArea_0"]').click();
//     cy.get('[class="usa-button-primary"]').click();
//   });
//   it('should show the review page', () => {
//     cy.injectAxeThenAxeCheck();
//     cy.location('href').should('contain', '/review-and-submit');
//   });
//   it('user should be able to edit the application', () => {
//     cy.injectAxeThenAxeCheck();
//     cy.get('[data-chapter="personalInformation"]').click();
//     cy.get('[class="review"]')
//       .first()
//       .find('dd')
//       .should('include.text', 'John');
//     cy.get('[label="Edit Applicant information"]').click();
//     cy.get('[name="root_veteranFullName_first"]').should('have.value', 'John');
//     cy.get('[name="root_veteranFullName_last"]').should('have.value', 'Doe');
//     cy.get('[name="root_veteranFullName_first"]').clear();
//     cy.get('[name="root_veteranFullName_first"]').type('some other name');
//     cy.get('[aria-label="Update Applicant information"]').click();
//     cy.get('[class="review"]')
//       .first()
//       .find('dd')
//       .should('include.text', 'some other name');
//   });
//   it('Should give an error if the application is submitted without a full name and confirm that the information provided above is correct.', () => {
//     cy.injectAxeThenAxeCheck();
//     cy.get('[class="usa-button-primary"]').click();
//     cy.get('[class="usa-error-message"]').should('be.visible');
//     cy.get('[class="usa-error-message"]').should(
//       'include.text',
//       'Please enter your name',
//     );
//     cy.get('[id="checkbox-error-message"]').should('be.visible');
//     cy.get('[id="checkbox-error-message"]').should(
//       'include.text',
//       'Please check the box to certify the information is correct',
//     );
//   });
//   it('should show an error if name does not match the name entred in the form', () => {
//     cy.injectAxeThenAxeCheck();
//     // eslint-disable-next-line cypress/unsafe-to-chain-command
//     cy.get('[id="inputField"]')
//       .focus()
//       .type('some other name');
//     cy.get(
//       '[label="I certify the information above is correct and true to the best of my knowledge and belief."]',
//     ).click();
//     cy.get('[class="usa-button-primary"]').click();
//     cy.get('[class="usa-error-message"]').should(
//       'include.text',
//       'Please enter your full name exactly as entered on the form:',
//     );
//   });
//   it('should submit the application successfully if the name matches', () => {
//     cy.injectAxeThenAxeCheck();
//     // eslint-disable-next-line cypress/unsafe-to-chain-command
//     cy.get('va-text-input')
//       .find('input')
//       .focus()
//       .type('John Doe')
//       .then(() => {
//         cy.get(
//           '[label="I certify the information above is correct and true to the best of my knowledge and belief."]',
//         ).click();
//         cy.get('[class="usa-button-primary"]').click();
//       });
//     cy.get('[status="success"]').should('be.visible');
//   });
// });
