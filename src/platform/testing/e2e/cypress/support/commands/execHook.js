import { APP_SELECTOR, FORCE_OPTION, NO_LOG_OPTION } from '../index';

/**
 * Provides the default post hook to run for the given pathname.
 * @param {string} pathname - The pathname for the current URL.
 * @returns {function} The post hook to be invoked after all other page actions.
 */
const defaultPostHook = pathname => {
  // On review pages, check the privacy agreement box if it exists and submit.
  if (pathname.endsWith('/review-and-submit')) {
    return () => {
      cy.get(APP_SELECTOR, NO_LOG_OPTION).then($form => {
        const privacyAgreement = $form.find('input[name^="privacyAgreement"]');
        if (privacyAgreement.length) {
          cy.wrap(privacyAgreement)
            .first()
            .check(FORCE_OPTION);
        }
      });

      cy.findByText(/submit/i, { selector: 'button' }).click(FORCE_OPTION);
    };
  }

  // No-op on introduction and confirmation pages.
  if (pathname.match(/\/(introduction|confirmation)$/)) {
    return () => {};
  }

  // Everything else should click on the 'Continue' button.
  return () => {
    cy.findByText(/continue/i, { selector: 'button' }).click(FORCE_OPTION);
  };
};

/**
 * Runs the page hook if there is one for the current page.
 * @param {string} pathname - The pathname for the current URL.
 * @returns {boolean} Resolves true if a hook ran and false otherwise.
 */
Cypress.Commands.add('execHook', pathname => {
  cy.get('@pageHooks', NO_LOG_OPTION).then(pageHooks => {
    const hook = pageHooks?.[pathname];
    let hookExecuted = false;
    let postHook = defaultPostHook(pathname);

    if (!hook) return cy.wrap({ hookExecuted, postHook }, NO_LOG_OPTION);

    if (typeof hook !== 'function') {
      throw new Error(`Page hook for ${pathname} is not a function`);
    }

    // Give the page hook the option to set a custom post hook.
    const overridePostHook = fn => {
      if (typeof fn !== 'function') {
        throw new Error(`Post hook for ${pathname} is not a function`);
      }
      postHook = fn;
    };

    // Context object that's available all page hooks as the first argument.
    const context = {
      afterHook: overridePostHook,
      pathname,
    };

    const hookPromise = new Promise(resolve => {
      hook(context);
      hookExecuted = true;
      resolve({ hookExecuted, postHook });
    });

    return cy.wrap(hookPromise, NO_LOG_OPTION);
  });
});
