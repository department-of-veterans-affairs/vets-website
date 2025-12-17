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

  it('Vitals Details Temperature', () => {
    VitalsListPage.goToVitals();
    // click temperature link
    VitalsListPage.clickLinkByRecordListItem('Temperature');

    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      dateFormatWithoutTimezone(
        defaultVitals.entry[8].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[8].resource.valueQuantity.value} °F`,
      defaultVitals.entry[8].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      dateFormatWithoutTimezone(
        defaultVitals.entry[18].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[18].resource.valueQuantity.value} °F`,
      defaultVitals.entry[18].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      dateFormatWithoutTimezone(
        defaultVitals.entry[28].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[28].resource.valueQuantity.value} °F`,
      defaultVitals.entry[28].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      dateFormatWithoutTimezone(
        defaultVitals.entry[38].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[38].resource.valueQuantity.value} °F`,
      defaultVitals.entry[38].resource.contained[0].name,
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
