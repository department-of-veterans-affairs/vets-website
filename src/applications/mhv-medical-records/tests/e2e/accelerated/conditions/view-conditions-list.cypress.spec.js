import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Conditions from '../pages/Conditions';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import conditionsData from '../fixtures/conditions/conditions.json';

describe('Medical Records View Conditions', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingConditions: true,
    });
    Conditions.setIntercepts({ conditionsData });
  });

  it('Visits View Conditions List', () => {
    site.loadPage();

    Conditions.goToConditionsPage();
    Conditions.verifyConditionsPageTitle();

    cy.injectAxeThenAxeCheck();

    // OH user, in the "accelerated" feature toggle group should see blue alert
    cy.get('[data-testid="cerner-facilities-info-alert"]').should('be.visible');

    const CARDS_PER_PAGE = 10;
    cy.get(':nth-child(4) > [data-testid="record-list-item"]').should(
      'have.length',
      CARDS_PER_PAGE,
    );
  });
});
