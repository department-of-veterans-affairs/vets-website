import sinon from 'sinon';
import { expect } from 'chai';
import _ from 'lodash';

import {
  flatten,
  validateDisability,
  transformDisabilities,
  addPhoneEmailToCard,
  prefillTransformer,
  get4142Selection,
  queryForFacilities
} from '../helpers.jsx';
import initialData from './schema/initialData.js';

describe('526 helpers', () => {
  const prefilledData = _.cloneDeep(initialData);
  const invalidDisability = prefilledData.disabilities[1];
  const validDisability = Object.assign({ disabilityActionType: 'INCREASE' }, invalidDisability);
  describe('flatten', () => {
    it('should flatten sibling arrays', () => {
      const treatments = [
        {
          treatment: {
            treatmentCenterName: 'local VA center'
          }
        }
      ];
      prefilledData.disabilities[0].treatments = treatments;
      const flattened = flatten(prefilledData);
      expect(flattened.treatments).to.exist;
      expect(flattened.disabilities[0].treatments).to.not.exist;
    });
  });
  describe('validateDisability', () => {
    it('should reject invalid disability data', () => {
      expect(validateDisability(invalidDisability)).to.equal(false);
    });
    it('should accept valid disability data', () => {
      expect(validateDisability(validDisability)).to.equal(true);
    });
  });
  describe('transformDisabilities', () => {
    it('should create a list of disabilities with disabilityActionType set to INCREASE', () => {
      expect(transformDisabilities([invalidDisability])).to.deep.equal([validDisability]);
    });
  });
  describe('addPhoneEmailToCard', () => {
    it('should return formData when veteran property does not exist', () => {
      const formData = { disabilities: {} };
      const newFormData = addPhoneEmailToCard(formData);
      expect(newFormData).to.equal(formData);
    });
    it('should return a new object with correctly-modified formData', () => {
      const formData = { disabilities: {}, veteran: { primaryPhone: '1234567890', emailAddress: 'a@b.c' } };
      const newFormData = addPhoneEmailToCard(formData);
      expect(newFormData).to.not.equal(formData);
      expect(newFormData.veteran.primaryPhone).to.be.undefined;
      expect(newFormData.veteran.emailAddress).to.be.undefined;
      expect(newFormData.veteran.phoneEmailCard).to.exist;

      const { primaryPhone, emailAddress } = newFormData.veteran.phoneEmailCard;
      expect(primaryPhone).to.equal(formData.veteran.primaryPhone);
      expect(emailAddress).to.equal(formData.veteran.emailAddress);
    });
  });
  describe('prefillTransformer', () => {
    it('should transform prefilled disabilities', () => {
      const { formData: transformedPrefill } = prefillTransformer([], prefilledData);
      expect(transformedPrefill.disabilities[0].disabilityActionType).to.equal('INCREASE');
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
