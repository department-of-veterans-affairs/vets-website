// When uninitialized, cy.syncFixtures will clean the temp dir where
// fixtures are getting loaded. After initialization, subsequent calls
// to cy.syncFixtures will continue syncing fixtures under the temp dir.
let initialized = false;

/**
 * Runs task to sync fixtures under a temp path in the Cypress fixtures folder
 * then overwrites `cy.fixture` and the fixture shorthand in `cy.route`
 * to look for fixtures under that temp path.
 */
Cypress.Commands.add('syncFixtures', fixtures => {
  const args = { fixtures, initialized };
  const opts = { log: false };

  cy.task('_syncFixtures', args, opts).then(dir => {
    if (!initialized) {
      // `cy.fixture` should look for fixtures under the temp path.
      Cypress.Commands.overwrite('fixture', (originalFn, path, options) =>
        originalFn(`${dir}/${path}`, options),
      );

      // The fixture shorthand in `cy.route` should be relative to temp path.
      Cypress.Commands.overwrite(
        'route',
        (originalFn, method, url, response, options) => {
          const modifiedResponse =
            typeof response === 'string'
              ? response.replace(
                  /^(fx:|fixture:)/,
                  (_, pattern) => `${pattern}${dir}/`,
                )
              : response;

          return originalFn(method, url, modifiedResponse, options);
        },
      );

      initialized = true;
    }
  });

  Cypress.log({
    consoleProps: () => ({ fixtures }),
  });
});
