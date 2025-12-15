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

    const CARDS_PER_PAGE = 10;
    cy.get(':nth-child(4) > [data-testid="record-list-item"]').should(
      'have.length',
      CARDS_PER_PAGE,
    );
  });
});
