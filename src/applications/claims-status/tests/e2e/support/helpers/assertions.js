/**
 * Asserts page title, breadcrumbs, and heading for claims-status pages.
 * Automatically includes "VA.gov home" as first breadcrumb and "Check your claims and appeals" as second.
 *
 * @param {Object} options - Assertion options
 * @param {string} options.title - Expected document title
 * @param {Object} [options.secondBreadcrumb] - Optional override for second breadcrumb
 * @param {Object} [options.thirdBreadcrumb] - Optional third breadcrumb {name, href}
 * @param {string} options.heading - Expected h1 heading text {name, level}
 */
export const verifyTitleBreadcrumbsHeading = ({
  title,
  secondBreadcrumb = {
    // TODO: Create issue for: Each breadcrumb segment should use the full page title
    name: 'Check your claims and appeals',
    href: '/your-claims',
  },
  thirdBreadcrumb,
  heading,
}) => {
  cy.title().should('eq', title);

  // Build breadcrumbs array, conditionally including third breadcrumb
  const allBreadcrumbs = [
    { name: 'VA.gov home', href: '/' },
    secondBreadcrumb,
    ...(thirdBreadcrumb ? [thirdBreadcrumb] : []),
  ];

  cy.get('va-breadcrumbs')
    .shadow()
    .within(() => {
      allBreadcrumbs.forEach(({ name, href }) => {
        cy.findByRole('link', { name }).should('have.attr', 'href', href);
      });
    });

  cy.findByRole('heading', {
    name: heading.name,
    level: heading.level || 1,
  });
};

/**
 * Verifies the "Need help?" section.
 */
export const verifyNeedHelp = () => {
  cy.get('va-need-help').shadow().findByRole('heading', {
    name: 'Need help?',
  });

  cy.get('va-need-help').within(() => {
    cy.contains('Call the VA benefits hotline at').should('be.visible');
    cy.get('va-telephone[contact="8008271000"]')
      .shadow()
      .should('have.text', '800-827-1000');
    cy.contains(
      "We're here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET",
    ).should('be.visible');
    cy.get('va-telephone[contact="711"]')
      .shadow()
      .should('have.text', 'TTY: 711');
  });
};
