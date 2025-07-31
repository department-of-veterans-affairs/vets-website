import mockLOA1User from '../fixtures/test-user-loa1.json';
import { CHAPTER_31_ROOT_URL } from '../../constants';

describe('Chapter 31 LOA1 authentication gate', () => {
  beforeEach(() => {
    cy.login(mockLOA1User);
  });

  it('should display an alert to verify identity if a user is LOA1', () => {
    cy.visit(CHAPTER_31_ROOT_URL);

    cy.injectAxe();

    cy.get('va-alert-sign-in').should('exist');

    cy.axeCheck();
  });
});
