import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import LabsAndTests from '../pages/LabsAndTests';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import labsAndTestData from '../fixtures/labsAndTests/multiple-pages.json';

describe('Medical Records View Lab and Tests', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: true,
      isAcceleratingLabsAndTests: true,
    });
    LabsAndTests.setIntercepts({ labsAndTestData });
  });

  it('Visits View Labs And Test Page List', () => {
    site.loadPage();

    // // check for MY Va Health links
    LabsAndTests.checkLandingPageLinks();

    LabsAndTests.goToLabAndTestPage();

    const today = new Date();
    const timeFrame = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
    LabsAndTests.checkUrl({ timeFrame });

    cy.injectAxeThenAxeCheck();

    LabsAndTests.loadVAPaginationNext();
    const CARDS_PER_PAGE = 1;
    cy.get(':nth-child(4) > [data-testid="record-list-item"]').should(
      'have.length',
      CARDS_PER_PAGE,
    );
    cy.get("[data-testid='filter-display-message']").should('be.visible');
    cy.get("[data-testid='filter-display-message']").should('not.be.empty');

    // go to a specific lab
    LabsAndTests.selectLabAndTest({
      labName: 'CBC w/ Diff',
    });

    cy.get('[data-testid="mr-breadcrumbs"] > a')
      .should('have.attr', 'href')
      .and('include', '&timeFrame=');
    cy.get('[data-testid="mr-breadcrumbs"] > a')
      .should('have.attr', 'href')
      .and('include', '?page');

    cy.get('[data-testid="mr-breadcrumbs"] > a').click({
      waitForAnimations: true,
    });
    cy.get(':nth-child(4) > [data-testid="record-list-item"]').should(
      'have.length',
      CARDS_PER_PAGE,
    );
  });
});
