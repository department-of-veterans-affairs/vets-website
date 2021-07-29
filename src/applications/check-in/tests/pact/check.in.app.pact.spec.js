import contractTest from 'platform/testing/contract';

import { checkInUser, validateToken } from '../../api';
import checkInResponses from '../../api/local-mock-api/mocks/check.in.response';

import validateResponses from '../../api/local-mock-api/mocks/validate.responses';

contractTest('Check In', 'VA.gov API', mockApi => {
  // Skipped until the pact is created on the API
  describe.skip('GET /check_in/v0/patient_check_ins', () => {
    context('when validating token', () => {
      it('responds with status 200', async () => {
        const token = '4c6b08ef-dd38-48d6-973a-0d1bcd2622c8';
        const interaction = {
          state: 'validating token',
          uponReceiving: 'a request to get stuff',
          withRequest: {
            method: 'GET',
            path: `/check_in/v0/patient_check_ins/${token}`,
            headers: {
              'Content-Type': 'application/json',
              'X-Key-Inflection': 'camel',
            },
          },
          willRespondWith: {
            status: 200,
            body: validateResponses.createMockSuccessResponse(),
          },
        };
        mockApi().addInteraction(interaction);
        await validateToken(token);
      });

      it('responds with status 500', async () => {
        const token = 'not-a-valid-token';
        const interaction = {
          state: 'validating token',
          uponReceiving: 'a request to get stuff',
          withRequest: {
            method: 'GET',
            path: `/check_in/v0/patient_check_ins/${token}`,
            headers: {
              'Content-Type': 'application/json',
              'X-Key-Inflection': 'camel',
            },
          },
          willRespondWith: {
            status: 500,
            body: validateResponses.createMockFailedResponse(),
          },
        };
        mockApi().addInteraction(interaction);
        await validateToken(token);
      });
    });
  });

  // Skipped until the pact is created on the API
  describe('POST /check_in/v0/patient_check_ins/', () => {
    it.skip('responds with status 200', async () => {
      const token = '4c6b08ef-dd38-48d6-973a-0d1bcd2622c8';
      const interaction = {
        state: 'check in a patient',
        uponReceiving: 'a request to get stuff',
        withRequest: {
          method: 'GET',
          path: `/check_in/v0/patient_check_ins/`,
          headers: {
            'Content-Type': 'application/json',
            'X-Key-Inflection': 'camel',
          },
          body: {
            patientCheckIns: {
              id: token,
            },
          },
        },
        willRespondWith: {
          status: 200,
          body: checkInResponses.createMockSuccessResponse(),
        },
      };
      mockApi().addInteraction(interaction);
      await checkInUser({ token });
    });
  });
});
