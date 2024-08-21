import moment from 'moment';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import ChemHemDetailsPage from './pages/ChemHemDetailsPage';
import labsAndTests from './fixtures/labs-and-tests/labsAndTests.json';

describe('Medical Records View Labs And Tests', () => {
  it('Visits Medical Records View Labs And Tests Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    LabsAndTestsListPage.goToLabsAndTests();
    const record = labsAndTests.entry[1].resource;
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(3, labsAndTests.entry[1]);
    ChemHemDetailsPage.verifyLabName(record.contained[4].code.text);
    ChemHemDetailsPage.verifyLabDate(
      moment(record.contained[0].collection.collectedDateTime).format(
        'MMMM D, YYYY',
      ),
    );
    ChemHemDetailsPage.verifySampleTested(record.contained[0].type.text);
    ChemHemDetailsPage.verifyOrderedBy(
      `${record.contained[1].name[0].family}, ${
        record.contained[1].name[0].given[0]
      } ${record.contained[1].name[0].given[1]}`,
    );
    ChemHemDetailsPage.verifyLabCollectingLocation(record.contained[3].name);
    // There might be a new line in this provider notes example.  we need to check later
    ChemHemDetailsPage.verifyProviderNotesSingle(
      record.extension[0].valueString,
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
