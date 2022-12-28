/// <reference types='cypress' />
import { mebUser } from '../fixtures/e2e-test-user-data';

describe('All Field prefilled tests for My Education Benefits app', function() {
  it('Your information page fields are prefilled', function() {
    cy.login(mebUser);

    cy.visit(
      'http://localhost:3001/education/apply-for-benefits-form-22-1990/',
    );
  });
});
