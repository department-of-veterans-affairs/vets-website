import moment from 'moment';
// import 'moment/dist/locale/en';
// import moment.locale('en');
// import 'moment/min/locales';
// import moment from 'moment/min/moment-with-locales';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';
import VitalsDetailsPage from './pages/VitalsDetailsPage';
import defaultVitals from '../fixtures/vitals.json';

describe('Medical Records Vitals Details Page', () => {
  const site = new MedicalRecordsSite();
  // var dateExample =
  beforeEach(() => {
    site.login();
    cy.visit('my-health/medical-records');
  });

  it('Vitals Details Blood Pressure', () => {
    VitalsListPage.goToVitals();
    // click vitals page Blood Pressure Link
    VitalsListPage.clickLinkByRecordListItemIndex(0);

    // verify first reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      moment
        .parseZone(defaultVitals.entry[0].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '130/70', // result
      `${defaultVitals.entry[0].resource.component[0].valueQuantity.value}/${
        defaultVitals.entry[0].resource.component[1].valueQuantity.value
      }`,
      // 'ADTP BURNETT', // LOCATION
      defaultVitals.entry[0].resource.contained[0].name,
      // Provider Notes
      'None noted',
    );

    // verify second reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      // 'August', // 4, 2023, 7:08 a.m. PDT
      moment
        .parseZone(defaultVitals.entry[10].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '120/80', // result
      `${defaultVitals.entry[10].resource.component[0].valueQuantity.value}/${
        defaultVitals.entry[10].resource.component[1].valueQuantity.value
      }`,
      // '23 HOUR OBSERVATION', // Location
      defaultVitals.entry[10].resource.contained[0].name,
      'None noted',
    );

    // verify third reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      // 'August', // 18, 2022, 1:29 p.m. PDT
      moment
        .parseZone(defaultVitals.entry[20].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '90/60', // result
      `${defaultVitals.entry[20].resource.component[0].valueQuantity.value}/${
        defaultVitals.entry[20].resource.component[1].valueQuantity.value
      }`,
      // 'ADMISSIONS (LOC)', // Location
      defaultVitals.entry[20].resource.contained[0].name,
      'None noted',
    );

    // verify fourth reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      // 'May', // 11, 2021, 7:20 a.m. PDT
      moment
        .parseZone(defaultVitals.entry[30].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '125/80', // result
      `${defaultVitals.entry[30].resource.component[0].valueQuantity.value}/${
        defaultVitals.entry[30].resource.component[1].valueQuantity.value
      }`,
      // 'ADTP SCREENING', // Location
      defaultVitals.entry[30].resource.contained[0].name,
      'None noted',
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });

  // afterEach(() => {
  //   VitalsDetailsPage.clickBreadCrumbsLink(0);
  // });
});
