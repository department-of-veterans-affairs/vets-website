import { transform } from '../../utils/helpers';
import { expect } from 'chai';

describe('Preneed helpers', () => {
  describe('transform', () => {
    test('should remove view fields', () => {
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

    test('should populate service name', () => {
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

    test('should remove partial addresses', () => {
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
