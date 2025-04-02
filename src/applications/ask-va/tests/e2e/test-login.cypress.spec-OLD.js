// // import 'cypress';
// import mockUser from './fixtures/user.json';

// import responseBenefitsIssuesOutsideUS from './fixtures/ask_va_api/v0/contents/topics/benefits-issues-outside-the-us.json';
// import responseBurialsAndMemorials from './fixtures/ask_va_api/v0/contents/topics/burials-and-memorials.json';
// import responseCenterForMinorityVeterans from './fixtures/ask_va_api/v0/contents/topics/center-for-minority-veterans.json';
// import responseCenterForWomenVeterans from './fixtures/ask_va_api/v0/contents/topics/center-for-women-veterans.json';
// import responseDebtForBenefit from './fixtures/ask_va_api/v0/contents/topics/debt-for-benefit-overpayments-and-health-care-copay-bills.json';
// import responseDefenseEnrollmentEligibilityReportingSystem from './fixtures/ask_va_api/v0/contents/topics/defense-enrollment-eligibility-reporting-system.json';
// import responseDecisionReviews from './fixtures/ask_va_api/v0/contents/topics/decision-reviews-and-appeals.json';
// import responseDisabilityCompensation from './fixtures/ask_va_api/v0/contents/topics/disability-compensation.json';
// import responseEducationBenefitsAndWorkStudy from './fixtures/ask_va_api/v0/contents/topics/education-benefits-and-work-study.json';
// import responseGuardianshipCustodianshipFiduciaryIssues from './fixtures/ask_va_api/v0/contents/topics/guardianship-custodianship-or-fiduciary-issues.json';
// import responseHealthCare from './fixtures/ask_va_api/v0/contents/topics/health-care.json';
// import responseHousingAssistanceAndHomeLoans from './fixtures/ask_va_api/v0/contents/topics/housing-assistance-and-home-loans.json';
// import responseLifeInsurance from './fixtures/ask_va_api/v0/contents/topics/life-insurance.json';
// import responsePension from './fixtures/ask_va_api/v0/contents/topics/pension.json';
// import responseSignInAndTechnicalIssues from './fixtures/ask_va_api/v0/contents/topics/sign-in-and-technical-issues.json';
// import responseSurvivorBenefits from './fixtures/ask_va_api/v0/contents/topics/survivor-benefits.json';
// import responseVeteranIDCard from './fixtures/ask_va_api/v0/contents/topics/veteran-id-card.json';
// import responseVeteranReadinessAndEmployment from './fixtures/ask_va_api/v0/contents/topics/veteran-readiness-and-employment.json';
// import responseCategory from './fixtures/ask_va_api/v0/contents/categories.json';
// import responseBoardAppeals from './fixtures/ask_va_api/v0/contents/subtopics/board-appeals.json';
// import responseCaregiveSupportProgram from './fixtures/ask_va_api/v0/contents/subtopics/caregiver-support-program.json';
// import responseEducationBenefits from './fixtures/ask_va_api/v0/contents/subtopics/education-benefits-and-work-study.json';
// import responseFamilyHealthBenefits from './fixtures/ask_va_api/v0/contents/subtopics/family-health-benefits.json';
// import responseMemorialItems from './fixtures/ask_va_api/v0/contents/subtopics/memorial-items.json';
// import responseProsthetics from './fixtures/ask_va_api/v0/contents/subtopics/prosthetics.json';
// import responseSigningInToVaGov from './fixtures/ask_va_api/v0/contents/subtopics/signing-in-to-va-gov-and-managing-va-gov-profile.json';
// import responseTechnicalIssuesOnVaGov from './fixtures/ask_va_api/v0/contents/subtopics/technical-issues-on-va-gov.json';
// import responseTransferOfBenefits from './fixtures/ask_va_api/v0/contents/subtopics/transfer-of-benefits.json';
// import responseVeteranHealthIdentificationCard from './fixtures/ask_va_api/v0/contents/subtopics/veteran-health-identification-card-for-health-appointments.json';
// import responseVeteranIdCardForDiscount from './fixtures/ask_va_api/v0/contents/subtopics/veteran-id-card-for-discounts.json';
// import responseWorkStudy from './fixtures/ask_va_api/v0/contents/subtopics/work-study.json';

// // Helper function to create cy.intercept for multiple endpoints
// const interceptTopics = [
//   {
//     parentId: '66524deb-d864-eb11-bb24-000d3a579c45',
//     response: responseBenefitsIssuesOutsideUS,
//   },
//   {
//     parentId: '71524deb-d864-eb11-bb24-000d3a579c45',
//     response: responseBurialsAndMemorials,
//   },
//   {
//     parentId: '5a524deb-d864-eb11-bb24-000d3a579c45',
//     response: responseCenterForMinorityVeterans,
//   },
//   {
//     parentId: '62524deb-d864-eb11-bb24-000d3a579c45',
//     response: responseCenterForWomenVeterans,
//   },
//   {
//     parentId: '9520fd17-ec3c-ec11-b6e5-001dd804d87f',
//     response: responseDefenseEnrollmentEligibilityReportingSystem,
//   },
//   {
//     parentId: '60524deb-d864-eb11-bb24-000d3a579c45',
//     response: responseDecisionReviews,
//   },
//   {
//     parentId: '5c524deb-d864-eb11-bb24-000d3a579c45',
//     response: responseDebtForBenefit,
//   },
//   {
//     parentId: '68524deb-d864-eb11-bb24-000d3a579c45',
//     response: responseDisabilityCompensation,
//   },
//   {
//     parentId: '75524deb-d864-eb11-bb24-000d3a579c45',
//     response: responseEducationBenefitsAndWorkStudy,
//   },
//   {
//     parentId: '6d524deb-d864-eb11-bb24-000d3a579c45',
//     response: responseGuardianshipCustodianshipFiduciaryIssues,
//   },
//   {
//     parentId: '73524deb-d864-eb11-bb24-000d3a579c45',
//     response: responseHealthCare,
//   },
//   {
//     parentId: '64524deb-d864-eb11-bb24-000d3a579c45',
//     response: responseHousingAssistanceAndHomeLoans,
//   },
//   {
//     parentId: '6f524deb-d864-eb11-bb24-000d3a579c45',
//     response: responseLifeInsurance,
//   },
//   {
//     parentId: '6a524deb-d864-eb11-bb24-000d3a579c45',
//     response: responsePension,
//   },
//   {
//     parentId: '5e524deb-d864-eb11-bb24-000d3a579c45',
//     response: responseSignInAndTechnicalIssues,
//   },
//   {
//     parentId: '282d7129-c977-ec11-8940-001dd804d2b4',
//     response: responseSurvivorBenefits,
//   },
//   {
//     parentId: '77524deb-d864-eb11-bb24-000d3a579c45',
//     response: responseVeteranReadinessAndEmployment,
//   },
//   {
//     parentId: 'e77b38c8-1617-ec11-b6e5-001dd804ce09',
//     response: responseVeteranIDCard,
//   },
// ];

// const interceptSubtopics = [
//   {
//     parentId: 'a72a8586-e764-eb11-bb23-000d3a579c3f',
//     response: responseBoardAppeals,
//   },
//   {
//     parentId: '032b8586-e764-eb11-bb23-000d3a579c3f',
//     response: responseCaregiveSupportProgram,
//   },
//   {
//     parentId: 'bf2a8586-e764-eb11-bb23-000d3a579c3f',
//     response: responseEducationBenefits,
//   },
//   {
//     parentId: '092b8586-e764-eb11-bb23-000d3a579c3f',
//     response: responseFamilyHealthBenefits,
//   },
//   {
//     parentId: 'fb2a8586-e764-eb11-bb23-000d3a579c3f',
//     response: responseMemorialItems,
//   },
//   {
//     parentId: '0d2b8586-e764-eb11-bb23-000d3a579c3f',
//     response: responseProsthetics,
//   },
//   {
//     parentId: 'eeba9562-e864-eb11-bb23-000d3a579c44',
//     response: responseSigningInToVaGov,
//   },
//   {
//     parentId: 'f0ba9562-e864-eb11-bb23-000d3a579c44',
//     response: responseTechnicalIssuesOnVaGov,
//   },
//   {
//     parentId: '8085b967-8276-ef11-a671-001dd8097cca',
//     response: responseTransferOfBenefits,
//   },
//   {
//     parentId: 'ea7b38c8-1617-ec11-b6e5-001dd804ce09',
//     response: responseVeteranHealthIdentificationCard,
//   },
//   {
//     parentId: 'ec7b38c8-1617-ec11-b6e5-001dd804ce09',
//     response: responseVeteranIdCardForDiscount,
//   },
//   {
//     parentId: '152b8586-e764-eb11-bb23-000d3a579c3f',
//     response: responseWorkStudy,
//   },
// ];

// const interceptResponses = () => {
//   cy.intercept(
//     'GET',
//     `/ask_va_api/v0/contents?type=category&user_mock_data=true`,
//     responseCategory,
//   );

//   interceptTopics.forEach(({ parentId, response }) => {
//     cy.intercept(
//       'GET',
//       `/ask_va_api/v0/contents?type=topic&parent_id=${parentId}`,
//       response,
//     );
//   });

//   interceptSubtopics.forEach(({ parentId, response }) => {
//     cy.intercept(
//       'GET',
//       `/ask_va_api/v0/contents?type=subtopic&parent_id=${parentId}`,
//       response,
//     );
//   });
// };

// describe('Ask VA test log in page', () => {
//   // beforeAll(() => {
//   //   cy.intercept('GET', `/avs/v0/avs/*`, mockUser); // TODO: map mocks to actual routes

//   // });

//   beforeEach(() => {
//     // Intercept all relevant API calls for the Ask VA page
//     interceptResponses();

//     // Intercept the user API request and log in
//     cy.intercept('GET', `/avs/v0/avs/*`, mockUser);
//     cy.login();
//   });

//   it('visits landing page of Ask VA ', () => {
//     cy.visit('/contact-us/ask-va');
//     cy.injectAxeThenAxeCheck();

//     // Check for the "Ask a new question" button and click it
//     cy.findByText('Ask a new question')
//       .should('be.visible')
//       .click();

//     // Verify the "Continue" button is present and click it
//     cy.findByText('Continue')
//       .should('be.visible')
//       .click();
//   });
// });

// // describe('a bogus test group', () => {
// //   it('should fail', () => {
// //     expect(true).to.be.false;
// //   });
// // });
