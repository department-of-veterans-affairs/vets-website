import { expect } from 'chai';
import { disabilityBenefitsWorkflow } from '../../../pages/disabilityBenefits/index';
import { daysFromToday } from '../../utils/dates/dateHelper';

describe('disabilityBenefitsWorkflow depends functions', () => {
  const newOnlyData = {
    'view:claimType': {
      'view:claimingIncrease': false,
      'view:claimingNew': true,
    },
    newDisabilities: [{ condition: 'asthma' }],
  };

  const increaseOnlyData = {
    'view:claimType': {
      'view:claimingIncrease': true,
      'view:claimingNew': false,
    },
    ratedDisabilities: [{}],
  };

  const increaseAndNewData = {
    'view:claimType': {
      'view:claimingIncrease': true,
      'view:claimingNew': true,
    },
    ratedDisabilities: [{}],
    newDisabilities: [{ condition: 'asthma' }],
  };

  const noneSelected = {
    'view:claimType': {
      'view:claimingIncrease': false,
      'view:claimingNew': false,
    },
  };

  const isBDDTrueData = {
    'view:isBddData': true,
    serviceInformation: {
      servicePeriods: [
        {
          dateRange: {
            to: daysFromToday(90),
          },
        },
      ],
    },
  };

  const noRatedDisabilities = {
    'view:claimType': {
      'view:claimingNew': true,
    },
    newDisabilities: [{ condition: 'asthma' }],
  };

  describe('followUpDesc.depends', () => {
    it('should return true when isClaimingNew is true, claimingNew is true, and not BDD', () => {
      const formData = {
        ...newOnlyData,
      };
      expect(disabilityBenefitsWorkflow.followUpDesc.depends(formData)).to.be
        .true;
    });

    it('should return false when isClaimingNew is false', () => {
      const formData = {
        ...increaseOnlyData,
      };
      expect(disabilityBenefitsWorkflow.followUpDesc.depends(formData)).to.be
        .false;
    });

    it('should return false when claimingNew is false', () => {
      const formData = {
        ...noneSelected,
      };
      expect(disabilityBenefitsWorkflow.followUpDesc.depends(formData)).to.be
        .false;
    });

    it('should return false when isBDD is true', () => {
      const formData = {
        ...newOnlyData,
        ...isBDDTrueData,
      };
      expect(disabilityBenefitsWorkflow.followUpDesc.depends(formData)).to.be
        .false;
    });

    it('should return true when user has no rated disabilities but isClaimingNew defaults to true', () => {
      const formData = {
        ...noRatedDisabilities,
      };
      expect(disabilityBenefitsWorkflow.followUpDesc.depends(formData)).to.be
        .true;
    });
  });

  describe('newDisabilityFollowUp.depends', () => {
    it('should return true when isClaimingNew is true and claimingNew is true', () => {
      const formData = {
        ...newOnlyData,
      };
      expect(disabilityBenefitsWorkflow.newDisabilityFollowUp.depends(formData))
        .to.be.true;
    });

    it('should return true when user has no rated disabilities but isClaimingNew defaults to true', () => {
      const formData = {
        ...noRatedDisabilities,
      };
      expect(disabilityBenefitsWorkflow.newDisabilityFollowUp.depends(formData))
        .to.be.true;
    });

    it('should return false when isClaimingNew is false', () => {
      const formData = {
        ...increaseOnlyData,
      };
      expect(disabilityBenefitsWorkflow.newDisabilityFollowUp.depends(formData))
        .to.be.false;
    });

    it('should return false when claimingNew is false', () => {
      const formData = {
        ...noneSelected,
      };
      expect(disabilityBenefitsWorkflow.newDisabilityFollowUp.depends(formData))
        .to.be.false;
    });

    it('should return true when both increase and new are selected', () => {
      const formData = {
        ...increaseAndNewData,
      };
      expect(disabilityBenefitsWorkflow.newDisabilityFollowUp.depends(formData))
        .to.be.true;
    });
  });
});
