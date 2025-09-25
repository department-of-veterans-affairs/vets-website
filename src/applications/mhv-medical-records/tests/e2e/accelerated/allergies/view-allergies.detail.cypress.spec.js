import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Allergies from '../pages/Allergies';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import allergiesData from '../fixtures/allergies/uhd.json';

describe('Medical Records View Allergies Detail', () => {
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

  it('Visits View Allergies Detail Page', () => {
    site.loadPage();

    // check for MY Va Health links
    Allergies.checkLandingPageLinks();

    Allergies.goToAllergiesPage();

    cy.injectAxeThenAxeCheck();

    const ALLERGY_INDEX = 0;
    Allergies.checkUnifiedAllergyListItem({ index: ALLERGY_INDEX });
    Allergies.selectAllergy({ index: ALLERGY_INDEX });
    Allergies.validateAllergyDetailPage();
  });
});
