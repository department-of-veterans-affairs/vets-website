import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import LabsAndTests from '../pages/LabsAndTests';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import labsAndTestData from '../fixtures/labsAndTests/uhd-with-radiology.json';
import imagingStudiesData from '../fixtures/labsAndTests/imaging-studies.json';
import thumbnailsData from '../fixtures/labsAndTests/imaging-thumbnails.json';
import dicomData from '../fixtures/labsAndTests/imaging-dicom.json';

describe('Medical Records - Unified Radiology Details', () => {
  const site = new MedicalRecordsSite();
  const mockDate = new Date(2025, 0, 25); // January 25, 2025

  context('with images loaded successfully', () => {
    beforeEach(() => {
      cy.clock(mockDate, ['Date']);
      site.login(oracleHealthUser, false);
      site.mockFeatureToggles({
        isAcceleratingEnabled: true,
        isAcceleratingLabsAndTests: true,
        isAcceleratingImagingStudies: true,
      });
      LabsAndTests.setIntercepts({ labsAndTestData });
      LabsAndTests.setImagingIntercepts({
        imagingStudiesData,
        thumbnailsData,
        dicomData,
      });
    });

    afterEach(() => {
      cy.clock().invoke('restore');
    });

    it('displays radiology detail fields after navigating from list', () => {
      site.loadPage();
      LabsAndTests.goToLabAndTestPage();

      // Wait for list to load and imaging studies to merge
      cy.wait('@labs-and-test-list');
      cy.wait('@imagingStudies');

      LabsAndTests.selectRadiologyRecord({
        labName: 'CT HEAD W/O CONTRAST',
      });

      LabsAndTests.verifyRadiologyDetailFields({
        name: 'CT HEAD W/O CONTRAST',
        testCode: 'Radiology',
        location: 'VA Portland HCS',
        orderedBy: 'Dr. Jane Smith',
      });

      cy.get('[data-testid="radiology-sample-tested"]').should(
        'contain.text',
        'CT scan',
      );

      cy.injectAxeThenAxeCheck();
    });

    it('shows the "View all images" link after thumbnails load', () => {
      site.loadPage();
      LabsAndTests.goToLabAndTestPage();

      cy.wait('@labs-and-test-list');
      cy.wait('@imagingStudies');

      LabsAndTests.selectRadiologyRecord({
        labName: 'CT HEAD W/O CONTRAST',
      });

      cy.wait('@imagingThumbnails');

      LabsAndTests.verifyViewAllImagesLink({ imageCount: 3 });

      cy.injectAxeThenAxeCheck();
    });
  });

  context('when thumbnail fetch fails', () => {
    beforeEach(() => {
      cy.clock(mockDate, ['Date']);
      site.login(oracleHealthUser, false);
      site.mockFeatureToggles({
        isAcceleratingEnabled: true,
        isAcceleratingLabsAndTests: true,
        isAcceleratingImagingStudies: true,
      });
      LabsAndTests.setIntercepts({ labsAndTestData });
      LabsAndTests.setImagingIntercepts({
        imagingStudiesData,
        thumbnailsData: [],
        dicomData,
        thumbnailsStatusCode: 500,
      });
    });

    afterEach(() => {
      cy.clock().invoke('restore');
    });

    it('shows an error alert when images cannot be loaded', () => {
      site.loadPage();
      LabsAndTests.goToLabAndTestPage();

      cy.wait('@labs-and-test-list');
      cy.wait('@imagingStudies');

      LabsAndTests.selectRadiologyRecord({
        labName: 'CT HEAD W/O CONTRAST',
      });

      cy.wait('@imagingThumbnails');

      LabsAndTests.verifyImageErrorAlert();

      cy.injectAxeThenAxeCheck();
    });
  });
});
