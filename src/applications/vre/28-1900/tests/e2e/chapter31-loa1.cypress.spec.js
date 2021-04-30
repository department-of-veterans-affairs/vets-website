import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import mockLOA1User from '~/applications/personalization/profile/tests/fixtures/users/user-loa1.json';
import { CHAPTER_31_ROOT_URL } from '../../constants';

describe('Chapter 31 LOA1 authentication gate', () => {
  beforeEach(() => {
    disableFTUXModals();
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'show_chapter_31',
            value: true,
          },
        ],
      },
    });
    cy.login(mockLOA1User);
  });

  it('should display an alert to verify identity if a user is LOA1', () => {
    cy.visit(CHAPTER_31_ROOT_URL);

    cy.injectAxe();

    cy.findByRole('progressbar').should('exist');
    cy.findByText(/loading your information.../i).should('exist');

    cy.findByRole('progressbar').should('not.exist');

    cy.findByRole('heading', {
      name: /Verify your identity to apply for VR&E benefits/i,
    }).should('exist');

    cy.axeCheck();
  });
});
