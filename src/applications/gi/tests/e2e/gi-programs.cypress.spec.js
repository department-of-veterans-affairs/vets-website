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
    }).as('featureToggles');
    // cy.intercept('GET', '**/v1/gi/institutions/318Z0032*', {
    //   statusCode: 200,
    //   body: {
    //     data: {
    //       id: '36323753',
    //       type: 'institutions',
    //       attributes: {
    //         name: 'NEW YORK INSTITUTE OF TECHNOLOGY-NYC',
    //         facilityCode: '318Z0032',
    //         type: 'PRIVATE',
    //         city: 'NEW YORK',
    //         state: 'NY',
    //         zip: '10023',
    //         country: 'USA',
    //         bah: 4525,
    //         cross: '194091',
    //         flight: false,
    //         correspondence: false,
    //         ope: '00278201',
    //         ope6: '02782',
    //         schoolSystemName: null,
    //         schoolSystemCode: null,
    //         alias: 'New York Tech',
    //         highestDegree: 4,
    //         localeType: 'suburban',
    //         address1: '1855 BROADWAY',
    //         address2: null,
    //         address3: null,
    //         studentCount: null,
    //         undergradEnrollment: 3279,
    //         yr: true,
    //         studentVeteran: true,
    //         studentVeteranLink: null,
    //         poe: true,
    //         eightKeys: null,
    //         stemOffered: false,
    //         dodmou: true,
    //         sec702: null,
    //         vetSuccessName: null,
    //         vetSuccessEmail: null,
    //         creditForMilTraining: true,
    //         vetPoc: true,
    //         studentVetGrpIpeds: true,
    //         socMember: true,
    //         retentionRateVeteranBa: null,
    //         retentionAllStudentsBa: 0.7709,
    //         retentionRateVeteranOtb: null,
    //         retentionAllStudentsOtb: null,
    //         persistanceRateVeteranBa: null,
    //         persistanceRateVeteranOtb: null,
    //         graduationRateVeteran: null,
    //         graduationRateAllStudents: 0.5518,
    //         transferOutRateVeteran: null,
    //         transferOutRateAllStudents: null,
    //         salaryAllStudents: 70080,
    //         repaymentRateAllStudents: 0.5828092243,
    //         avgStuLoanDebt: 23334,
    //         calendar: 'semesters',
    //         tuitionInState: 42000,
    //         tuitionOutOfState: 42000,
    //         books: 1380,
    //         onlineAll: true,
    //         p911TuitionFees: 460325.76,
    //         p911Recipients: 24,
    //         p911YellowRibbon: 59208.5,
    //         p911YrRecipients: 13,
    //         accredited: true,
    //         accreditationType: 'regional',
    //         accreditationStatus: null,
    //         cautionFlag: null,
    //         cautionFlagReason: null,
    //         cautionFlags: [],
    //         complaints: {
    //           facilityCode: null,
    //           financialByFacCode: null,
    //           qualityByFacCode: null,
    //           refundByFacCode: null,
    //           marketingByFacCode: null,
    //           accreditationByFacCode: null,
    //           degreeRequirementsByFacCode: null,
    //           studentLoansByFacCode: null,
    //           gradesByFacCode: null,
    //           creditTransferByFacCode: null,
    //           creditJobByFacCode: null,
    //           jobByFacCode: null,
    //           transcriptByFacCode: null,
    //           otherByFacCode: null,
    //           mainCampusRollUp: null,
    //           financialByOpeIdDoNotSum: null,
    //           qualityByOpeIdDoNotSum: null,
    //           refundByOpeIdDoNotSum: null,
    //           marketingByOpeIdDoNotSum: null,
    //           accreditationByOpeIdDoNotSum: null,
    //           degreeRequirementsByOpeIdDoNotSum: null,
    //           studentLoansByOpeIdDoNotSum: null,
    //           gradesByOpeIdDoNotSum: null,
    //           creditTransferByOpeIdDoNotSum: null,
    //           jobsByOpeIdDoNotSum: null,
    //           transcriptByOpeIdDoNotSum: null,
    //           otherByOpeIdDoNotSum: null,
    //         },
    //         schoolClosing: false,
    //         schoolClosingOn: null,
    //         schoolClosingMessage: null,
    //         yellowRibbonPrograms: [
    //           {
    //             city: 'New York',
    //             contributionAmount: '99999.0',
    //             correspondence: false,
    //             country: 'USA',
    //             degreeLevel: 'All',
    //             distanceLearning: true,
    //             divisionProfessionalSchool: 'All',
    //             facilityCode: '318Z0032',
    //             institutionId: 36323753,
    //             insturl: 'www.nyit.edu/',
    //             latitude: 40.76968835,
    //             longitude: -73.9825379419152,
    //             numberOfStudents: 99999,
    //             nameOfInstitution: 'NEW YORK INSTITUTE OF TECHNOLOGY-NYC',
    //             onlineOnly: false,
    //             state: 'NY',
    //             streetAddress: '1855 Broadway',
    //             studentVeteran: true,
    //             studentVeteranLink: null,
    //             ungeocodable: false,
    //             yearOfYrParticipation: null,
    //             zip: null,
    //           },
    //         ],
    //         independentStudy: false,
    //         priorityEnrollment: true,
    //         createdAt: '2025-01-29T14:12:09.000Z',
    //         updatedAt: '2025-01-29T14:12:09.000Z',
    //         physicalAddress1: '1855 BROADWAY',
    //         physicalAddress2: null,
    //         physicalAddress3: null,
    //         physicalCity: 'NEW YORK',
    //         physicalState: 'NY',
    //         physicalCountry: 'USA',
    //         onlineOnly: false,
    //         distanceLearning: true,
    //         dodBah: 4407,
    //         physicalZip: '10023',
    //         parentFacilityCodeId: null,
    //         campusType: 'Y',
    //         vetTecProvider: false,
    //         preferredProvider: false,
    //         stemIndicator: false,
    //         facilityMap: {
    //           main: {
    //             institution: {
    //               id: 36323753,
    //               version: {
    //                 number: 502,
    //                 createdAt: '2025-01-29T14:11:53.094Z',
    //                 preview: false,
    //               },
    //               institutionTypeName: 'PRIVATE',
    //               facilityCode: '318Z0032',
    //               institution: 'NEW YORK INSTITUTE OF TECHNOLOGY-NYC',
    //               city: 'NEW YORK',
    //               state: 'NY',
    //               zip: '10023',
    //               country: 'USA',
    //               flight: false,
    //               correspondence: false,
    //               bah: 4525,
    //               cross: '194091',
    //               ope: '00278201',
    //               ope6: '02782',
    //               insturl: 'www.nyit.edu/',
    //               vetTuitionPolicyUrl: null,
    //               predDegreeAwarded: 3,
    //               locale: 21,
    //               gibill: null,
    //               undergradEnrollment: 3279,
    //               yr: true,
    //               studentVeteran: true,
    //               studentVeteranLink: null,
    //               poe: true,
    //               eightKeys: null,
    //               dodmou: true,
    //               sec702: null,
    //               vetsuccessName: null,
    //               vetsuccessEmail: null,
    //               creditForMilTraining: true,
    //               vetPoc: true,
    //               studentVetGrpIpeds: true,
    //               socMember: true,
    //               vaHighestDegreeOffered: '4-year',
    //               retentionRateVeteranBa: null,
    //               retentionAllStudentsBa: 0.7709,
    //               retentionRateVeteranOtb: null,
    //               retentionAllStudentsOtb: null,
    //               persistanceRateVeteranBa: null,
    //               persistanceRateVeteranOtb: null,
    //               graduationRateVeteran: null,
    //               graduationRateAllStudents: 0.5518,
    //               transferOutRateVeteran: null,
    //               transferOutRateAllStudents: null,
    //               salaryAllStudents: 70080,
    //               repaymentRateAllStudents: 0.5828092243,
    //               avgStuLoanDebt: 23334,
    //               calendar: 'semesters',
    //               tuitionInState: 42000,
    //               tuitionOutOfState: 42000,
    //               books: 1380,
    //               onlineAll: true,
    //               p911TuitionFees: 460325.76,
    //               p911Recipients: 24,
    //               p911YellowRibbon: 59208.5,
    //               p911YrRecipients: 13,
    //               accredited: true,
    //               accreditationType: 'regional',
    //               accreditationStatus: null,
    //               cautionFlag: null,
    //               cautionFlagReason: null,
    //               complaints: {
    //                 facilityCode: null,
    //                 financialByFacCode: null,
    //                 qualityByFacCode: null,
    //                 refundByFacCode: null,
    //                 marketingByFacCode: null,
    //                 accreditationByFacCode: null,
    //                 degreeRequirementsByFacCode: null,
    //                 studentLoansByFacCode: null,
    //                 gradesByFacCode: null,
    //                 creditTransferByFacCode: null,
    //                 creditJobByFacCode: null,
    //                 jobByFacCode: null,
    //                 transcriptByFacCode: null,
    //                 otherByFacCode: null,
    //                 mainCampusRollUp: null,
    //                 financialByOpeIdDoNotSum: null,
    //                 qualityByOpeIdDoNotSum: null,
    //                 refundByOpeIdDoNotSum: null,
    //                 marketingByOpeIdDoNotSum: null,
    //                 accreditationByOpeIdDoNotSum: null,
    //                 degreeRequirementsByOpeIdDoNotSum: null,
    //                 studentLoansByOpeIdDoNotSum: null,
    //                 gradesByOpeIdDoNotSum: null,
    //                 creditTransferByOpeIdDoNotSum: null,
    //                 jobsByOpeIdDoNotSum: null,
    //                 transcriptByOpeIdDoNotSum: null,
    //                 otherByOpeIdDoNotSum: null,
    //               },
    //               schoolClosing: false,
    //               schoolClosingOn: null,
    //               schoolClosingMessage: null,
    //               stemOffered: false,
    //               priorityEnrollment: true,
    //               onlineOnly: false,
    //               independentStudy: false,
    //               distanceLearning: true,
    //               address1: '1855 BROADWAY',
    //               address2: null,
    //               address3: null,
    //               physicalAddress1: '1855 BROADWAY',
    //               physicalAddress2: null,
    //               physicalAddress3: null,
    //               physicalCity: 'NEW YORK',
    //               physicalState: 'NY',
    //               physicalZip: '10023',
    //               physicalCountry: 'USA',
    //               dodBah: 4407,
    //               approved: true,
    //               vetTecProvider: false,
    //               closure109: null,
    //               preferredProvider: false,
    //               stemIndicator: false,
    //               campusType: 'Y',
    //               parentFacilityCodeId: null,
    //               versionId: 603,
    //               compliesWithSec103: true,
    //               solelyRequiresCoe: true,
    //               requiresCoeAndCriteria: null,
    //               countOfCautionFlags: 0,
    //               section103Message: 'Yes',
    //               pooStatus: 'APRVD',
    //               hbcu: 0,
    //               hcm2: 0,
    //               menonly: 0,
    //               pctfloan: 0.4616,
    //               relaffil: null,
    //               womenonly: 0,
    //               hsi: 0,
    //               nanti: 0,
    //               annhi: 0,
    //               aanapii: 1,
    //               pbi: 0,
    //               tribal: 0,
    //               ungeocodable: false,
    //               distance: null,
    //             },
    //             branches: [],
    //             extensions: [],
    //           },
    //         },
    //         programs: [],
    //         programTypes: ['IHL'],
    //         versionedSchoolCertifyingOfficials: [
    //           {
    //             id: 23050467,
    //             facilityCode: '318Z0032',
    //             institutionName: 'NEW YORK INSTITUTE OF TECHNOLOGY-NYC',
    //             priority: 'Primary',
    //             firstName: 'NANCY',
    //             lastName: 'BORCHERS',
    //             title: 'Associate Registrar',
    //             phoneAreaCode: '516',
    //             phoneNumber: '6861277',
    //             phoneExtension: null,
    //             email: 'nborcher@nyit.edu',
    //             version: null,
    //             institutionId: 36323753,
    //           },
    //           {
    //             id: 23050468,
    //             facilityCode: '318Z0032',
    //             institutionName: 'NEW YORK INSTITUTE OF TECHNOLOGY-NYC',
    //             priority: 'Secondary',
    //             firstName: 'LUCY',
    //             lastName: 'GIRONDA',
    //             title: 'DIRECTOR',
    //             phoneAreaCode: '516',
    //             phoneNumber: '686-1292',
    //             phoneExtension: null,
    //             email: 'lgironda@nyit.edu',
    //             version: null,
    //             institutionId: 36323753,
    //           },
    //         ],
    //         countOfCautionFlags: 0,
    //         section103Message: 'Yes',
    //         hbcu: 0,
    //         hcm2: 0,
    //         menonly: 0,
    //         pctfloan: 0.4616,
    //         relaffil: null,
    //         womenonly: 0,
    //         hsi: 0,
    //         nanti: 0,
    //         annhi: 0,
    //         aanapii: 1,
    //         pbi: 0,
    //         tribal: 0,
    //         institutionRating: null,
    //         ratingAverage: null,
    //         ratingCount: 0,
    //         inStateTuitionInformation: null,
    //         vrrap: null,
    //         ownershipName: null,
    //       },
    //       links: {
    //         website: 'http://www.nyit.edu/',
    //         scorecard:
    //           'https://collegescorecard.ed.gov/school/?194091-new-york-institute-of-technology-nyc',
    //         self:
    //           'https://staging-platform-api.va.gov/gids/v0/institutions/318Z0032',
    //       },
    //     },
    //     links: {
    //       self:
    //         'https://staging-platform-api.va.gov/gids/v1/institutions/318Z0032',
    //     },
    //     meta: {
    //       version: {
    //         number: 502,
    //         createdAt: '2025-01-29T14:11:53.094Z',
    //         preview: false,
    //       },
    //     },
    //   },
    // }).as('institutionData');

    // cy.wait('@institutionData');

    // cy.get('a[data-testid="program-link"]', {
    //   timeout: 10000,
    // }).should('exist');
    // cy.get('a[data-testid="program-link"]', { timeout: 10000 })
    //   .first()
    //   .click();
  });
  it('should show a "no results" message when an invalid program name is searched', () => {
    cy.visit(
      'education/gi-bill-comparison-tool/institution/318Z0032/institution-of-higher-learning',
    );
    cy.wait('@featureToggles');
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
  it('should clear the search query and display all programs when "Reset search" is clicked', () => {
    cy.visit(
      'education/gi-bill-comparison-tool/institution/318Z0032/institution-of-higher-learning',
    );
    cy.wait('@featureToggles');
    cy.injectAxeThenAxeCheck();
    cy.get('#search-input')
      .shadow()
      .find('input')
      .type('ACCOUNTING');
    cy.contains('button', 'Search').click();
    cy.contains('button', 'Reset search').click();
    cy.get('#search-input')
      .shadow()
      .find('input')
      .should('have.value', '')
      .should('be.focused');
    cy.get('[data-testid="program-list-item"]').should('have.length', 20);
  });
  it('should display relevant results when a user searches for "ACCOUNTING"', () => {
    cy.visit(
      'education/gi-bill-comparison-tool/institution/318Z0032/institution-of-higher-learning',
    );
    cy.wait('@featureToggles');
    cy.injectAxeThenAxeCheck();
    cy.get('#search-input')
      .shadow()
      .find('input')
      .type('ACCOUNTING');
    cy.contains('button', 'Search').click();
    cy.get('#results-summary').should('contain', 'ACCOUNTING');
    cy.get('[data-testid="program-list-item"]').should('have.length', 4);
    cy.get('[data-testid="program-list-item"]')
      .first()
      .should('contain', 'ACCOUNTING-CPA TRACK-BS');
  });
  it('displays an error if the user tries to search with an empty input', () => {
    cy.visit(
      'education/gi-bill-comparison-tool/institution/318Z0032/institution-of-higher-learning',
    );
    cy.wait('@featureToggles');
    cy.injectAxeThenAxeCheck();
    cy.get('#search-input')
      .shadow()
      .find('input')
      .type(' ');
    cy.contains('button', 'Search').click();
    cy.get('[class="usa-error-message"]')
      .should(
        'contain',
        'Please fill in a program name and then select search.',
      )
      .should('exist');
  });
  it('paginates correctly when there are more than 20 programs', () => {
    cy.visit(
      'education/gi-bill-comparison-tool/institution/318Z0032/institution-of-higher-learning',
    );
    cy.wait('@featureToggles');
    cy.injectAxeThenAxeCheck();
    cy.get('va-pagination').should('exist');
    cy.get('#results-summary').should('contain', 'Showing 1-20');
    cy.get('va-pagination')
      .shadow()
      .find('[aria-label="Next page"]')
      .click();
    cy.get('#results-summary').should('contain', 'Showing 21-');
  });
});
