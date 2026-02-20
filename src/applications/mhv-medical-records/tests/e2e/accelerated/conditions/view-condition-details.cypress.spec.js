import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Conditions from '../pages/Conditions';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import conditionsData from '../fixtures/conditions/conditions.json';

describe('Medical Records View Condition Details', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingConditions: true,
    });
    Conditions.setIntercepts({ conditionsData });
  });

  it('Visits Condition Details Page', () => {
    site.loadPage();

    Conditions.goToConditionsPage();
    Conditions.verifyConditionsPageTitle();

    // Click on the first Condition to view details
    Conditions.clickConditionDetailsLink(0);

    // Verify condition details are displayed correctly (last item in fixture has latest date)
    const lastIndex = conditionsData.data.length - 1;
    const conditionDetailData = conditionsData.data[lastIndex].attributes;

    Conditions.verifyTitle(conditionDetailData.name);
    Conditions.verifyProvider(conditionDetailData.provider);
    Conditions.verifyLocation(conditionDetailData.facility);
    // Conditions.verifyProviderNotes(conditionDetailData.comments[0]);
    Conditions.verifyProviderNotesList(conditionDetailData.comments[0]);
    Conditions.verifyProviderNotesList(conditionDetailData.comments[1]);

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');

    // Verify date text is present without dealing with time zone changes
    cy.findByText(/Date entered:/).findByText(/January \d{2}, 2025/);

    // Accessibility check
    cy.injectAxeThenAxeCheck();
  });

  it('Navigates back to Conditions list from details page', () => {
    site.loadPage();
    Conditions.goToConditionsPage();
    Conditions.verifyConditionsPageTitle();
    Conditions.clickConditionDetailsLink(0);

    // Verify condition details are displayed correctly (last item in fixture has latest date)
    const lastIndex = conditionsData.data.length - 1;
    const conditionDetailData = conditionsData.data[lastIndex].attributes;

    Conditions.verifyTitle(conditionDetailData.name);
    Conditions.verifyProvider(conditionDetailData.provider);
    Conditions.verifyLocation(conditionDetailData.facility);
    Conditions.verifyProviderNotesList(conditionDetailData.comments[0]);
    Conditions.verifyProviderNotesList(conditionDetailData.comments[1]);

    // Navigate back to list
    cy.get('[data-testid="mr-breadcrumbs"] > a').click();

    // Verify we're back on the Conditions list page
    cy.url().should('include', '/conditions');
    cy.findAllByTestId('record-list-item').should('be.visible');

    // Accessibility check
    cy.injectAxeThenAxeCheck();
  });
});
