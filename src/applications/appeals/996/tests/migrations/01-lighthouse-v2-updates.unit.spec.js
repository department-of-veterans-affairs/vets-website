import { expect } from 'chai';

import version2Updates, {
  forceV2Migration,
} from '../../migrations/01-lighthouse-v2-updates';

import saveInProgress from '../fixtures/data/save-in-progress-v1';
import transformed01 from '../fixtures/data/migrated/01-migrated-v1-to-v2';

describe('HLR v2 migration', () => {
  describe('forceV2Migration', () => {
    it('should return force migrated v2 data', () => {
      expect(forceV2Migration(saveInProgress().formData)).to.deep.equal(
        transformed01().formData,
      );
    });
    it('should return force migrated v2 data & rep', () => {
      const data = {
        veteran: {},
        zipCode5: '54321',
        sameOffice: 'test',
        informalConference: 'rep',
        informalConferenceRep: { name: 'Name McNamerson' },
        informalConferenceTimes: { foo: 'test' },
      };
      const result = {
        veteran: { zipCode5: '54321' },
        informalConference: 'rep',
        informalConferenceRep: { firstName: '', lastName: 'Name McNamerson' },
        informalConferenceTimes: {},
      };
      expect(forceV2Migration(data)).to.deep.equal(result);
    });
    it('should return force migrated v2 data without rep', () => {
      const data = {
        veteran: {},
        zipCode5: '54321',
        sameOffice: 'test',
        informalConference: 'yes', // self
        informalConferenceTimes: { foo: 'test' },
      };
      const result = {
        veteran: { zipCode5: '54321' },
        informalConference: 'yes',
        informalConferenceTimes: {},
      };
      expect(forceV2Migration(data)).to.deep.equal(result);
    });
  });

  describe('HLR version2Updates', () => {
    it('should return migrated v2 data', () => {
      const data = {
        formData: {
          veteran: {},
          zipCode5: '65432',
          sameOffice: false,
          informalConference: 'rep',
          informalConferenceRep: {
            name: 'James P. Sullivan',
            phone: '8005551212',
          },
          informalConferenceTimes: { foo: 'test' },
        },
        metadata: {
          version: 1,
          returnUrl: '/some-path',
        },
      };
      const result = {
        formData: {
          veteran: { zipCode5: '65432' },
          informalConference: 'rep',
          informalConferenceRep: {
            firstName: '',
            lastName: 'James P. Sullivan',
            phone: '8005551212',
          },
          informalConferenceTimes: {},
        },
        metadata: {
          version: 2,
          returnUrl: '/contact-information',
        },
      };
      expect(version2Updates(data)).to.deep.equal(result);
    });
    it('should return in progress data if v2 feature is disabled', () => {
      const data = {
        formData: { hlrV2: false },
        metadata: { test: true },
      };
      expect(version2Updates(data)).to.deep.equal(data);
    });
    it('should return in progress data if already using v2 data', () => {
      const data = {
        formData: { veteran: { zipCode5: '12345' } },
        metadata: { test: true },
      };
      expect(version2Updates(data)).to.deep.equal(data);
    });
    it('should migrate and return to veteran info page', () => {
      const sipData = saveInProgress('/veteran-information');
      const result = transformed01('/veteran-information');
      expect(version2Updates(sipData)).to.deep.equal(result);
    });
  });
});
