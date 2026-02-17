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

  it('Vitals Details Breathing Rate', () => {
    VitalsListPage.goToVitals();
    // click breathing rate Link
    VitalsListPage.clickLinkByRecordListItem('Breathing rate');

    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      dateFormatWithoutTimezone(
        defaultVitals.entry[7].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[7].resource.valueQuantity.value} breaths per minute`,
      defaultVitals.entry[7].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      dateFormatWithoutTimezone(
        defaultVitals.entry[17].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[17].resource.valueQuantity.value} breaths per minute`,
      defaultVitals.entry[17].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      dateFormatWithoutTimezone(
        defaultVitals.entry[27].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[27].resource.valueQuantity.value} breaths per minute`,
      defaultVitals.entry[27].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      dateFormatWithoutTimezone(
        defaultVitals.entry[37].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[37].resource.valueQuantity.value} breaths per minute`,
      defaultVitals.entry[37].resource.contained[0].name,
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
