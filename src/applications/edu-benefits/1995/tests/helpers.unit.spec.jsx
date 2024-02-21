import { expect } from 'chai';

import { buildSubmitEventData, directDepositMethod } from '../helpers';

import minimalData from './e2e/fixtures/data/minimal.json';
import maximalData from './e2e/fixtures/data/maximal.json';

describe('helpers', () => {
  describe('buildSubmitEventData', () => {
    it('if minimal form data used', () => {
      expect(buildSubmitEventData(minimalData.data)).to.deep.equal({
        'benefits-used-recently': undefined,
        'new-service-periods-to-record': undefined,
        'service-details': [],
        'service-before-1978': undefined,
        'edu-desired-facility-name': 'Test',
        'edu-desired-type-of-education': 'correspondence',
        'edu-desired-facility-state': undefined,
        'edu-desired-facility-city': undefined,
        'edu-prior-facility-name': undefined,
        'edu-prior-facility-state': undefined,
        'edu-prior-facility-city': undefined,
        'edu-prior-facility-end-date': undefined,
        'preferred-contact-method': undefined,
        married: undefined,
        'dependent-children': undefined,
        'dependent-parent': undefined,
        'direct-deposit-method': undefined,
        'direct-deposit-account-type': undefined,
      });
    });
    it('if maximal form data used', () => {
      expect(buildSubmitEventData(maximalData.data)).to.deep.equal({
        'benefits-used-recently': 'chapter33',
        'new-service-periods-to-record': 'Yes',
        'service-details': [
          {
            'service-branch': 'Army',
            'service-start-date': '1995-01-01',
            'service-end-date': '1996-01-01',
          },
          {
            'service-branch': 'Navy',
            'service-start-date': undefined,
            'service-end-date': undefined,
          },
        ],
        'service-before-1978': 'Yes',
        'edu-desired-facility-name': 'Test',
        'edu-desired-type-of-education': 'correspondence',
        'edu-desired-facility-state': 'TN',
        'edu-desired-facility-city': 'Test',
        'edu-prior-facility-name': 'Old Test School',
        'edu-prior-facility-state': 'TN',
        'edu-prior-facility-city': 'Terst',
        'edu-prior-facility-end-date': '2018-03-02',
        'preferred-contact-method': 'mail',
        married: 'Yes',
        'dependent-children': 'No',
        'dependent-parent': 'No',
        'direct-deposit-method': 'startUpdate',
        'direct-deposit-account-type': 'checking',
      });
    });
  });
  describe('directDepositMethod for production env', () => {
    const automatedTest = true;
    const directDeposit = directDepositMethod({}, automatedTest);
    expect(directDeposit).not.to.be.null;
  });
});
