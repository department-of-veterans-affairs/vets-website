class DownloadAllPage {
  verifyBreadcrumbs = breadcrumbs => {
    cy.get('[data-testid="breadcrumbs"]').contains(breadcrumbs, {
      matchCase: false,
    });
  };

  clickBreadcrumbs = () => {
    cy.get('[data-testid="breadcrumbs"]')
      .find('a')
      .click();
  };
}
export default new DownloadAllPage();
