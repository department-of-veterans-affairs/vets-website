import basicUser from './fixtures/users/user-basic.js';

describe('healthcare questionnaire -- demographics -- phone numbers', () => {
  beforeEach(() => {
    cy.fixture(
      '../../src/applications/healthcare/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
    ).then(async features => {
      cy.route('GET', '/v0/feature_toggles*', features);
      cy.login(basicUser);
      window.localStorage.setItem(
        'DISMISSED_ANNOUNCEMENTS',
        JSON.stringify(['single-sign-on-intro']),
      );
      cy.visit('/healthcare/questionnaire/demographics?skip');
    });
  });
  it('all default phone numbers', () => {
    cy.findByTestId('homePhone-label').contains('Home phone', {
      matchCase: false,
    });
    cy.findByTestId('homePhone').contains('503-222-2222', {
      matchCase: false,
    });
    cy.findByTestId('mobilePhone').contains('503-555-1234', {
      matchCase: false,
    });
    cy.findByTestId('temporaryPhone').contains('503-555-5555', {
      matchCase: false,
    });
  });
  // it('all default addresses', () => {
  //   cy.findByTestId('mailingAddress').contains(
  //     '1493 Martin Luther King Rd Apt 1',
  //     {
  //       matchCase: false,
  //     },
  //   );
  //   cy.findByTestId('residentialAddress').contains('PSC 808 Box 37', {
  //     matchCase: false,
  //   });
  // });
  // it('basic information', () => {
  //   cy.get('.schemaform-title>h1').contains('Healthcare Questionnaire');
  //   cy.findByTestId('fullName').contains('CALVIN C FLETCHER', {
  //     matchCase: false,
  //   });
  //   cy.findByTestId('dateOfBirth').contains('December 19, 1924', {
  //     matchCase: false,
  //   });
  //   cy.findByTestId('gender').contains('male', {
  //     matchCase: false,
  //   });
  // });
});
