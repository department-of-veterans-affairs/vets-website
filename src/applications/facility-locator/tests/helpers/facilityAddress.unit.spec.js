import { expect } from 'chai';
import {
  buildAddressArray,
  titleCaseFacilityName,
} from '../../utils/facilityAddress';
import { LocationType } from '../../constants';

describe('titleCaseFacilityName', () => {
  it('Should convert all caps to title case', () => {
    const actual = titleCaseFacilityName('FAYETTEVILLE VA MEDICAL CENTER');
    expect(actual).to.equal('Fayetteville VA Medical Center');
  });
});

describe('buildAddressArray', () => {
  describe('with titleCase = false (default)', () => {
    it('Should leave all caps address data in all caps', () => {
      const ccpProviderLocation = {
        id:
          'ccp_222196a93173f5ea6cd64c16d5e986a48571a201848dddbc4e313a6185bb0774',
        type: LocationType.CC_PROVIDER,
        attributes: {
          address: {
            city: 'AUSTIN',
            state: 'TX',
            street: '2610 LAKE AUSTIN BLVD',
            zip: '78703',
          },
        },
      };

      const actual = buildAddressArray(ccpProviderLocation);
      expect(actual).to.eql(['2610 LAKE AUSTIN BLVD', 'AUSTIN, TX 78703']);
    });

    it('Should leave all caps address data in all caps for VA location', () => {
      const vaLocation = {
        id:
          'ccp_222196a93173f5ea6cd64c16d5e986a48571a201848dddbc4e313a6185bb0774',
        type: LocationType.VA_FACILITIES,
        attributes: {
          address: {
            physical: {
              city: 'AUSTIN',
              state: 'TX',
              address1: '2610 LAKE AUSTIN BLVD',
              address2: 'SUITE 100',
              address3: 'UPPER LEVEL',
              zip: '78703',
            },
          },
        },
      };

      const actual = buildAddressArray(vaLocation);
      expect(actual).to.eql([
        '2610 LAKE AUSTIN BLVD',
        'SUITE 100',
        'UPPER LEVEL',
        'AUSTIN, TX 78703',
      ]);
    });
  });

  describe('with titleCase = true', () => {
    it('Should convert all caps address fields to title case for CC_PROVIDER location', () => {
      const ccpProviderLocation = {
        id:
          'ccp_222196a93173f5ea6cd64c16d5e986a48571a201848dddbc4e313a6185bb0774',
        type: LocationType.CC_PROVIDER,
        attributes: {
          address: {
            city: 'AUSTIN',
            state: 'TX',
            street: '2610 LAKE AUSTIN BLVD',
            zip: '78703',
          },
        },
      };

      const actual = buildAddressArray(ccpProviderLocation, true);
      expect(actual).to.eql(['2610 Lake Austin Blvd', 'Austin, TX 78703']);
    });

    it('Should convert all caps address fields to title case for VA location', () => {
      const vaLocation = {
        id:
          'ccp_222196a93173f5ea6cd64c16d5e986a48571a201848dddbc4e313a6185bb0774',
        type: LocationType.VA_FACILITIES,
        attributes: {
          address: {
            physical: {
              city: 'AUSTIN',
              state: 'TX',
              address1: '2610 LAKE AUSTIN BLVD',
              address2: 'SUITE 100',
              address3: 'UPPER LEVEL',
              zip: '78703',
            },
          },
        },
      };

      const actual = buildAddressArray(vaLocation, true);
      expect(actual).to.eql([
        '2610 Lake Austin Blvd',
        'Suite 100',
        'Upper Level',
        'Austin, TX 78703',
      ]);
    });
  });
});
