// import 'cypress';
import mockUser from './fixtures/user.json';

import responseEducationBenefitsAndWorkStudy from './fixtures/ask_va_api/v0/contents/topics/education-benefits-and-work-study.json';
import responseDisabilityCompensation from './fixtures/ask_va_api/v0/contents/topics/disability-compensation.json';
import responseHealthCare from './fixtures/ask_va_api/v0/contents/topics/health-care.json';

describe('Ask VA test log in page', () => {
  // beforeAll(() => {
  //   cy.intercept('GET', `/avs/v0/avs/*`, mockUser); // TODO: map mocks to actual routes

  // });

  beforeEach(() => {
    cy.intercept(
      'GET',
      `/ask_va_api/v0/contents?type=topic&parent_id=75524deb-d864-eb11-bb24-000d3a579c45`,
      responseEducationBenefitsAndWorkStudy,
    );
    cy.intercept(
      'GET',
      `/ask_va_api/v0/contents?type=topic&parent_id=68524deb-d864-eb11-bb24-000d3a579c45`,
      responseDisabilityCompensation,
    );
    cy.intercept(
      'GET',
      `/ask_va_api/v0/contents?type=topic&parent_id=73524deb-d864-eb11-bb24-000d3a579c45`,
      responseHealthCare,
    );

    cy.intercept('GET', `/avs/v0/avs/*`, mockUser); // TODO: map mocks to actual routes
    cy.login(/* mockUser */);
  });

  it('visits landing page of Ask VA ', () => {
    cy.visit('/contact-us/ask-va-too');
    cy.injectAxeThenAxeCheck();

    cy.findByText(`Ask a new question`).should('be.visible');
    cy.findByText(`Ask a new question`).click();

    // Interecept prefill here

    cy.findByText(`Continue`).should('be.visible');
    cy.findByText(`Continue`).click();
  });
});

// describe('a bogus test group', () => {
//   it('should fail', () => {
//     expect(true).to.be.false;
//   });
// });
