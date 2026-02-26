import { expect } from 'chai';
import formConfig from '../../config/form';

describe('Survivors Benefits Form config', () => {
  describe('Chapter 2: Claimant Information with different data sets', () => {
    it('should show claimantOther page when claimantRelationship is OTHER', () => {
      const { claimantInformation } = formConfig.chapters;
      const { pages } = claimantInformation;
      const { claimantOther } = pages;

      const relationshipOther = { claimantRelationship: 'OTHER' };
      const survivingSpouse = { claimantRelationship: 'SURVIVING_SPOUSE' };
      const custodian = {
        claimantRelationship: 'CUSTODIAN_FILING_FOR_CHILD_UNDER_18',
      };
      const helplessAdultChild = {
        claimantRelationship: 'HELPLESS_ADULT_CHILD',
      };

      // Should show when claimant relationship is OTHER
      expect(claimantOther.depends(relationshipOther)).to.be.true;

      // Should NOT show for any other valid relationship
      expect(claimantOther.depends(survivingSpouse)).to.be.false;
      expect(claimantOther.depends(custodian)).to.be.false;
      expect(claimantOther.depends(helplessAdultChild)).to.be.false;
    });
  });

  describe('Chapter 3: Military History with different data sets', () => {
    it('should show military history pages when receivedBenefits is false', () => {
      const { militaryHistory } = formConfig.chapters;
      const { pages } = militaryHistory;

      const receivedBenefitsFalse = { receivedBenefits: false };
      const receivedBenefitsTrue = { receivedBenefits: true };

      // These pages should show when receivedBenefits is false
      expect(pages.servicePeriod.depends(receivedBenefitsFalse)).to.be.true;
      expect(pages.nationalGuardService.depends(receivedBenefitsFalse)).to.be
        .true;
      expect(pages.prisonerOfWar.depends(receivedBenefitsFalse)).to.be.true;

      // These pages should hide when receivedBenefits is true
      expect(pages.servicePeriod.depends(receivedBenefitsTrue)).to.be.false;
      expect(pages.nationalGuardService.depends(receivedBenefitsTrue)).to.be
        .false;
      expect(pages.prisonerOfWar.depends(receivedBenefitsTrue)).to.be.false;
    });

    it('should show National Guard pages when nationalGuardActivated is true', () => {
      const { militaryHistory } = formConfig.chapters;
      const { pages } = militaryHistory;

      const nationalGuardActivatedTrue = { nationalGuardActivated: true };
      const nationalGuardActivatedFalse = { nationalGuardActivated: false };

      // These pages should show when nationalGuardActivated is true
      expect(
        pages.nationalGuardServicePeriod.depends(nationalGuardActivatedTrue),
      ).to.be.true;
      expect(pages.nationalGuardUnitAddress.depends(nationalGuardActivatedTrue))
        .to.be.true;

      // These pages should hide when nationalGuardActivated is false
      expect(
        pages.nationalGuardServicePeriod.depends(nationalGuardActivatedFalse),
      ).to.be.false;
      expect(
        pages.nationalGuardUnitAddress.depends(nationalGuardActivatedFalse),
      ).to.be.false;
    });

    it('should show POW period page when pow is true', () => {
      const { militaryHistory } = formConfig.chapters;
      const { pages } = militaryHistory;

      const powTrue = { pow: true };
      const powFalse = { pow: false };

      expect(pages.powPeriodOfTime.depends(powTrue)).to.be.true;
      expect(pages.powPeriodOfTime.depends(powFalse)).to.be.false;
    });
  });

  describe('Chapter 4: Household Information with different data sets', () => {
    it('should show marriage pages when claimantRelationship is SURVIVING_SPOUSE', () => {
      const { householdInformation } = formConfig.chapters;
      const { pages } = householdInformation;

      const survivingSpouse = { claimantRelationship: 'SURVIVING_SPOUSE' };
      const other = { claimantRelationship: 'OTHER' };

      // These pages should show for surviving spouse
      expect(pages.marriageToVeteran.depends(survivingSpouse)).to.be.true;
      expect(pages.marriageToVeteranLocation.depends(survivingSpouse)).to.be
        .true;
      expect(pages.marriageToVeteranInfo.depends(survivingSpouse)).to.be.true;
      expect(pages.marriageToVeteranEndInfo.depends(survivingSpouse)).to.be
        .true;
      expect(pages.legalStatusOfMarriage.depends(survivingSpouse)).to.be.true;
      expect(pages.marriageStatus.depends(survivingSpouse)).to.be.true;
      expect(pages.remarriage.depends(survivingSpouse)).to.be.true;
      expect(pages.spouseMarriages.depends(survivingSpouse)).to.be.true;

      // These pages should hide for other relationships
      expect(pages.marriageToVeteran.depends(other)).to.be.false;
      expect(pages.marriageToVeteranLocation.depends(other)).to.be.false;
      expect(pages.marriageToVeteranInfo.depends(other)).to.be.false;
      expect(pages.marriageToVeteranEndInfo.depends(other)).to.be.false;
      expect(pages.legalStatusOfMarriage.depends(other)).to.be.false;
      expect(pages.marriageStatus.depends(other)).to.be.false;
      expect(pages.remarriage.depends(other)).to.be.false;
      expect(pages.spouseMarriages.depends(other)).to.be.false;
    });

    it('should show marriageToVeteranEnd when not married at time of death', () => {
      const { householdInformation } = formConfig.chapters;
      const { pages } = householdInformation;

      const notMarriedAtDeath = {
        claimantRelationship: 'SURVIVING_SPOUSE',
        marriedToVeteranAtTimeOfDeath: false,
      };
      const marriedAtDeath = {
        claimantRelationship: 'SURVIVING_SPOUSE',
        marriedToVeteranAtTimeOfDeath: true,
      };

      expect(pages.marriageToVeteranEnd.depends(notMarriedAtDeath)).to.be.true;
      expect(pages.marriageToVeteranEnd.depends(marriedAtDeath)).to.be.false;
    });

    it('should show reasonForSeparation when spouse did not live continuously with veteran', () => {
      const { householdInformation } = formConfig.chapters;
      const { pages } = householdInformation;

      const didNotLiveContinuously = {
        claimantRelationship: 'SURVIVING_SPOUSE',
        livedContinuouslyWithVeteran: false,
      };
      const livedContinuously = {
        claimantRelationship: 'SURVIVING_SPOUSE',
        livedContinuouslyWithVeteran: true,
      };

      expect(pages.reasonForSeparation.depends(didNotLiveContinuously)).to.be
        .true;
      expect(pages.reasonForSeparation.depends(livedContinuously)).to.be.false;
    });

    it('should show remarriage pages when remarried after veteran death', () => {
      const { householdInformation } = formConfig.chapters;
      const { pages } = householdInformation;

      const remarried = {
        claimantRelationship: 'SURVIVING_SPOUSE',
        remarriedAfterVeteralDeath: true,
      };
      const notRemarried = {
        claimantRelationship: 'SURVIVING_SPOUSE',
        remarriedAfterVeteralDeath: false,
      };

      expect(pages.remarriageDetails.depends(remarried)).to.be.true;
      expect(pages.additionalMarriages.depends(remarried)).to.be.true;

      expect(pages.remarriageDetails.depends(notRemarried)).to.be.false;
      expect(pages.additionalMarriages.depends(notRemarried)).to.be.false;
    });

    it('should show veteranChildren page when claimantRelationship is SURVIVING_SPOUSE or had previous marriages', () => {
      const { householdInformation } = formConfig.chapters;
      const { pages } = householdInformation;

      const survivingSpouse = { claimantRelationship: 'SURVIVING_SPOUSE' };
      const hadPreviousMarriages = { hadPreviousMarriages: true };
      const neither = {
        claimantRelationship: 'OTHER',
        hadPreviousMarriages: false,
      };

      // Should show when claimant is surviving spouse
      expect(pages.veteranChildren.depends(survivingSpouse)).to.be.true;
      // Should show when had previous marriages
      expect(pages.veteranChildren.depends(hadPreviousMarriages)).to.be.true;
      // Should hide when neither condition is met
      expect(pages.veteranChildren.depends(neither)).to.be.false;
    });

    it('should show dependentsResidence when children do not all live with spouse', () => {
      const { householdInformation } = formConfig.chapters;
      const { pages } = householdInformation;

      const someChildrenDontLiveWithSpouse = {
        veteranChildrenCount: 3,
        veteransChildren: [
          { livesWith: false, name: 'child1' },
          { livesWith: true, name: 'child2' },
          { livesWith: false, name: 'child3' },
        ],
      };
      const allChildrenLiveWithSpouse = {
        veteranChildrenCount: 3,
        veteransChildren: [
          { livesWith: true, name: 'child1' },
          { livesWith: true, name: 'child2' },
          { livesWith: true, name: 'child3' },
        ],
      };
      const noChildren = {
        veteranChildrenCount: 0,
        veteransChildren: [],
      };

      expect(pages.dependentsResidence.depends(someChildrenDontLiveWithSpouse))
        .to.to.be.true;
      expect(pages.dependentsResidence.depends(allChildrenLiveWithSpouse)).to.be
        .false;
      expect(pages.dependentsResidence.depends(noChildren)).to.be.false;
    });

    it('should show dependent pages when children live together but not with spouse', () => {
      const { householdInformation } = formConfig.chapters;
      const { pages } = householdInformation;

      const childrenLiveTogether = {
        childrenLiveTogetherButNotWithSpouse: true,
      };
      const childrenDontLiveTogether = {
        childrenLiveTogetherButNotWithSpouse: false,
      };

      expect(pages.dependentsAddress.depends(childrenLiveTogether)).to.be.true;
      expect(pages.dependentsName.depends(childrenLiveTogether)).to.be.true;

      expect(pages.dependentsAddress.depends(childrenDontLiveTogether)).to.be
        .false;
      expect(pages.dependentsName.depends(childrenDontLiveTogether)).to.be
        .false;
    });

    it('should show separationDetails when all separation conditions are met', () => {
      const { householdInformation } = formConfig.chapters;
      const { pages } = householdInformation;
      const { separationDetails } = pages;

      // Should show when all three conditions are met
      const allConditionsTrue = {
        claimantRelationship: 'SURVIVING_SPOUSE',
        livedContinuouslyWithVeteran: false,
        separationDueToAssignedReasons: 'DIVORCE',
      };
      expect(separationDetails.depends(allConditionsTrue)).to.be.ok;

      // Should NOT show when claimant is not surviving spouse
      const notSurvivingSpouse = {
        claimantRelationship: 'CHILD',
        livedContinuouslyWithVeteran: false,
        separationDueToAssignedReasons: 'DIVORCE',
      };
      expect(separationDetails.depends(notSurvivingSpouse)).not.to.be.ok;

      // Should NOT show when lived continuously (even if separation reason exists)
      const livedContinuously = {
        claimantRelationship: 'SURVIVING_SPOUSE',
        livedContinuouslyWithVeteran: true,
        separationDueToAssignedReasons: 'DIVORCE',
      };
      expect(separationDetails.depends(livedContinuously)).not.to.be.ok;

      // Should NOT show when no separation reason selected
      const noSeparationReason = {
        claimantRelationship: 'SURVIVING_SPOUSE',
        livedContinuouslyWithVeteran: false,
      };
      expect(separationDetails.depends(noSeparationReason)).not.to.be.ok;
    });

    it('dependentsResidence diplays residenceAlert if hideIf returns true when childrenLiveTogetherButNotWithSpouse is Yes', () => {
      const { householdInformation } = formConfig.chapters;
      const { pages } = householdInformation;
      const { dependentsResidence } = pages;
      const { uiSchema } = dependentsResidence;
      expect(uiSchema, 'dependentsResidence uiSchema not found').to.exist;
      const alertOptions = uiSchema.residenceAlert['ui:options'];
      expect(alertOptions, 'residenceAlert options not found').to.exist;
      const itemYes = {
        veteranChildrenCount: '1',
        childrenLiveTogetherButNotWithSpouse: 'Yes',
      };
      const itemNo = {
        veteranChildrenCount: '1',
        childrenLiveTogetherButNotWithSpouse: 'No',
      };
      const none = { veteranChildrenCount: '0' };

      expect(uiSchema.residenceAlert['ui:options'].hideIf(itemYes)).to.be.true;
      expect(uiSchema.residenceAlert['ui:options'].hideIf(itemNo)).to.be.false;
      expect(uiSchema.residenceAlert['ui:options'].hideIf(none)).to.be.false;
    });
  });

  describe('Chapter 5: Claim Information with different data sets', () => {
    it('should show dicBenefits page when DIC claim is selected', () => {
      const { claimInformation } = formConfig.chapters;
      const { pages } = claimInformation;

      const dicClaim = { claims: { DIC: true } };
      const noDicClaim = { claims: { DIC: false } };

      expect(pages.dicBenefits.depends(dicClaim)).to.be.true;
      expect(pages.dicBenefits.depends(noDicClaim)).to.be.false;
    });
  });

  describe('Chapter 6: Financial Information with different data sets', () => {
    it('should show base financial pages when survivorsPension is selected', () => {
      const { financialInformation } = formConfig.chapters;
      const { pages } = financialInformation;

      const withSurvivorsPension = { claims: { survivorsPension: true } };
      const noSurvivorsPension = { claims: { survivorsPension: false } };

      // These pages should show when survivorsPension is true
      expect(pages.incomeAndAssets.depends(withSurvivorsPension)).to.be.true;
      expect(pages.transferredAssets.depends(withSurvivorsPension)).to.be.true;
      expect(pages.homeOwnership.depends(withSurvivorsPension)).to.be.true;
      expect(pages.incomeSources.depends(withSurvivorsPension)).to.be.true;

      // These pages should hide when survivorsPension is false
      expect(pages.incomeAndAssets.depends(noSurvivorsPension)).to.be.false;
      expect(pages.transferredAssets.depends(noSurvivorsPension)).to.be.false;
      expect(pages.homeOwnership.depends(noSurvivorsPension)).to.be.false;
      expect(pages.incomeSources.depends(noSurvivorsPension)).to.be.false;
    });

    it('should show submitSupportingDocs when totalNetWorth is true', () => {
      const { financialInformation } = formConfig.chapters;
      const { pages } = financialInformation;

      const netWorthTrue = {
        claims: { survivorsPension: true },
        totalNetWorth: true,
      };
      const netWorthFalse = {
        claims: { survivorsPension: true },
        totalNetWorth: false,
      };

      expect(pages.submitSupportingDocs.depends(netWorthTrue)).to.be.true;
      expect(pages.submitSupportingDocs.depends(netWorthFalse)).to.be.false;
    });

    it('should show totalAssets when totalNetWorth is false', () => {
      const { financialInformation } = formConfig.chapters;
      const { pages } = financialInformation;

      const netWorthFalse = {
        claims: { survivorsPension: true },
        totalNetWorth: false,
      };
      const netWorthTrue = {
        claims: { survivorsPension: true },
        totalNetWorth: true,
      };

      expect(pages.totalAssets.depends(netWorthFalse)).to.be.true;
      expect(pages.totalAssets.depends(netWorthTrue)).to.be.false;
    });

    it('should show landLotSize when homeOwnership is true', () => {
      const { financialInformation } = formConfig.chapters;
      const { pages } = financialInformation;

      const homeOwnershipTrue = {
        claims: { survivorsPension: true },
        homeOwnership: true,
      };
      const homeOwnershipFalse = {
        claims: { survivorsPension: true },
        homeOwnership: false,
      };

      expect(pages.landLotSize.depends(homeOwnershipTrue)).to.be.true;
      expect(pages.landLotSize.depends(homeOwnershipFalse)).to.be.false;
    });

    it('should show additional land pages when homeAcreageMoreThanTwo is true', () => {
      const { financialInformation } = formConfig.chapters;
      const { pages } = financialInformation;

      const moreThanTwoAcres = {
        claims: { survivorsPension: true },
        homeAcreageMoreThanTwo: true,
      };
      const lessThanTwoAcres = {
        claims: { survivorsPension: true },
        homeAcreageMoreThanTwo: false,
      };

      // These pages should show when homeAcreageMoreThanTwo is true
      expect(pages.additionalLandValue.depends(moreThanTwoAcres)).to.be.true;
      expect(pages.marketableLand.depends(moreThanTwoAcres)).to.be.true;

      // These pages should hide when homeAcreageMoreThanTwo is false
      expect(pages.additionalLandValue.depends(lessThanTwoAcres)).to.be.false;
      expect(pages.marketableLand.depends(lessThanTwoAcres)).to.be.false;
    });
  });
});
