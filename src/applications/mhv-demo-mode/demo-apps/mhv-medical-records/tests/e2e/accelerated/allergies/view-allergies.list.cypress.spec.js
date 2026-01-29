import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Allergies from '../pages/Allergies';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import allergiesData from '../fixtures/allergies/uhd.json';

describe('Medical Records View Allergies List', () => {
  const site = new MedicalRecordsSite();
  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingAllergies: true,
    });
    Allergies.setIntercepts({ allergiesData });
  });

  afterEach(() => {});

  it('Visits View Allergies Page List', () => {
    site.loadPage();

    // check for MY Va Health links
    Allergies.checkLandingPageLinks();

    Allergies.goToAllergiesPage();

    cy.injectAxeThenAxeCheck();

    cy.get('[data-testid="record-list-item"]').should(
      'have.length.at.least',
      1,
    );

    Allergies.checkUnifiedAllergyListItem();
  });
});
