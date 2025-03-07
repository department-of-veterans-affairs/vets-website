// Run with:
// yarn mock-api --responses src/applications/ask-va/tests/e2e/fixtures/api-mocks-for-ask-va-local.js

const responseBenefitsIssuesOutsideUS = require('./ask_va_api/v0/contents/topics/benefits-issues-outside-the-us.json');
const responseBurialsAndMemorials = require('./ask_va_api/v0/contents/topics/burials-and-memorials.json');
const responseCenterForMinorityVeterans = require('./ask_va_api/v0/contents/topics/center-for-minority-veterans.json');
const responseCenterForWomenVeterans = require('./ask_va_api/v0/contents/topics/center-for-women-veterans.json');
const responseDebtForBenefit = require('./ask_va_api/v0/contents/topics/debt-for-benefit-overpayments-and-health-care-copay-bills.json');
const responseDefenseEnrollmentEligibilityReportingSystem = require('./ask_va_api/v0/contents/topics/defense-enrollment-eligibility-reporting-system.json');
const responseDecisionReviews = require('./ask_va_api/v0/contents/topics/decision-reviews-and-appeals.json');
const responseDisabilityCompensation = require('./ask_va_api/v0/contents/topics/disability-compensation.json');
const responseEducationBenefitsAndWorkStudy = require('./ask_va_api/v0/contents/topics/education-benefits-and-work-study.json');
const responseGuardianshipCustodianshipFiduciaryIssues = require('./ask_va_api/v0/contents/topics/guardianship-custodianship-or-fiduciary-issues.json');
const responseHealthCare = require('./ask_va_api/v0/contents/topics/health-care.json');
const responseHousingAssistanceAndHomeLoans = require('./ask_va_api/v0/contents/topics/housing-assistance-and-home-loans.json');
const responseLifeInsurance = require('./ask_va_api/v0/contents/topics/life-insurance.json');
const responsePension = require('./ask_va_api/v0/contents/topics/pension.json');
const responseSignInAndTechnicalIssues = require('./ask_va_api/v0/contents/topics/sign-in-and-technical-issues.json');
const responseSurvivorBenefits = require('./ask_va_api/v0/contents/topics/survivor-benefits.json');
const responseVeteranIDCard = require('./ask_va_api/v0/contents/topics/veteran-id-card.json');
const responseVeteranReadinessAndEmployment = require('./ask_va_api/v0/contents/topics/veteran-readiness-and-employment.json');
const responseCategory = require('./ask_va_api/v0/contents/categories.json');
const responseBoardAppeals = require('./ask_va_api/v0/contents/subtopics/board-appeals.json');
const responseCaregiveSupportProgram = require('./ask_va_api/v0/contents/subtopics/caregiver-support-program.json');
const responseEducationBenefits = require('./ask_va_api/v0/contents/subtopics/education-benefits-and-work-study.json');
const responseFamilyHealthBenefits = require('./ask_va_api/v0/contents/subtopics/family-health-benefits.json');
const responseMemorialItems = require('./ask_va_api/v0/contents/subtopics/memorial-items.json');
const responseProsthetics = require('./ask_va_api/v0/contents/subtopics/prosthetics.json');
const responseSigningInToVaGov = require('./ask_va_api/v0/contents/subtopics/signing-in-to-va-gov-and-managing-va-gov-profile.json');
const responseTechnicalIssuesOnVaGov = require('./ask_va_api/v0/contents/subtopics/technical-issues-on-va-gov.json');
const responseTransferOfBenefits = require('./ask_va_api/v0/contents/subtopics/transfer-of-benefits.json');
const responseVeteranHealthIdentificationCard = require('./ask_va_api/v0/contents/subtopics/veteran-health-identification-card-for-health-appointments.json');
const responseVeteranIdCardForDiscount = require('./ask_va_api/v0/contents/subtopics/veteran-id-card-for-discounts.json');
const responseWorkStudy = require('./ask_va_api/v0/contents/subtopics/work-study.json');

const responseHealthFacilities = require('./ask_va_api/v0/health-facilities.json');
const responseEducationFacilities = require('./ask_va_api/v0/education-facilities.json');
const user = require('./user.json');

// Helper function to create cy.intercept for multiple endpoints
const interceptTopics = [
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

const interceptSubtopics = [
  {
    parentId: 'a72a8586-e764-eb11-bb23-000d3a579c3f',
    response: responseBoardAppeals,
  },
  {
    parentId: '032b8586-e764-eb11-bb23-000d3a579c3f',
    response: responseCaregiveSupportProgram,
  },
  {
    parentId: 'bf2a8586-e764-eb11-bb23-000d3a579c3f',
    response: responseEducationBenefits,
  },
  {
    parentId: '092b8586-e764-eb11-bb23-000d3a579c3f',
    response: responseFamilyHealthBenefits,
  },
  {
    parentId: 'fb2a8586-e764-eb11-bb23-000d3a579c3f',
    response: responseMemorialItems,
  },
  {
    parentId: '0d2b8586-e764-eb11-bb23-000d3a579c3f',
    response: responseProsthetics,
  },
  {
    parentId: 'eeba9562-e864-eb11-bb23-000d3a579c44',
    response: responseSigningInToVaGov,
  },
  {
    parentId: 'f0ba9562-e864-eb11-bb23-000d3a579c44',
    response: responseTechnicalIssuesOnVaGov,
  },
  {
    parentId: '8085b967-8276-ef11-a671-001dd8097cca',
    response: responseTransferOfBenefits,
  },
  {
    parentId: 'ea7b38c8-1617-ec11-b6e5-001dd804ce09',
    response: responseVeteranHealthIdentificationCard,
  },
  {
    parentId: 'ec7b38c8-1617-ec11-b6e5-001dd804ce09',
    response: responseVeteranIdCardForDiscount,
  },
  {
    parentId: '152b8586-e764-eb11-bb23-000d3a579c3f',
    response: responseWorkStudy,
  },
];

const responses = {
  'GET /v0/user': user,
  'GET /ask_va_api/v0/contents': (req, res) => {
    if (req.query.type === 'category' && req.query.user_mock_data === 'true') {
      return res.json(responseCategory);
    }
    if (req.query.type === 'topic') {
      const topicResponse = interceptTopics.find(
        ({ parentId }) => parentId === req.query.parent_id,
      )?.response;
      if (topicResponse) return res.json(topicResponse);
    }
    if (req.query.type === 'subtopic') {
      const subtopicResponse = interceptSubtopics.find(
        ({ parentId }) => parentId === req.query.parent_id,
      )?.response;
      if (subtopicResponse) return res.json(subtopicResponse);
    }
    return res.status(404).json({ error: 'Not Found' });
  },
  'POST /ask_va_api/v0/health_facilities': responseHealthFacilities,
  'GET /ask_va_api/v0/education_facilities/search': (req, res) => {
    if (req.query.name === 'austin') {
      return res.json(responseEducationFacilities);
    }
    return res.status(404).json({ error: 'Not Found' });
  },
};

module.exports = responses;
