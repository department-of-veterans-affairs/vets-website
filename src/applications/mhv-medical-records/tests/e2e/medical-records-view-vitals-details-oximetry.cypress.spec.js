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

  it('Vitals Details Pulse Oximetry', () => {
    VitalsListPage.goToVitals();
    // click pulse oximetry link
    // Passing in a truncated version of the heading for the test
    VitalsListPage.clickLinkByRecordListItem('Blood oxygen level');

    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      dateFormatWithoutTimezone(
        defaultVitals.entry[6].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[6].resource.valueQuantity.value}%`,
      defaultVitals.entry[6].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      dateFormatWithoutTimezone(
        defaultVitals.entry[16].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[16].resource.valueQuantity.value}%`,
      defaultVitals.entry[16].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      dateFormatWithoutTimezone(
        defaultVitals.entry[26].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[26].resource.valueQuantity.value}%`,
      defaultVitals.entry[26].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      dateFormatWithoutTimezone(
        defaultVitals.entry[36].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[36].resource.valueQuantity.value}%`,
      defaultVitals.entry[36].resource.contained[0].name,
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
