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

  it('Vitals Details Heart Rate', () => {
    VitalsListPage.goToVitals();
    // click heart rate link
    VitalsListPage.clickLinkByRecordListItem('Heart rate');

    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      dateFormatWithoutTimezone(
        defaultVitals.entry[4].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[4].resource.valueQuantity.value} beats per minute`,
      defaultVitals.entry[4].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      dateFormatWithoutTimezone(
        defaultVitals.entry[14].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[14].resource.valueQuantity.value} beats per minute`,
      defaultVitals.entry[14].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      dateFormatWithoutTimezone(
        defaultVitals.entry[24].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[24].resource.valueQuantity.value} beats per minute`,
      defaultVitals.entry[24].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      dateFormatWithoutTimezone(
        defaultVitals.entry[34].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[34].resource.valueQuantity.value} beats per minute`,
      defaultVitals.entry[34].resource.contained[0].name,
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
