import { Locators } from '../utils/constants';

class SharedComponents {
  backBreadcrumb = () => {
    return cy.findByTestId(Locators.BACK_BREADCRUMB_DATA_TEST_ID);
  };

  clickBackBreadcrumb = () => {
    this.backBreadcrumb()
      .should('exist')
      .scrollIntoView({
        waitForAnimation: true,
      })
      .then($el => {
        const tagName = $el[0]?.tagName?.toLowerCase();

        if (tagName === 'va-link') {
          // Web component: click the interactive element inside shadow DOM
          cy.wrap($el)
            .shadow()
            .find('a, button')
            .first()
            .click({ force: true });
          return;
        }

        cy.wrap($el).click({ force: true });
      });
  };

  /**
   * Assert that the Back breadcrumb has the correct label.
   * Handles both <va-link> (web component) and <a> (plain anchor).
   */
  assertBackBreadcrumbLabel = () => {
    this.backBreadcrumb().then($el => {
      const tagName = $el[0]?.tagName?.toLowerCase();

      if (tagName === 'va-link') {
        // Web component: assert the text attribute contains "Back"
        cy.wrap($el)
          .invoke('attr', 'text')
          .should('include', 'Back');
        return;
      }

      // Plain anchor: assert text content contains "Back"
      cy.wrap($el).should('contain.text', 'Back');
    });
  };
}

export default new SharedComponents();
