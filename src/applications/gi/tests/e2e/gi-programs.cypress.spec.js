import data from '../data/calculator-constants.json';

describe('GI Bill Comparison Tool - Programs List', () => {
  beforeEach(() => {
    cy.intercept('GET', 'v1/gi/calculator_constants', {
      statusCode: 200,
      body: data,
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', {
      statusCode: 200,
    });
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'gi_comparison_tool_programs_toggle_flag',
            value: true,
          },
        ],
      },
    });
    // .as('featureToggles');
    cy.intercept(
      'GET',
      '**/v0/gi/institution_programs/search?type=NCD&facility_code=31800132&disable_pagination=true*',
      {
        statusCode: 200,
        body: [
          {
            id: '2614928',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'AGILE MANAGEMENT CERTIFICATE',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614929',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'ALTERNATIVE INVESTMENTS CERT',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614930',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'BUILDING DESIGN-ELECTRICAL CERTIFICATE',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614931',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'BUILDING DESIGN-HVAC CERTIFICATE',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614932',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'BUILDING DESIGN-PLUMBING CERTFICATE',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614933',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'BUILDING ELECTRICAL SYSTEMS DESIGN',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614934',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'BUILDINGS AND CONSTRUTION CERT',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614935',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'CLEAN ENERGY CERTIFICATE',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614936',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'COMMERICAL PROPERTY MANAGEMENT CERT',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614937',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'CORPORATE FINANCE CERTIFICATE',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614938',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'CREDIT RISK MANAGEMENT CERT',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614939',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'DATA VISUALIZATION CERTIFICATE',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614940',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'DEVELOPMENT AND LAND USE CERTIFICATE',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614941',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'DIGITAL FUNDRAISING CERTIFICATE',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614942',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'DIVERSITY-EQUALITY-INCLUSION CERTIFICATE',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614943',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'EFFECTIVE BUSINESS WRITING CERTIFICATE',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614944',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'EXECUTIVE COACHING CERTIFICATE',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614945',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'FINANCIAL PLANNING CERTIFICATE',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614946',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'FINTECH CERTIFICATE',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614947',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'FULL STACK WEB DEVELOPMENT CERT',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
          {
            id: '2614948',
            type: 'institution_programs',
            attributes: {
              programType: 'NCD',
              description: 'FUNDRAISING CERTIFICATE',
              facilityCode: '31800132',
              institutionName: 'NEW YORK UNIVERSITY',
              city: 'NEW YORK',
              state: 'NY',
              country: 'USA',
              preferredProvider: false,
              vaBah: 4525,
              dodBah: 4407,
              schoolClosing: false,
              schoolClosingOn: null,
              cautionFlags: [],
              ojtAppType: null,
            },
          },
        ],
      },
    );
    // .as('institutionPrograms');

    // cy.visit(
    //   'education/gi-bill-comparison-tool/institution/31800132/non-college-degree',
    // );

    // cy.wait('@institutionPrograms');
    // cy.wait('@featureToggles');
    // cy.get('a[data-testid="program-link"]', {
    //   timeout: 10000,
    // }).should('exist');
    // cy.get('a[data-testid="program-link"]', { timeout: 10000 })
    //   .first()
    //   .click();
  });
  it('should show a "no results" message when an invalid program name is searched', () => {
    cy.visit(
      'education/gi-bill-comparison-tool/institution/31800132/non-college-degree',
    );
    cy.injectAxeThenAxeCheck();
    cy.get('#search-input')
      .shadow()
      .find('input')
      .type('SomeRandomProgramName');
    cy.contains('button', 'Search').click();
    cy.get('#no-results-message')
      .should('be.visible')
      .and('contain', 'We didn’t find any results for');
  });
  // it('should clear the search query and display all programs when "Reset search" is clicked', () => {
  //   cy.injectAxeThenAxeCheck();
  //   cy.get('#search-input')
  //     .shadow()
  //     .find('input')
  //     .type('ACCOUNTING');
  //   cy.contains('button', 'Search').click();
  //   cy.contains('button', 'Reset search').click();
  //   cy.get('#search-input')
  //     .shadow()
  //     .find('input')
  //     .should('have.value', '')
  //     .should('be.focused');
  //   cy.get('[data-testid="program-list-item"]').should('have.length', 20);
  // });
  // it('should display relevant results when a user searches for "ACCOUNTING"', () => {
  //   cy.injectAxeThenAxeCheck();
  //   cy.get('#search-input')
  //     .shadow()
  //     .find('input')
  //     .type('ACCOUNTING');
  //   cy.contains('button', 'Search').click();
  //   cy.get('#results-summary').should('contain', 'ACCOUNTING');
  //   cy.get('[data-testid="program-list-item"]').should('have.length', 4);
  //   cy.get('[data-testid="program-list-item"]')
  //     .first()
  //     .should('contain', 'ACCOUNTING-CPA TRACK-BS');
  // });
  // it('displays an error if the user tries to search with an empty input', () => {
  //   cy.injectAxeThenAxeCheck();
  //   cy.get('#search-input')
  //     .shadow()
  //     .find('input')
  //     .type(' ');
  //   cy.contains('button', 'Search').click();
  //   cy.get('[class="usa-error-message"]')
  //     .should(
  //       'contain',
  //       'Please fill in a program name and then select search.',
  //     )
  //     .should('exist');
  // });
  // it('paginates correctly when there are more than 20 programs', () => {
  //   cy.injectAxeThenAxeCheck();
  //   cy.get('va-pagination').should('exist');
  //   cy.get('#results-summary').should('contain', 'Showing 1-20');
  //   cy.get('va-pagination')
  //     .shadow()
  //     .find('[aria-label="Next page"]')
  //     .click();
  //   cy.get('#results-summary').should('contain', 'Showing 21-');
  // });
});
