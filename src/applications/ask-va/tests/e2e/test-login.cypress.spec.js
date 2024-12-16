// import 'cypress';
import mockUser from './fixtures/user.json';

import responseBenefitsIssuesOutsideUS from './fixtures/ask_va_api/v0/contents/topics/benefits-issues-outside-the-us.json';
import responseBurialsAndMemorials from './fixtures/ask_va_api/v0/contents/topics/burials-and-memorials.json';
import responseCenterForMinorityVeterans from './fixtures/ask_va_api/v0/contents/topics/center-for-minority-veterans.json';
import responseCenterForWomenVeterans from './fixtures/ask_va_api/v0/contents/topics/center-for-women-veterans.json';
import responseDebtForBenefit from './fixtures/ask_va_api/v0/contents/topics/debt-for-benefit-overpayments-and-health-care-copay-bills.json';
import responseDefenseEnrollmentEligibilityReportingSystem from './fixtures/ask_va_api/v0/contents/topics/defense-enrollment-eligibility-reporting-system.json';
import responseDecisionReviews from './fixtures/ask_va_api/v0/contents/topics/decision-reviews-and-appeals.json';
import responseDisabilityCompensation from './fixtures/ask_va_api/v0/contents/topics/disability-compensation.json';
import responseEducationBenefitsAndWorkStudy from './fixtures/ask_va_api/v0/contents/topics/education-benefits-and-work-study.json';
import responseGuardianshipCustodianshipFiduciaryIssues from './fixtures/ask_va_api/v0/contents/topics/guardianship-custodianship-or-fiduciary-issues.json';
import responseHealthCare from './fixtures/ask_va_api/v0/contents/topics/health-care.json';
import responseHousingAssistanceAndHomeLoans from './fixtures/ask_va_api/v0/contents/topics/housing-assistance-and-home-loans.json';
import responseLifeInsurance from './fixtures/ask_va_api/v0/contents/topics/life-insurance.json';
import responsePension from './fixtures/ask_va_api/v0/contents/topics/pension.json';
import responseSignInAndTechnicalIssues from './fixtures/ask_va_api/v0/contents/topics/sign-in-and-technical-issues.json';
import responseSurvivorBenefits from './fixtures/ask_va_api/v0/contents/topics/survivor-benefits.json';
import responseVeteranIDCard from './fixtures/ask_va_api/v0/contents/topics/veteran-id-card.json';
import responseVeteranReadinessAndEmployment from './fixtures/ask_va_api/v0/contents/topics/veteran-readiness-and-employment.json';

// Helper function to create cy.intercept for multiple endpoints
const interceptResponses = () => {
  const intercepts = [
    {
      parentId: '66524deb-d864-eb11-bb24-000d3a579c45',
      response: responseBenefitsIssuesOutsideUS,
    },
    {
      parentId: '71524deb-d864-eb11-bb24-000d3a579c45',
      response: responseBurialsAndMemorials,
    },
    {
      parentId: '5a524deb-d864-eb11-bb24-000d3a579c45',
      response: responseCenterForMinorityVeterans,
    },
    {
      parentId: '62524deb-d864-eb11-bb24-000d3a579c45',
      response: responseCenterForWomenVeterans,
    },
    {
      parentId: '9520fd17-ec3c-ec11-b6e5-001dd804d87f',
      response: responseDefenseEnrollmentEligibilityReportingSystem,
    },
    {
      parentId: '60524deb-d864-eb11-bb24-000d3a579c45',
      response: responseDecisionReviews,
    },
    {
      parentId: '5c524deb-d864-eb11-bb24-000d3a579c45',
      response: responseDebtForBenefit,
    },
    {
      parentId: '68524deb-d864-eb11-bb24-000d3a579c45',
      response: responseDisabilityCompensation,
    },
    {
      parentId: '75524deb-d864-eb11-bb24-000d3a579c45',
      response: responseEducationBenefitsAndWorkStudy,
    },
    {
      parentId: '6d524deb-d864-eb11-bb24-000d3a579c45',
      response: responseGuardianshipCustodianshipFiduciaryIssues,
    },
    {
      parentId: '73524deb-d864-eb11-bb24-000d3a579c45',
      response: responseHealthCare,
    },
    {
      parentId: '64524deb-d864-eb11-bb24-000d3a579c45',
      response: responseHousingAssistanceAndHomeLoans,
    },
    {
      parentId: '6f524deb-d864-eb11-bb24-000d3a579c45',
      response: responseLifeInsurance,
    },
    {
      parentId: '6a524deb-d864-eb11-bb24-000d3a579c45',
      response: responsePension,
    },
    {
      parentId: '5e524deb-d864-eb11-bb24-000d3a579c45',
      response: responseSignInAndTechnicalIssues,
    },
    {
      parentId: '282d7129-c977-ec11-8940-001dd804d2b4',
      response: responseSurvivorBenefits,
    },
    {
      parentId: '77524deb-d864-eb11-bb24-000d3a579c45',
      response: responseVeteranReadinessAndEmployment,
    },
    {
      parentId: 'e77b38c8-1617-ec11-b6e5-001dd804ce09',
      response: responseVeteranIDCard,
    },
  ];

  intercepts.forEach(({ parentId, response }) => {
    cy.intercept(
      'GET',
      `/ask_va_api/v0/contents?type=topic&parent_id=${parentId}`,
      response,
    );
  });
};

describe('Ask VA test log in page', () => {
  // beforeAll(() => {
  //   cy.intercept('GET', `/avs/v0/avs/*`, mockUser); // TODO: map mocks to actual routes

  // });

  beforeEach(() => {
    // Intercept all relevant API calls for the Ask VA page
    interceptResponses();

    // Intercept the user API request and log in
    cy.intercept('GET', `/avs/v0/avs/*`, mockUser);
    cy.login();
  });

  it('visits landing page of Ask VA ', () => {
    cy.visit('/contact-us/ask-va-too');
    cy.injectAxeThenAxeCheck();

    // Check for the "Ask a new question" button and click it
    cy.findByText('Ask a new question')
      .should('be.visible')
      .click();

    // Verify the "Continue" button is present and click it
    cy.findByText('Continue')
      .should('be.visible')
      .click();
  });
});

// describe('a bogus test group', () => {
//   it('should fail', () => {
//     expect(true).to.be.false;
//   });
// });
