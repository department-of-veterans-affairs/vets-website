import { transform } from '../../../src/js/pre-need/utils/helpers';
import { expect } from 'chai';

describe('Preneed helpers', () => {
  describe('transform', () => {
    it('should remove view fields', () => {
      const data = JSON.parse(transform({}, {
        data: {
          application: {
            claimant: {},
            veteran: {},
            'view:testing': 'asdfadf'
          }
        }
      }));

      expect(data.application['view:testing']).to.be.undefined;
    });

    it('should rename veteranHasBuried data', () => {
      const hasCurrentlyBuried = '1';
      const data = JSON.parse(transform({}, {
        data: {
          application: {
            claimant: {
              relationshipToVet: '1'
            },
            veteran: {},
            veteranHasBuried: hasCurrentlyBuried
          }
        }
      }));

      expect(data.application.hasCurrentlyBuried).to.equal(hasCurrentlyBuried);
    });

    it('should populate sponsorHasCurrentlyBuried data', () => {
      const hasCurrentlyBuried = '1';
      const data = JSON.parse(transform({}, {
        data: {
          application: {
            claimant: {},
            veteran: {},
            sponsorHasBuried: hasCurrentlyBuried
          }
        }
      }));

      expect(data.application.hasCurrentlyBuried).to.equal(hasCurrentlyBuried);
    });

    it('should populate service name', () => {
      const data = JSON.parse(transform({}, {
        data: {
          application: {
            claimant: {},
            veteran: {
              currentName: 'testing'
            },
            'view:testing': 'asdfadf'
          }
        }
      }));

      expect(data.application.veteran.serviceName).to.equal(data.application.veteran.currentName);
    });

    it('should remove partial addresses', () => {
      const data = JSON.parse(transform({}, {
        data: {
          application: {
            claimant: {
              address: {
                country: 'USA',
                city: 'test'
              }
            },
            veteran: {},
          }
        }
      }));

      expect(data.application.claimant.address).to.be.undefined;
    });
  });
});
