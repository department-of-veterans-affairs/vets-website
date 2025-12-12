import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';
import VitalsDetailsPage from './pages/VitalsDetailsPage';
import defaultVitals from '../fixtures/vitals.json';
import { dateFormatWithoutTimezone } from '../../util/dateHelpers';

describe('Medical Records Vitals Details Page', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Vitals Details Weight', () => {
    VitalsListPage.goToVitals();
    // click weight link
    VitalsListPage.clickLinkByRecordListItem('Weight');

    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      dateFormatWithoutTimezone(
        defaultVitals.entry[9].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[9].resource.valueQuantity.value} pounds`,
      defaultVitals.entry[9].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      dateFormatWithoutTimezone(
        defaultVitals.entry[19].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[19].resource.valueQuantity.value} pounds`,
      defaultVitals.entry[19].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      dateFormatWithoutTimezone(
        defaultVitals.entry[29].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[29].resource.valueQuantity.value} pounds`,
      defaultVitals.entry[29].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      dateFormatWithoutTimezone(
        defaultVitals.entry[39].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[39].resource.valueQuantity.value} pounds`,
      defaultVitals.entry[39].resource.contained[0].name,
      'None recorded',
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });

  // afterEach(() => {
  //   VitalsDetailsPage.clickBreadCrumbsLink(0);
  // });
});
