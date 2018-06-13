import sinon from 'sinon';
import { expect } from 'chai';
import {
  flatten,
  isPrefillDataComplete,
  prefillTransformer,
  get4142Selection,
  getLatestTimestamp,
  queryForFacilities
} from '../helpers.jsx';
import initialData from './schema/initialData.js';

delete initialData.prefilled;
const treatments = [
  {
    treatment: {
      treatmentCenterName: 'local VA center'
    }
  }
];
initialData.disabilities[0].treatments = treatments;
const flattened = flatten(initialData);
const completeData = initialData;
const incompleteData = {};
const { formData: transformedPrefill } = prefillTransformer([], initialData, {}, { prefilStatus: 'success' });
const { formData: incompletePrefill } = prefillTransformer([], {}, {}, { prefilStatus: 'success' });

describe('526 helpers', () => {
  describe('flatten', () => {
    it('should flatten sibling arrays', () => {
      expect(flattened.treatments).to.exist;
      expect(flattened.disabilities[0].treatments).to.not.exist;
    });
  });
  describe('isPrefillDataComplete', () => {
    it('should reject incomplete prefilled data', () => {
      expect(isPrefillDataComplete(incompleteData)).to.equal(false);
    });
    it('should accept complete prefilled data', () => {
      expect(isPrefillDataComplete(completeData)).to.equal(true);
    });
  });
  describe('prefillTransformer', () => {
    it('should record if the form was prefilled', () => {
      expect(transformedPrefill.prefilled).to.be.true;
    });
    it('should not record if the form was not completely prefilled', () => {
      expect(incompletePrefill.prefilled).to.be.undefined;
    });
  });
  describe('get4142Selection', () => {
    const fullDisabilities = [
      {
        tag: 'shouldReturnTrue',
        'view:selected': true,
        'view:uploadPrivateRecords': 'no'
      },
      {
        tag: 'shouldReturnFalse'
      },
      {
        tag: 'shouldReturnFalse',
        'view:selected': true,
        'view:uploadPrivateRecords': 'yes'
      },
      {
        tag: 'shouldReturnFalse',
        'view:selected': true
      }
    ];

    it('should return true when at least one disability has 4142 selected', () => {
      expect(get4142Selection(fullDisabilities)).to.equal(true);
    });

    it('should return false when disability not selected for increase', () => {
      const disabilities = fullDisabilities.slice(1, 2);
      expect(get4142Selection(disabilities)).to.equal(false);
    });

    it('should return false when disability has upload PMR selected', () => {
      const disabilities = fullDisabilities.slice(2, 3);
      expect(get4142Selection(disabilities)).to.equal(false);
    });

    it('should return false when disability has no PMR supporting evidence', () => {
      const disabilities = fullDisabilities.slice(3);
      expect(get4142Selection(disabilities)).to.equal(false);
    });

    it('should return false when no disabilities have 4142 selected', () => {
      const disabilities = fullDisabilities.slice(1);
      expect(get4142Selection(disabilities)).to.equal(false);
    });
  });
  describe('getLatestTimestamp', () => {
    it('should return the most recent timestamp in a list of timestamps', () => {
      const timestamps = ['2015-03-30T16:19:09.000+00:00', '2016-03-30T16:19:09.000+00:00'];
      const latestTimestamp = getLatestTimestamp(timestamps);
      expect(latestTimestamp).to.equal('2016-03-30T16:19:09.000+00:00');
    });
  });
  describe('queryForFacilities', () => {
    const originalFetch = global.fetch;
    beforeEach(() => {
      // Replace fetch with a spy
      global.fetch = sinon.stub();
      global.fetch.resolves({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => ({
          data: [
            { id: 0, attributes: { name: 'first' } },
            { id: 1, attributes: { name: 'second' } },
          ]
        })
      });
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should not call the api if the input length is < 3', () => {
      queryForFacilities('12');
      expect(global.fetch.called).to.be.false;
    });

    it('should call the api if the input length is >= 3', () => {
      queryForFacilities('123');
      expect(global.fetch.called).to.be.true;
    });

    it('should call the api with the input', () => {
      queryForFacilities('asdf');
      expect(global.fetch.firstCall.args[0]).to.contain('/facilities/suggested?type%5B%5D=health&type%5B%5D=dod_health&name_part=asdf');
    });

    it('should return the mapped data for autosuggest if successful', (done) => {
      // Doesn't matter what we call this with since our stub will always return the same thing
      const requestPromise = queryForFacilities('asdf');
      requestPromise.then(result => {
        expect(result).to.eql([
          { id: 0, label: 'first' },
          { id: 1, label: 'second' },
        ]);
        done();
      }).catch(err => done(err));
    });

    it('should return an empty array if unsuccesful', (done) => {
      global.fetch.resolves({ ok: false });
      // Doesn't matter what we call this with since our stub will always return the same thing
      const requestPromise = queryForFacilities('asdf');
      requestPromise.then(result => {
        // This .then() fires after the apiRequest failure callback returns []
        expect(result).to.eql([]);
        done();
      }).catch(error => {
        done(error);
      });
    });
  });
});
