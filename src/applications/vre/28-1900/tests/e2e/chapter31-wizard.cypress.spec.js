import { CHAPTER_31_ROOT_URL, WIZARD_STATUS } from '../../constants';

describe('Chapter 31 wizard', () => {
  beforeEach(() => {
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
    sessionStorage.removeItem(WIZARD_STATUS);
    cy.visit(CHAPTER_31_ROOT_URL);
    cy.injectAxe();
  });
  it('should show the chapter 31 wizard', () => {
    cy.url().should('include', `${CHAPTER_31_ROOT_URL}/orientation`);
    cy.axeCheck();
    cy.get('h1').should(
      'have.text',
      'Apply for Veteran Readiness and Employment with VA Form 28-1900',
    );
    cy.findByRole('heading', { name: /Is this the form I need?/i }).should(
      'exist',
    );
    cy.axeCheck();
  });
  it('should fill out the wizard and orientation', () => {
    cy.url().should('include', `${CHAPTER_31_ROOT_URL}/orientation`);
    cy.axeCheck();
    cy.findByRole('radio', { name: /Veteran/i }).click();
    cy.findAllByRole('radio', { name: /Yes/i })
      .first()
      .click();
    cy.findAllByRole('radio', { name: /Yes/i })
      .last()
      .click();
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
    // TODO: Determine the source of the heading order violation and fix it
    cy.axeCheck({ skipHeadingOrderCheck: true });
  });
});
