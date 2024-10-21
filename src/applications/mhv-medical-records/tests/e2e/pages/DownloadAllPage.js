class DownloadAllPage {
  verifyBreadcrumbs = breadcrumbs => {
    cy.get('[data-testid="breadcrumbs"]').contains(breadcrumbs, {
      matchCase: false,
    });
  };

  clickBreadcrumbs = breadcrumb => {
    cy.get('[data-testid="breadcrumbs"]')
      .find('span')
      .contains(breadcrumb)
      .parent()
      .click();
  };
}
export default new DownloadAllPage();
