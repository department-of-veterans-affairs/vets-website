import { expect } from 'chai';
import { isHealthAndHealthConnect } from '../../utils/phoneNumbers';

describe('phone number utils', () => {
  describe('isHealthAndHealthConnect', () => {
    it('should return true for VA health if the health connect number exists', () => {
      expect(
        isHealthAndHealthConnect(
          {
            attributes: {
              phone: {
                healthConnect: '123-456-7890',
              },
            },
          },
          {
            facilityType: 'health',
          },
        ),
      ).to.be.true;
    });

    it('should return false for VA health if the health connect number does not exist', () => {
      expect(
        isHealthAndHealthConnect(
          {
            attributes: {
              phone: {
                fax: '123-456-7890',
              },
            },
          },
          {
            facilityType: 'health',
          },
        ),
      ).to.be.false;
    });

    it('should return false for VA health if the health connect number is empty', () => {
      expect(
        isHealthAndHealthConnect(
          {
            attributes: {
              phone: {
                healthConnect: '',
              },
            },
          },
          {
            facilityType: 'health',
          },
        ),
      ).to.be.false;
    });

    it('should return false for Vet Centers', () => {
      expect(
        isHealthAndHealthConnect(
          {
            attributes: {
              phone: {
                healthConnect: '123-456-7890',
              },
            },
          },
          {
            facilityType: 'vet_center',
          },
        ),
      ).to.be.false;
    });
  });
});
