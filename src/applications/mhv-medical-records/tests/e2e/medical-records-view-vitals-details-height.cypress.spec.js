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

  it('Vitals Details Height', () => {
    VitalsListPage.goToVitals();
    // click height link
    VitalsListPage.clickLinkByRecordListItem('Height');

    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      dateFormatWithoutTimezone(
        defaultVitals.entry[3].resource.effectiveDateTime,
      ),
      `${Math.floor(
        defaultVitals.entry[3].resource.valueQuantity.value / 12,
      )} feet, ${
        defaultVitals.entry[3].resource.valueQuantity.value % 12
      } inches`,
      defaultVitals.entry[3].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      dateFormatWithoutTimezone(
        defaultVitals.entry[13].resource.effectiveDateTime,
      ),
      `${Math.floor(
        defaultVitals.entry[13].resource.valueQuantity.value / 12,
      )} feet, ${
        defaultVitals.entry[13].resource.valueQuantity.value % 12
      } inches`,
      defaultVitals.entry[13].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      dateFormatWithoutTimezone(
        defaultVitals.entry[23].resource.effectiveDateTime,
      ),
      `${Math.floor(
        defaultVitals.entry[23].resource.valueQuantity.value / 12,
      )} feet, ${
        defaultVitals.entry[23].resource.valueQuantity.value % 12
      } inches`,
      defaultVitals.entry[23].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      dateFormatWithoutTimezone(
        defaultVitals.entry[33].resource.effectiveDateTime,
      ),
      `${Math.floor(
        defaultVitals.entry[33].resource.valueQuantity.value / 12,
      )} feet, ${
        defaultVitals.entry[33].resource.valueQuantity.value % 12
      } inches`,
      defaultVitals.entry[33].resource.contained[0].name,
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
