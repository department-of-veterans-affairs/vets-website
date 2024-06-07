// import moment from 'moment';
// import 'moment/dist/locale/en';
// import moment.locale('en');
// import 'moment/min/locales';
import moment from 'moment/min/moment-with-locales';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';
import VitalsDetailsPage from './pages/VitalsDetailsPage';
import defaultVitals from '../fixtures/vitals.json';

moment.updateLocale('en', {
  meridiem: {
    am: 'a.m.',
    AM: 'A.M.',
    pm: 'p.m.',
    PM: 'P.M.',
  },
});

// moment.updateLocale('en', {
//   // Specify the callback function for
//   // customizing the values
//   meridiem: function (hour, minute, isLowercase) {
//         if (hour >= 12)
//             return isLowercase ? 'p.m.' : 'P.M.';
//         else
//             return isLowercase ? 'a.m.' : 'A.M.';
//     }
// });

describe('Medical Records Vitals Details Page', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    cy.visit('my-health/medical-records');
  });

  it('Vitals Details Blood Pressure', () => {
    VitalsListPage.goToVitals();
    // click vitals page Blood Pressure Link
    VitalsListPage.clickLinkByRecordListItemIndex(0);

    // // verify first reading
    // VitalsDetailsPage.verifyVitalReadingByIndex(
    //   0,
    //   'October', // 27, 2023, 7:00 a.m. PDT
    //   '130/70',
    //   'ADTP BURNETT',
    //   'None noted',
    // );

    // moment.updateLocale('en', {
    //   meridiem: function(hour, minute, isLowerCase) {
    //     if (hour < 12) {
    //       return 'a.m.';
    //     } else {
    //       return 'p.m.';
    //     }
    //   }
    // });

    // verify first reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      // moment(defaultVitals.entry[0].resource.effectiveDateTime).format(
      //   'MMMM D, YYYY hh:mm A',
      // ),
      // moment
      //   .parseZone(defaultVitals.entry[0].resource.effectiveDateTime)
      //   .format('l LT'),
      moment
        .parseZone(defaultVitals.entry[0].resource.effectiveDateTime)
        .format('MMMM D, YYYY, hh:mm a'),
      // .format('MMMM D, YYYY, hh:mm a'),
      '130/70',
      'ADTP BURNETT',
      'None noted',
    );

    // // verify first reading
    // VitalsDetailsPage.verifyVitalReadingByIndex(
    //   0,
    //   // moment(defaultVitals.entry[0].resource.effectiveDateTime).format(
    //   //   'MMMM D, YYYY hh:mm A',
    //   // ),
    //   moment
    //     .parseZone(defaultVitals.entry[0].resource.effectiveDateTime)
    //     .format('LLL'), // .format('l LT'),
    //   '130/70',
    //   'ADTP BURNETT',
    //   'None noted',
    // );

    // verify second reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      'August', // 4, 2023, 7:08 a.m. PDT
      '120/80',
      '23 HOUR OBSERVATION',
      'None noted',
    );

    // verify third reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      'August', // 18, 2022, 1:29 p.m. PDT
      '90/60',
      'ADMISSIONS (LOC)',
      'None noted',
    );

    // verify fourth reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      'May', // 11, 2021, 7:20 a.m. PDT
      '125/80',
      'ADTP SCREENING',
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
