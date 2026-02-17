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

  it('Vitals Details Blood Pressure', () => {
    VitalsListPage.goToVitals();
    // click blood pressure Link
    VitalsListPage.clickLinkByRecordListItem('Blood pressure');

    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      dateFormatWithoutTimezone(
        defaultVitals.entry[0].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[0].resource.component[0].valueQuantity.value}/${defaultVitals.entry[0].resource.component[1].valueQuantity.value}`,
      defaultVitals.entry[0].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      dateFormatWithoutTimezone(
        defaultVitals.entry[10].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[10].resource.component[0].valueQuantity.value}/${defaultVitals.entry[10].resource.component[1].valueQuantity.value}`,
      defaultVitals.entry[10].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      dateFormatWithoutTimezone(
        defaultVitals.entry[20].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[20].resource.component[0].valueQuantity.value}/${defaultVitals.entry[20].resource.component[1].valueQuantity.value}`,
      defaultVitals.entry[20].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      dateFormatWithoutTimezone(
        defaultVitals.entry[30].resource.effectiveDateTime,
      ),
      `${defaultVitals.entry[30].resource.component[0].valueQuantity.value}/${defaultVitals.entry[30].resource.component[1].valueQuantity.value}`,
      defaultVitals.entry[30].resource.contained[0].name,
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
