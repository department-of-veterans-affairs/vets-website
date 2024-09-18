import * as h from '../helpers';
import { ROUTES } from '../../../../constants';
import { SHORT_NAME_MAP } from '../../../../constants/question-data-map';

describe('Discharge Upgrade Wizard: Discharge Update to form DD214 from DD215 Flow', () => {
  describe('Review edit flows', () => {
    it('Back and Continue with no answer change returns to review screen', () => {
      cy.visit(`${h.ROOT}/introduction1`);

      // Home
      h.verifyUrl(ROUTES.HOME);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // SERVICE_BRANCH
      h.verifyUrl(ROUTES.SERVICE_BRANCH);
      h.selectRadio(h.SERVICE_BRANCH_INPUT, 3);
      h.clickContinue();

      // DISCHARGE_YEAR
      h.verifyUrl(ROUTES.DISCHARGE_YEAR);
      h.selectDropdown(
        h.DISCHARGE_YEAR_INPUT,
        SHORT_NAME_MAP.DISCHARGE_YEAR,
        h.get15YearsPast(),
      );
      h.clickContinue();

      // DISCHARGE_MONTH
      h.verifyUrl(ROUTES.DISCHARGE_MONTH);
      h.selectDropdown(
        h.DISCHARGE_MONTH_INPUT,
        SHORT_NAME_MAP.DISCHARGE_MONTH,
        3,
      );
      h.clickContinue();

      // DISCHARGE_REASON
      h.verifyUrl(ROUTES.REASON);
      h.selectRadio(h.REASON_INPUT, 1);
      h.clickContinue();

      // INTENTION
      h.verifyUrl(ROUTES.INTENTION);
      h.selectRadio(h.INTENTION_INPUT, 1);
      h.clickContinue();

      // COURT_MARTIAL
      h.verifyUrl(ROUTES.COURT_MARTIAL);
      h.selectRadio(h.COURT_MARTIAL_INPUT, 1);
      h.clickContinue();

      // PREVIOUS_APPLICATION
      h.verifyUrl(ROUTES.PREV_APPLICATION);
      h.selectRadio(h.PREV_APPLICATION_INPUT, 0);
      h.clickContinue();

      // PREVIOUS_APPLICATION_YEAR
      h.verifyUrl(ROUTES.PREV_APPLICATION_YEAR);
      h.selectRadio(h.PREV_APPLICATION_YEAR_INPUT, 1);
      h.clickContinue();

      // PREVIOUS_APPLICATION_TYPE
      h.verifyUrl(ROUTES.PREV_APPLICATION_TYPE);
      h.selectRadio(h.PREV_APPLICATION_TYPE_INPUT, 2);
      h.clickContinue();

      // PRIOR_SERVICE
      h.verifyUrl(ROUTES.PRIOR_SERVICE);
      h.selectRadio(h.PRIOR_SERVICE_INPUT, 1);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${SHORT_NAME_MAP.SERVICE_BRANCH}"]`,
      )
        .shadow()
        .find('a')
        .click();

      // SERVICE_BRANCH
      h.verifyUrl(ROUTES.SERVICE_BRANCH);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${SHORT_NAME_MAP.SERVICE_BRANCH}"]`,
      )
        .shadow()
        .find('a')
        .click();

      // SERVICE_BRANCH
      h.verifyUrl(ROUTES.SERVICE_BRANCH);
      h.clickBack();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${SHORT_NAME_MAP.DISCHARGE_YEAR}"]`,
      )
        .shadow()
        .find('a')
        .click();

      // DISCHARGE_YEAR
      h.verifyUrl(ROUTES.DISCHARGE_YEAR);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${SHORT_NAME_MAP.DISCHARGE_YEAR}"]`,
      )
        .shadow()
        .find('a')
        .click();

      // DISCHARGE_YEAR
      h.verifyUrl(ROUTES.DISCHARGE_YEAR);
      h.clickBack();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${
          SHORT_NAME_MAP.DISCHARGE_MONTH
        }"]`,
      )
        .shadow()
        .find('a')
        .click();

      // DISCHARGE_MONTH
      h.verifyUrl(ROUTES.DISCHARGE_MONTH);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${
          SHORT_NAME_MAP.DISCHARGE_MONTH
        }"]`,
      )
        .shadow()
        .find('a')
        .click();

      // DISCHARGE_MONTH
      h.verifyUrl(ROUTES.DISCHARGE_MONTH);
      h.clickBack();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(`va-link[data-testid="duw-edit-link-${SHORT_NAME_MAP.REASON}"]`)
        .shadow()
        .find('a')
        .click();

      // REASON
      h.verifyUrl(ROUTES.REASON);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(`va-link[data-testid="duw-edit-link-${SHORT_NAME_MAP.REASON}"]`)
        .shadow()
        .find('a')
        .click();

      // REASON
      h.verifyUrl(ROUTES.REASON);
      h.clickBack();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(`va-link[data-testid="duw-edit-link-${SHORT_NAME_MAP.INTENTION}"]`)
        .shadow()
        .find('a')
        .click();

      // INTENTION
      h.verifyUrl(ROUTES.INTENTION);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(`va-link[data-testid="duw-edit-link-${SHORT_NAME_MAP.INTENTION}"]`)
        .shadow()
        .find('a')
        .click();

      // INTENTION
      h.verifyUrl(ROUTES.INTENTION);
      h.clickBack();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${SHORT_NAME_MAP.COURT_MARTIAL}"]`,
      )
        .shadow()
        .find('a')
        .click();

      // COURT_MARTIAL
      h.verifyUrl(ROUTES.COURT_MARTIAL);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${SHORT_NAME_MAP.COURT_MARTIAL}"]`,
      )
        .shadow()
        .find('a')
        .click();

      // COURT_MARTIAL
      h.verifyUrl(ROUTES.COURT_MARTIAL);
      h.clickBack();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${
          SHORT_NAME_MAP.PREV_APPLICATION
        }"]`,
      )
        .shadow()
        .find('a')
        .click();

      // PREV_APPLICATION
      h.verifyUrl(ROUTES.PREV_APPLICATION);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${
          SHORT_NAME_MAP.PREV_APPLICATION
        }"]`,
      )
        .shadow()
        .find('a')
        .click();

      // PREV_APPLICATION
      h.verifyUrl(ROUTES.PREV_APPLICATION);
      h.clickBack();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${
          SHORT_NAME_MAP.PREV_APPLICATION_YEAR
        }"]`,
      )
        .shadow()
        .find('a')
        .click();

      // PREV_APPLICATION_YEAR
      h.verifyUrl(ROUTES.PREV_APPLICATION_YEAR);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${
          SHORT_NAME_MAP.PREV_APPLICATION_YEAR
        }"]`,
      )
        .shadow()
        .find('a')
        .click();

      // PREV_APPLICATION_TYPE
      h.verifyUrl(ROUTES.PREV_APPLICATION_YEAR);
      h.clickBack();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${
          SHORT_NAME_MAP.PREV_APPLICATION_TYPE
        }"]`,
      )
        .shadow()
        .find('a')
        .click();

      // PREV_APPLICATION_TYPE
      h.verifyUrl(ROUTES.PREV_APPLICATION_TYPE);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${SHORT_NAME_MAP.PRIOR_SERVICE}"]`,
      )
        .shadow()
        .find('a')
        .click();

      // PRIOR_SERVICE
      h.verifyUrl(ROUTES.PRIOR_SERVICE);
      h.clickBack();

      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${SHORT_NAME_MAP.PRIOR_SERVICE}"]`,
      )
        .shadow()
        .find('a')
        .click();

      // PRIOR_SERVICE
      h.verifyUrl(ROUTES.PRIOR_SERVICE);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${SHORT_NAME_MAP.PRIOR_SERVICE}"]`,
      )
        .shadow()
        .find('a')
        .click();

      // PRIOR_SERVICE
      h.verifyUrl(ROUTES.PRIOR_SERVICE);
      h.clickBack();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
    });

    it('Clicking continue on branching question continues through the flow back to review screen', () => {
      cy.visit(`${h.ROOT}/introduction1`);

      // Home
      h.verifyUrl(ROUTES.HOME);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // SERVICE_BRANCH
      h.verifyUrl(ROUTES.SERVICE_BRANCH);
      h.selectRadio(h.SERVICE_BRANCH_INPUT, 3);
      h.clickContinue();

      // DISCHARGE_YEAR
      h.verifyUrl(ROUTES.DISCHARGE_YEAR);
      h.selectDropdown(
        h.DISCHARGE_YEAR_INPUT,
        SHORT_NAME_MAP.DISCHARGE_YEAR,
        '2024',
      );
      h.clickContinue();

      // DISCHARGE_REASON
      h.verifyUrl(ROUTES.REASON);
      h.selectRadio(h.REASON_INPUT, 5);
      h.clickContinue();

      // PREVIOUS_APPLICATION_TYPE
      h.verifyUrl(ROUTES.PREV_APPLICATION_TYPE);
      h.selectRadio(h.PREV_APPLICATION_TYPE_INPUT, 2);
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(
        `va-link[data-testid="duw-edit-link-${SHORT_NAME_MAP.DISCHARGE_YEAR}"]`,
      )
        .shadow()
        .find('a')
        .click();

      // DISCHARGE_YEAR
      h.verifyUrl(ROUTES.DISCHARGE_YEAR);
      h.selectDropdown(
        h.DISCHARGE_YEAR_INPUT,
        SHORT_NAME_MAP.DISCHARGE_YEAR,
        h.get15YearsPast(),
      );
      h.clickContinue();

      // DISCHARGE_MONTH
      h.verifyUrl(ROUTES.DISCHARGE_MONTH);
      h.selectDropdown(
        h.DISCHARGE_MONTH_INPUT,
        SHORT_NAME_MAP.DISCHARGE_MONTH,
        3,
      );
      h.clickContinue();

      // REVIEW
      h.verifyUrl(ROUTES.REVIEW);
      cy.get(`va-link[data-testid="duw-edit-link-${SHORT_NAME_MAP.REASON}"]`)
        .shadow()
        .find('a')
        .click();

      // REASON
      h.verifyUrl(ROUTES.REASON);
      h.selectRadio(h.REASON_INPUT, 0);
      h.clickContinue();

      // INTENTION
      h.verifyUrl(ROUTES.INTENTION);
    });
  });
});
