import contractTest from 'platform/testing/contract';
import { like, term } from '@pact-foundation/pact/dsl/matchers';
import {
  apiGetRequest,
  apiPostRequest,
  apiPatchRequest,
} from '../../apiCalls/';
import environment from 'platform/utilities/environment';
import authenticatedApplicationData from '../cypress/fixtures/data/authenticated-coronavirus-vaccination-application.json';
import unauthenticatedApplicationData from '../cypress/fixtures/data/unauthenticated-coronavirus-vaccination-application.json';

// TODO:
// check to see if get request to show action is made for unauthenticated users
// => no, it is not
// => delete get request test

// get body for
// post unauthenticated
// birthDate: "1973-01-01"
// email: "jane.doe@example.com"
// firstName: "Jane"
// isIdentityVerified: false
// lastName: "Doe"
// phone: "1112223333"
// ssn: "419545182"
// vaccineInterest: "INTERESTED"
// zipCode: "05403"
// zipCodeDetails: "Yes"

// get unauthenticated (if applicable)
// => not applicable

// post authenticated
// user = vets.gov.user+3@gmail.com

// once authenticated:
// GET requests
// {"data":{"id":"","type":"users_scaffolds","attributes":{"services":["facilities","hca","edu-benefits","form-save-in-progress","form-prefill","user-profile","appeals-status","identity-proofed","vet360"],"account":{"accountUuid":"6b4b6188-00cc-4a4f-8d55-3e61a2fbd00a"},"profile":{"email":"vets.gov.user+3@gmail.com","firstName":"KENNETH","middleName":"WILLIAM","lastName":"ANDREWS","birthDate":"1989-11-11","gender":"M","zip":"44444","lastSignedIn":"2020-12-11T16:48:43.085Z","loa":{"current":3,"highest":3},"multifactor":true,"verified":true,"signIn":{"serviceName":"idme","accountType":"N/A"},"authnContext":"http://idmanagement.gov/ns/assurance/loa/3"},"vaProfile":{"status":"OK","birthDate":"19891111","familyName":"Andrews","gender":null,"givenNames":["Kenneth","William"],"isCernerPatient":false,"facilities":[],"vaPatient":false,"mhvAccountState":"NONE"},"veteranStatus":null,"inProgressForms":[],"prefillsAvailable":["21-686C","40-10007","0873","22-1990","22-1990N","22-1990E","22-1995","22-5490","22-5495","22-0993","22-0994","FEEDBACK-TOOL","22-10203","21-526EZ","1010ez","21P-530","21P-527EZ","686C-674","20-0996","MDOT","5655","28-8832","28-1900"],"vet360ContactInformation":{"email":null,"residentialAddress":null,"mailingAddress":{"addressLine1":"435345 dfgdfg","addressLine2":null,"addressLine3":null,"addressPou":"CORRESPONDENCE","addressType":"DOMESTIC","city":"dfgfdg","countryName":"United States","countryCodeIso2":"US","countryCodeIso3":"USA","countryCodeFips":null,"countyCode":null,"countyName":null,"createdAt":"2020-08-04T17:14:36.000+00:00","effectiveEndDate":null,"effectiveStartDate":"2020-08-04T17:14:35.000+00:00","geocodeDate":"2020-08-04T17:14:35.000+00:00","geocodePrecision":null,"id":188034,"internationalPostalCode":null,"latitude":41.1895,"longitude":-80.9689,"province":null,"sourceDate":"2020-08-04T17:14:35.000+00:00","sourceSystemUser":null,"stateCode":"AK","transactionId":"d38b9437-c374-448b-863e-2ac48ffc4d61","updatedAt":"2020-08-04T17:14:36.000+00:00","validationKey":null,"vet360Id":"225303","zipCode":"44444","zipCodeSuffix":null},"mobilePhone":null,"homePhone":null,"workPhone":null,"temporaryPhone":null,"faxNumber":null,"textPermission":null},"session":{"ssoe":true,"transactionid":"mE/d0e2Mve1EVXYLmE/EXSWQuTFULgB0fDB2dRfoc8A="}}},"meta":{"errors":[{"externalService":"EMIS","startTime":"2020-12-11T16:48:57Z","endTime":null,"description":"EMISRedis::VeteranStatus::NotAuthorized, NOT_AUTHORIZED","status":401}]}}

// GET requests
// {"data":{"type":"feature_toggles","features":[{"name":"preEntryCovid19Screener","value":false},{"name":"dashboard_show_dashboard_2","value":false},{"name":"ch33_dd_profile","value":false},{"name":"facilityLocatorShowCommunityCares","value":true},{"name":"facilitiesPpmsSuppressPharmacies","value":false},{"name":"facilitiesPpmsSuppressCommunityCare","value":false},{"name":"facilityLocatorPredictiveLocationSearch","value":false},{"name":"vaOnlineScheduling","value":true},{"name":"vaOnlineSchedulingCancel","value":true},{"name":"vaOnlineSchedulingRequests","value":true},{"name":"vaOnlineSchedulingCommunityCare","value":true},{"name":"vaOnlineSchedulingDirect","value":true},{"name":"vaOnlineSchedulingPast","value":true},{"name":"vaOnlineSchedulingVspAppointmentList","value":false},{"name":"vaOnlineSchedulingVspAppointmentNew","value":false},{"name":"vaOnlineSchedulingCcspAppointmentList","value":false},{"name":"vaOnlineSchedulingCcspRequestNew","value":false},{"name":"vaOnlineSchedulingVspRequestList","value":false},{"name":"vaOnlineSchedulingVspRequestNew","value":false},{"name":"vaOnlineSchedulingExpressCare","value":true},{"name":"vaOnlineSchedulingExpressCareNew","value":true},{"name":"vaOnlineSchedulingFlatFacilityPage","value":true},{"name":"vaOnlineSchedulingFlatFacilityPageSacramento","value":false},{"name":"vaOnlineSchedulingProviderSelection","value":true},{"name":"vaGlobalDowntimeNotification","value":false},{"name":"ssoe","value":true},{"name":"ssoeInbound","value":true},{"name":"ssoeEbenefitsLinks","value":false},{"name":"form526OriginalClaims","value":false},{"name":"vaViewDependentsAccess","value":false},{"name":"allow_online_10_10cg_submissions","value":true},{"name":"gibctEybBottomSheet","value":false},{"name":"gibctBenefitFilterEnhancement","value":true},{"name":"gibctSchoolRatings","value":true},{"name":"form996HigherLevelReview","value":true},{"name":"debtLettersShowLetters","value":true},{"name":"form526BenefitsDeliveryAtDischarge","value":true},{"name":"show_edu_benefits_1995_wizard","value":true},{"name":"show_edu_benefits_5495_wizard","value":true},{"name":"show_edu_benefits_0994_wizard","value":true},{"name":"show_edu_benefits_1990n_wizard","value":false},{"name":"show_edu_benefits_5490_wizard","value":true},{"name":"show_edu_benefits_1990e_wizard","value":false},{"name":"show_edu_benefits_1990_wizard","value":true},{"name":"stem_sco_email","value":true},{"name":"showHealthcareExperienceQuestionnaire","value":true},{"name":"show_new_get_medical_records_page","value":true},{"name":"show_new_refill_track_prescriptions_page","value":true},{"name":"show_new_schedule_view_appointments_page","value":true},{"name":"show_new_secure_messaging_page","value":true},{"name":"show_new_view_test_lab_results_page","value":true},{"name":"cerner_override_668","value":true},{"name":"cerner_override_757","value":true},{"name":"show526Wizard","value":true},{"name":"show_chapter_36","value":false},{"name":"show_chapter_31","value":false},{"name":"view_payment_history","value":false},{"name":"request_locked_pdf_password","value":true},{"name":"form526_confirmation_email","value":true},{"name":"form526_confirmation_email_show_copy","value":true},{"name":"search_typeahead_enabled","value":true},{"name":"covid_vaccine_registration_frontend_cta","value":true},{"name":"covid_vaccine_registration_frontend","value":true}]}}

// You only see this data on form about logged in user
// only info given from logged in user:
// first
// last
// dob

// after submission
// post 200 ok
// birthDate: "1989-11-11"
// email: "kenneth.andrews@example.com"
// firstName: "KENNETH"
// isIdentityVerified: true
// lastName: "ANDREWS"
// phone: "1112223333"
// vaccineInterest: "INTERESTED"
// zipCode: "10023"
// zipCodeDetails: "Yes"

// Log back in:
// xhr request to
// Request URL: https://staging-api.va.gov/v0/user
// Request Method: GET
// Status Code: 296 CUSTOM

// response:
// data > attributes > profile >
// authnContext: "http://idmanagement.gov/ns/assurance/loa/3"
// birthDate: "1989-11-11"
// email: "vets.gov.user+3@gmail.com"
// firstName: "KENNETH"
// gender: "M"
// lastName: "ANDREWS"
// lastSignedIn: "2020-12-11T17:16:38.669Z"
// loa: {current: 3, highest: 3}
// middleName: "WILLIAM"
// multifactor: true
// signIn: {serviceName: "idme", accountType: "N/A"}
// verified: true
// zip: "44444"

// get authenticated
// patch/post authenticated - what's route for this?

contractTest('Coronavirus Vaccination', 'VA.gov API', mockApi => {
  describe('GET /registration', () => {
    it('authenticated case: request for saved registration will return a 200 OK HTTP response', async () => {
      const url = `${environment.API_URL}/covid_vaccine/v0/registration`;

      const interaction = {
        state: 'retreives saved registration for authenticated user',
        uponReceiving: 'a GET request',
        withRequest: {
          method: 'GET',
          path: '/covid_vaccine/v0/registration',
          headers: {
            'X-Key-Inflection': 'camel',
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': term({
              matcher: '^application/json',
              generate: 'application/json',
            }),
          },
          body: {
            data: like({}), // waiting for example data
          },
        },
      };

      await mockApi().addInteraction(interaction);

      await apiGetRequest(url);
    });

    it('Unauthenticated case: request for saved registration will return a 403 Forbidden HTTP response', async () => {
      const url = `${environment.API_URL}/covid_vaccine/v0/registration`;

      const interaction = {
        state: 'unauthenticated request for saved submission is forbidden',
        uponReceiving: 'a GET request',
        withRequest: {
          method: 'GET',
          path: '/covid_vaccine/v0/registration',
          headers: {
            'X-Key-Inflection': 'camel',
          },
        },
        willRespondWith: {
          status: 403,
          headers: {
            'Content-Type': term({
              matcher: '^application/json',
              generate: 'application/json',
            }),
          },
          body: {
            data: like({}), // waiting for example data
          },
        },
      };

      await mockApi().addInteraction(interaction);

      await apiGetRequest(url);
    });
  });

  describe('POST /registration', () => {
    it('authenticated success case: submit valid registration will return a 201 Created HTTP response', async () => {
      const url = `${environment.API_URL}/covid_vaccine/v0/registration`;

      const interaction = {
        state: 'authenticated user sumbits registration data',
        uponReceiving: 'a POST request',
        withRequest: {
          method: 'POST',
          path: '/covid_vaccine/v0/registration',
          headers: {
            'X-Key-Inflection': 'camel',
            'Content-Type': 'application/json',
          },
          body: authenticatedApplicationData,
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': term({
              matcher: '^application/json',
              generate: 'application/json',
            }),
          },
          body: {
            data: {
              id: like('C2B0CCBC18AFD5A489160753194205616'),
              type: 'covid_vaccine_v0_registration_submissions',
              attributes: {
                createdAt: like('2020-12-09T16:39:02.153Z'),
              },
            },
          },
        },
      };

      await mockApi().addInteraction(interaction);

      await apiPostRequest(url, authenticatedApplicationData);
    });

    it('unauthenticated success case: submit valid registration will return a 201 Created HTTP response', async () => {
      const url = `${environment.API_URL}/covid_vaccine/v0/registration`;

      const interaction = {
        state: 'unauthenticated user sumbits registration data',
        uponReceiving: 'a POST request',
        withRequest: {
          method: 'POST',
          path: '/covid_vaccine/v0/registration',
          headers: {
            'X-Key-Inflection': 'camel',
            'Content-Type': 'application/json',
          },
          body: unauthenticatedApplicationData,
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': term({
              matcher: '^application/json',
              generate: 'application/json',
            }),
          },
          body: {
            data: {
              id: like('C2B0CCBC18AFD5A489160753194205616'),
              type: 'covid_vaccine_v0_registration_submissions',
              attributes: {
                createdAt: like('2020-12-09T16:39:02.153Z'),
              },
            },
          },
        },
      };

      await mockApi().addInteraction(interaction);

      await apiPostRequest(url, unauthenticatedApplicationData);
    });
  });

  // I JUST FOUND OUT THAT THE UPDATE WILL ALSO BE A POST REQUEST. WAITING FOR MORE DETAILS.
  describe('PATCH /registration', () => {
    it('authenticated success case: submit valid updated registration will return a 204 No Content HTTP response', async () => {
      const url = `${environment.API_URL}/covid_vaccine/v0/registration`; // might need to be updated

      const interaction = {
        state: 'authenticated user updates registration data',
        uponReceiving: 'a PATCH request',
        withRequest: {
          method: 'PATCH',
          path: '/covid_vaccine/v0/registration', // might need to be updated
          headers: {
            'X-Key-Inflection': 'camel',
            'Content-Type': 'application/json',
          },
          body: authenticatedApplicationData, // might need to be updated
        },
        willRespondWith: {
          status: 204, // might need to be updated
          headers: {
            'Content-Type': term({
              matcher: '^application/json',
              generate: 'application/json',
            }),
          },
          body: {
            data: like({}), // needs to be updated
          },
        },
      };

      await mockApi().addInteraction(interaction);

      await apiPatchRequest(url, authenticatedApplicationData);
    });
  });
});
