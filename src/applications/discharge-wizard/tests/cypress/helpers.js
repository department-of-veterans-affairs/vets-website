export const ROOT = '/discharge-upgrade-instructions';
export const START_ID = 'duw-start-form';

export const SERVICE_BRANCH_INPUT = 'duw-service_branch';
export const DISCHARGE_YEAR_INPUT = 'duw-discharge_year';
export const DISCHARGE_MONTH_INPUT = 'duw-discharge_month';
export const REASON_INPUT = 'duw-reason';
export const INTENTION_INPUT = 'duw-intention';
export const COURT_MARTIAL_INPUT = 'duw-court_martial';
export const DISCHARGE_TYPE_INPUT = 'duw-discharge_type';
export const PREV_APPLICATION_INPUT = 'duw-prev_application';
export const PREV_APPLICATION_YEAR_INPUT = 'duw-prev_application_year';
export const PREV_APPLICATION_TYPE_INPUT = 'duw-prev_application_type';
export const FAILURE_TO_EXHAUST_INPUT = 'duw-failure_to_exhaust';
export const PRIOR_SERVICE_INPUT = 'duw-prior_service';
export const YEAR = '2024';

export const clickStart = () =>
  cy
    .findByTestId(START_ID)
    .should('be.visible')
    .click();

export const verifyUrl = link => cy.url().should('contain', `${ROOT}/${link}`);

export const get15YearsPast = () => (new Date().getFullYear() - 15).toString();

export const verifyFormErrorNotShown = selector =>
  cy
    .findByTestId(selector)
    .get('span[role="alert"]')
    .should('have.text', '');

export const checkFormAlertText = (selector, expectedValue) =>
  cy
    .findByTestId(selector)
    .get('span[role="alert"]')
    .should('be.visible')
    .should('have.text', expectedValue);

export const verifyElement = selector =>
  cy.findByTestId(selector).should('exist');

export const selectRadio = (selector, index) =>
  cy
    .findByTestId(selector)
    .should('exist')
    .get('[data-testid=va-radio-option]')
    .eq(index)
    .click();

export const selectDropdown = (selector, shortName, option) =>
  cy
    .findByTestId(selector)
    .shadow()
    .get(`select[name=${shortName}_dropdown]`)
    .select(option, { force: true });

export const clickBack = () =>
  cy
    .findByTestId('duw-buttonPair')
    .shadow()
    .get('va-button')
    .first()
    .should('be.visible')
    .click();

export const clickContinue = () =>
  cy
    .findByTestId('duw-buttonPair')
    .shadow()
    .get('va-button')
    .eq(1)
    .should('be.visible')
    .click();

export const typeInInput = (selector, value) =>
  cy
    .findByTestId(selector)
    .shadow()
    .get('input')
    .first()
    .click()
    .clear()
    .type(value, { force: true });
