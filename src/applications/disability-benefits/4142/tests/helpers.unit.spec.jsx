import { expect } from 'chai';

import { transform } from '../helpers.jsx';
import testData from './data/test4142data';

describe('4142 helpers', () => {
  describe('transform', () => {
    const formData = testData;
    const transformedData = {
      providerFacility: [{
        providerFacilityName: 'Another Provider',
        treatmentDateRange: [{
          from: '2010-03-04',
          to: '2012-02-03'
        }],
        providerFacilityAddress: {
          street: '1234 test rd',
          city: 'Testville',
          country: 'USA',
          state: 'AZ',
          postalCode: '12345'
        }
      },
      {
        providerFacilityName: 'Provider',
        treatmentDateRange: [{
          from: '2000-03-03',
          to: '2008-06-05'
        }],
        providerFacilityAddress: {
          street: '14007 Wescott Ct',
          city: 'Bowie',
          country: 'USA',
          state: 'MD',
          postalCode: '20715'
        }
      }],
      privacyAgreementAccepted: true,
      veteranFullName: {
        first: 'Greg',
        middle: 'A',
        last: 'Anderson'
      },
      veteranSocialSecurityNumber: '111111111',
      veteranDateOfBirth: '1933-04-05',
      veteranAddress: {
        street: 'MILITARY ADDY 3',
        city: 'DPO',
        state: 'MI',
        country: 'USA',
        postalCode: '22312'
      },
      veteranPhone: '4445551212'
    };
    it('should return treatmentDateRange transformed into an array of object per facility for submit', () => {
      expect(transform(null, formData)).to.deep.equal(JSON.stringify(transformedData));
    });
  });
});
