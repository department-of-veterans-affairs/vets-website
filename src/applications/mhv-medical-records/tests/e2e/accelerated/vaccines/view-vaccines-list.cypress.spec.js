import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vaccines from '../pages/Vaccines';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vaccinesData from '../fixtures/vaccines/sample-lighthouse.json';

describe('Medical Records View Vaccines', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVaccines: true,
    });
    Vaccines.setIntercepts({ vaccinesData });
  });

  it('Visits View Vaccines List', () => {
    site.loadPage();

    Vaccines.goToVaccinesPage();

    cy.injectAxeThenAxeCheck();

    // fix this
    const CARDS_PER_PAGE = 10;
    cy.get(':nth-child(4) > [data-testid="record-list-item"]').should(
      'have.length',
      CARDS_PER_PAGE,
    );
  });
});
