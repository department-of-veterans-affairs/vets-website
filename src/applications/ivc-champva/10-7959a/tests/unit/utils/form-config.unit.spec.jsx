import { expect } from 'chai';
import {
  isNotEnrolledInChampva,
  isRoleApplicant,
  isRoleSponsor,
  isRoleOther,
  isNewClaim,
  isResubmissionClaim,
  isResubmissionEnabled,
  canSelectAddress,
  isMedicalClaim,
  isPharmacyClaim,
  isNewMedicalClaim,
  isNewPharmacyClaim,
  hasOhi,
  hasOhiAndMedicalClaim,
  hasOhiMedicalAndMultiplePolicies,
} from '../../../utils/helpers/form-config';

describe('10-7959a form-config helpers', () => {
  context('enrollment status helpers', () => {
    it('should return true when certifierReceivedPacket is false', () => {
      expect(isNotEnrolledInChampva({ certifierReceivedPacket: false })).to.be
        .true;
    });

    it('should return false when certifierReceivedPacket is true', () => {
      expect(isNotEnrolledInChampva({ certifierReceivedPacket: true })).to.be
        .false;
    });
  });

  context('certifier role helpers', () => {
    it('isRoleApplicant should return true when role is applicant', () => {
      expect(isRoleApplicant({ certifierRole: 'applicant' })).to.be.true;
    });

    it('isRoleSponsor should return true when role is sponsor', () => {
      expect(isRoleSponsor({ certifierRole: 'sponsor' })).to.be.true;
    });

    it('isRoleOther should return true when role is other', () => {
      expect(isRoleOther({ certifierRole: 'other' })).to.be.true;
    });
  });

  context('claim status helpers', () => {
    it('isNewClaim should return true when claimStatus is new', () => {
      expect(isNewClaim({ claimStatus: 'new' })).to.be.true;
    });

    it('isResubmissionClaim should return true when claimStatus is resubmission', () => {
      expect(isResubmissionClaim({ claimStatus: 'resubmission' })).to.be.true;
    });

    it('isResubmissionEnabled should return true when view flag is set', () => {
      expect(
        isResubmissionEnabled({
          'view:champvaEnableClaimResubmitQuestion': true,
        }),
      ).to.be.true;
    });
  });

  context('beneficiary helpers', () => {
    it('should return true when certifier is sponsor and has address', () => {
      const formData = {
        certifierRole: 'sponsor',
        certifierAddress: { street: '123 Main St' },
      };
      expect(canSelectAddress(formData)).to.be.true;
    });

    it('should return true when certifier is other and sponsor has address', () => {
      const formData = {
        certifierRole: 'other',
        sponsorAddress: { street: '456 Oak Ave' },
      };
      expect(canSelectAddress(formData)).to.be.true;
    });

    it('should return false when certifier is applicant', () => {
      const formData = {
        certifierRole: 'applicant',
        certifierAddress: { street: '123 Main St' },
      };
      expect(canSelectAddress(formData)).to.be.false;
    });
  });

  context('claim type helpers', () => {
    it('isMedicalClaim should return true when claimType is medical', () => {
      expect(isMedicalClaim({ claimType: 'medical' })).to.be.true;
    });

    it('isPharmacyClaim should return true when claimType is pharmacy', () => {
      expect(isPharmacyClaim({ claimType: 'pharmacy' })).to.be.true;
    });

    it('isNewMedicalClaim should return true for new medical claim', () => {
      const formData = { claimType: 'medical', claimStatus: 'new' };
      expect(isNewMedicalClaim(formData)).to.be.true;
    });

    it('isNewPharmacyClaim should return true for new pharmacy claim', () => {
      const formData = { claimType: 'pharmacy', claimStatus: 'new' };
      expect(isNewPharmacyClaim(formData)).to.be.true;
    });
  });

  context('insurance helpers', () => {
    it('hasOhi should return true when new claim has OHI', () => {
      const formData = { claimStatus: 'new', hasOhi: true };
      expect(hasOhi(formData)).to.be.true;
    });

    it('hasOhi should return false when resubmission has OHI', () => {
      const formData = {
        claimStatus: 'resubmission',
        hasOhi: true,
        'view:champvaEnableClaimResubmitQuestion': true,
      };
      expect(hasOhi(formData)).to.be.false;
    });

    it('hasOhiAndMedicalClaim should return true for new medical claim with OHI', () => {
      const formData = {
        claimStatus: 'new',
        hasOhi: true,
        claimType: 'medical',
      };
      expect(hasOhiAndMedicalClaim(formData)).to.be.true;
    });

    it('hasOhiMedicalAndMultiplePolicies should return true with multiple policies', () => {
      const formData = {
        claimStatus: 'new',
        hasOhi: true,
        claimType: 'medical',
        policies: [{}, {}],
      };
      expect(hasOhiMedicalAndMultiplePolicies(formData)).to.be.true;
    });

    it('hasOhiMedicalAndMultiplePolicies should return false with one policy', () => {
      const formData = {
        claimStatus: 'new',
        hasOhi: true,
        claimType: 'medical',
        policies: [{}],
      };
      expect(hasOhiMedicalAndMultiplePolicies(formData)).to.be.false;
    });
  });
});
