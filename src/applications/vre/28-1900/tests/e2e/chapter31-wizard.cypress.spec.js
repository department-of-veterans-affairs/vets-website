import { CHAPTER_31_ROOT_URL, WIZARD_STATUS } from '../../constants';

describe('Chapter 31 wizard', () => {
  beforeEach(() => {
    sessionStorage.removeItem(WIZARD_STATUS);
    cy.visit(CHAPTER_31_ROOT_URL);
    cy.injectAxe();
  });
  it('should show the chapter 31 wizard', () => {
    cy.url().should('include', `${CHAPTER_31_ROOT_URL}/start`);
    cy.axeCheck();
    cy.get('h1').should(
      'have.text',
      'Apply for Veteran Readiness and Employment with VA Form 28-1900',
    );
    cy.findByRole('heading', {
      name: /How do I know if this program is right for me?/i,
    }).should('exist');
    cy.axeCheck();
  });
  it('should fill out the wizard and orientation', () => {
    cy.url().should('include', `${CHAPTER_31_ROOT_URL}/start`);
    cy.axeCheck();
    cy.get('va-radio-option[value="isVeteran"]').click();
    cy.get('va-radio-option[value="yesHonorableDischarge"]').click();
    cy.get('va-radio-option[value="yesDisabilityRating"]').click();
    cy.axeCheck();
    cy.findByRole('button', {
      name: /Start VR&E orientation slideshow/i,
    }).click();
    cy.axeCheck();
    cy.findByRole('button', { name: /Next slide/i }).click();
    cy.axeCheck();
    cy.findByRole('button', { name: /Next slide/i }).click();
    cy.axeCheck();
    cy.findByRole('button', { name: /Next slide/i }).click();
    cy.axeCheck();
    cy.findByRole('button', { name: /Next slide/i }).click();
    cy.axeCheck();
    cy.findByRole('button', { name: /Next slide/i }).click();
    cy.axeCheck();
    cy.findByRole('button', { name: /Next slide/i }).click();
    cy.axeCheck();
    cy.findByRole('button', { name: /Next slide/i }).click();
    cy.axeCheck();
    cy.findByRole('button', { name: /Next slide/i }).click();
    cy.axeCheck();
    cy.findAllByRole('link', {
      name: /Apply for Veteran Readiness and Employment now/i,
    })
      .last()
      .click();
    cy.url().should('include', `${CHAPTER_31_ROOT_URL}/introduction`);
    cy.title().should(
      'eq',
      'Apply for Veteran Readiness and Employment Benefits | Veteran Affairs',
    );
    cy.axeCheck();
  });
});
