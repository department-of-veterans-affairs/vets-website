import sinon from 'sinon';
import { like, term } from '@pact-foundation/pact/dsl/matchers';

import contractTest from 'platform/testing/contract';
import { submitForm } from 'platform/forms-system/src/js/actions';

import formConfig from '../../form/form';

contractTest('Ask a Question', 'VA.gov API', mockApi => {
  describe('POST /ask/asks', () => {
    it('responds with 200 when submitting form', async () => {
      await mockApi().addInteraction({
        state: 'there are no service history records',
        uponReceiving: 'a GET request',
        withRequest: {
          method: 'POST',
          path: '/v0/ask/asks',
          headers: {
            'X-Key-Inflection': 'camel',
            'Content-Type': 'application/json',
          },
          body: {
            inquiry: {
              form:
                '{"fullName":{"first":"Jane","last":"Doe","suffix":"IV"},"preferredContactMethod":"email","email":"jane.doe@va.gov","phone":"8001234567","address":{"street":"123 Main St","street2":"Apt 3","city":"Chicago","country":"USA","state":"IL","postalCode":"60601"},"veteranStatus":{"veteranStatus":"dependent","isDependent":true,"relationshipToVeteran":"Daughter","veteranIsDeceased":true,"dateOfDeath":"2000-01-01","branchOfService":"Air Force"},"veteranInformation":{"dateOfBirth":"1957-03-07","socialSecurityNumber":"222113333","serviceNumber":"123456789001","claimNumber":"12345678","serviceDateRange":{"from":"1973-02-16","to":"1976-05-07"}},"topic":{"vaMedicalCenter":"405GC","levelOne":"Health & Medical Issues & Services","levelTwo":"Prosthetics, Med Devices & Sensory Aids","levelThree":"Eyeglasses"},"inquiryType":"Status of Claim","query":"What is the status of my claim submitted in April?"}',
            },
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
          body: like({
            confirmationNumber: '0000-0000-0000',
            dateSubmitted: '10-20-2020',
          }),
        },
      });
      const form = {
        data: {
          fullName: { first: 'Jane', last: 'Doe', suffix: 'IV' },
          preferredContactMethod: 'email',
          email: 'jane.doe@va.gov',
          phone: '8001234567',
          address: {
            street: '123 Main St',
            street2: 'Apt 3',
            city: 'Chicago',
            country: 'USA',
            state: 'IL',
            postalCode: '60601',
          },
          veteranStatus: {
            veteranStatus: 'dependent',
            isDependent: true,
            relationshipToVeteran: 'Daughter',
            veteranIsDeceased: true,
            dateOfDeath: '2000-01-01',
            branchOfService: 'Air Force',
          },
          veteranInformation: {
            dateOfBirth: '1957-03-07',
            socialSecurityNumber: '222113333',
            serviceNumber: '123456789001',
            claimNumber: '12345678',
            serviceDateRange: { from: '1973-02-16', to: '1976-05-07' },
          },
          topic: {
            vaMedicalCenter: '405GC',
            levelOne: 'Health & Medical Issues & Services',
            levelTwo: 'Prosthetics, Med Devices & Sensory Aids',
            levelThree: 'Eyeglasses',
          },
          inquiryType: 'Status of Claim',
          query: 'What is the status of my claim submitted in April?',
        },
      };

      const dispatch = sinon.stub();

      await submitForm(formConfig, form)(dispatch);
    });
  });
});
