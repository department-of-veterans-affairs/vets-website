const testForm = (testDescription, testConfig) => {
  const runHook = pathname => {
    const hook = testConfig.pageHooks[pathname];
    if (!hook) return false;

    if (typeof hook !== 'function') {
      throw new Error(
        `Bad testConfig: Page hook for ${pathname} is not a function`,
      );
    }

    hook();
    return true;
  };

  const processPage = () => {
    cy.location('pathname', { log: false }).then(pathname => {
      if (!pathname.endsWith('review-and-submit')) {
        cy.wrap(
          new Promise(resolve => {
            // Run hooks if there are any for this page.
            // Otherwise, fill out the page as usual.
            if (!runHook(pathname)) cy.fillPage();
            resolve();
          }),
          { log: false },
        );

        cy.findByText(/continue/i, { selector: 'button' })
          .click()
          .location('pathname', { log: false })
          .then(newPathname => {
            if (pathname === newPathname) {
              throw new Error(`Expected to navigate away from ${pathname}`);
            }
          })
          .then(processPage);
      } else {
        cy.findByLabelText(/accept/i).click();
        cy.findByText(/submit/i, { selector: 'button' }).click();
      }
    });
  };

  describe(testDescription, () => {
    before(() => {
      cy.server()
        .route('GET', 'v0/maintenance_windows', [])
        .as('getMaintenanceWindows')
        .then(testConfig.setup);

      // Supplement array page objects from form config with regex patterns so that
      // we can match page URLs against them to determine if they're array pages.
      cy.wrap(
        testConfig.arrayPages.map(arrayPage => ({
          regex: new RegExp(arrayPage.path.replace(':index', '(\\d+)$')),
          ...arrayPage,
        })),
      ).as('arrayPageObjects');

      cy.wrap(testConfig.testData).as('testData');
    });

    beforeEach(() => {
      testConfig.setupPerTest(testConfig);
    });

    it('fills the form', () => {
      cy.visit(testConfig.url)
        .wait('@getMaintenanceWindows')
        .then(processPage);
    });
  });
};

export default testForm;
