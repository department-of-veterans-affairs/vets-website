import { expect } from 'chai';
import formConfig from '../../config/form';

describe('Survivors Benefits Form config', () => {
  it('should have the correct settings for claimantOther', () => {
    const { claimantInformation } = formConfig.chapters;
    const { pages } = claimantInformation;
    const { claimantOther } = pages;
    const validClaimant = { claimantRelationship: 'SPOUSE' };
    const invalidClaimant = { claimantRelationship: 'OTHER' };

    expect(claimantOther.depends(validClaimant)).to.be.false;
    expect(claimantOther.depends(invalidClaimant)).to.be.true;
  });

  it('should have the correct setting for financialInformation', () => {
    const { financialInformation } = formConfig.chapters;
    const { pages } = financialInformation;

    const {
      incomeAndAssets,
      submitSupportingDocs,
      totalAssets,
      transferredAssets,
      homeOwnership,
      landLotSize,
      additionalLandValue,
      marketableLand,
      incomeSources,
    } = pages;

    const nosurvivorsPension = { claims: { survivorsPension: false } };
    expect(incomeAndAssets.depends(nosurvivorsPension)).to.be.false;
    expect(submitSupportingDocs.depends(nosurvivorsPension)).to.be.false;
    expect(totalAssets.depends(nosurvivorsPension)).to.be.false;
    expect(transferredAssets.depends(nosurvivorsPension)).to.be.false;
    expect(homeOwnership.depends(nosurvivorsPension)).to.be.false;
    expect(landLotSize.depends(nosurvivorsPension)).to.be.false;
    expect(additionalLandValue.depends(nosurvivorsPension)).to.be.false;
    expect(marketableLand.depends(nosurvivorsPension)).to.be.false;
    expect(incomeSources.depends(nosurvivorsPension)).to.be.false;

    const withsurvivorsPension = { claims: { survivorsPension: true } };
    expect(incomeAndAssets.depends(withsurvivorsPension)).to.be.true;
    expect(submitSupportingDocs.depends(withsurvivorsPension)).to.be.false;
    expect(totalAssets.depends(withsurvivorsPension)).to.be.false;
    expect(transferredAssets.depends(withsurvivorsPension)).to.be.true;
    expect(homeOwnership.depends(withsurvivorsPension)).to.be.true;
    expect(landLotSize.depends(withsurvivorsPension)).to.be.false;
    expect(additionalLandValue.depends(withsurvivorsPension)).to.be.false;
    expect(marketableLand.depends(withsurvivorsPension)).to.be.false;
    expect(incomeSources.depends(withsurvivorsPension)).to.be.true;

    const survivorsPensionWithAllTrue = {
      claims: {
        survivorsPension: true,
      },
      totalNetWorth: true,
      homeOwnership: true,
      homeAcreageMoreThanTwo: true,
    };
    expect(incomeAndAssets.depends(survivorsPensionWithAllTrue)).to.be.true;
    expect(submitSupportingDocs.depends(survivorsPensionWithAllTrue)).to.be
      .true;
    expect(totalAssets.depends(survivorsPensionWithAllTrue)).to.be.false;
    expect(transferredAssets.depends(survivorsPensionWithAllTrue)).to.be.true;
    expect(homeOwnership.depends(survivorsPensionWithAllTrue)).to.be.true;
    expect(landLotSize.depends(survivorsPensionWithAllTrue)).to.be.true;
    expect(additionalLandValue.depends(survivorsPensionWithAllTrue)).to.be.true;
    expect(marketableLand.depends(survivorsPensionWithAllTrue)).to.be.true;
    expect(incomeSources.depends(survivorsPensionWithAllTrue)).to.be.true;

    const survivorsPensionWithAllFalse = {
      claims: {
        survivorsPension: true,
      },
      totalNetWorth: false,
      homeOwnership: false,
      homeAcreageMoreThanTwo: false,
    };
    expect(incomeAndAssets.depends(survivorsPensionWithAllFalse)).to.be.true;
    expect(submitSupportingDocs.depends(survivorsPensionWithAllFalse)).to.be
      .false;
    expect(totalAssets.depends(survivorsPensionWithAllFalse)).to.be.true;
    expect(transferredAssets.depends(survivorsPensionWithAllFalse)).to.be.true;
    expect(homeOwnership.depends(survivorsPensionWithAllFalse)).to.be.true;
    expect(landLotSize.depends(survivorsPensionWithAllFalse)).to.be.false;
    expect(additionalLandValue.depends(survivorsPensionWithAllFalse)).to.be
      .false;
    expect(marketableLand.depends(survivorsPensionWithAllFalse)).to.be.false;
    expect(incomeSources.depends(survivorsPensionWithAllFalse)).to.be.true;
  });

  it('should check that the depends functions are true or false', async () => {
    const formData = {
      form: {
        data: {
          receivedBenefits: false,
          nationalGuardActivated: false,
          pow: false,
          claimantRelationship: 'SURVIVING_SPOUSE',
          livedContinuouslyWithVeteran: false,
          separationDueToAssignedReasons: 'DIVORCE',
          hadPreviousMarriages: true,
          veteranChildrenCount: 3,
          veteransChildren: [
            { livesWith: false, name: 'child1' },
            { livesWith: true, name: 'child2' },
            { livesWith: false, name: 'child3' },
          ],
          childrenLiveTogetherButNotWithSpouse: true,
          remarriedAfterVeteralDeath: true,
          claims: {
            DIC: true,
            survivorsPension: true,
          },
        },
      },
    };

    const invalidClaimant = { claimantRelationship: 'OTHER' };

    const {
      livedContinuouslyWithVeteran,
      claimantRelationship,
      childrenLiveTogetherButNotWithSpouse,
      claims,
      receivedBenefits,
      nationalGuardActivated,
      pow,
      veteranChildrenCount,
      veteransChildren,
      remarriedAfterVeteralDeath,
      hadPreviousMarriages,
    } = formData.form.data;

    const {
      militaryHistory,
      householdInformation,
      claimInformation,
    } = formConfig.chapters;

    const {
      pages: {
        servicePeriod,
        nationalGuardService,
        nationalGuardServicePeriod,
        nationalGuardUnitAddress,
        powPeriodOfTime,
        prisonerOfWar,
        ...otherServiceNamesPages
      },
    } = militaryHistory;

    const {
      pages: {
        marriageToVeteran,
        marriageToVeteranLocation,
        marriageToVeteranInfo,
        marriageToVeteranEnd,
        marriageToVeteranEndInfo,
        legalStatusOfMarriage,
        marriageStatus,
        reasonForSeparation,
        separationDetails,
        remarriage,
        remarriageDetails,
        additionalMarriages,
        spouseMarriages,
        veteranChildren,
        dependentsResidence,
        dependentsAddress,
        dependentsName,
      },
    } = householdInformation;

    const {
      pages: { dicBenefits },
    } = claimInformation;

    expect(servicePeriod.depends(receivedBenefits)).to.be.false;
    expect(nationalGuardService.depends(nationalGuardActivated)).to.be.false;
    expect(nationalGuardServicePeriod.depends(nationalGuardActivated)).to.be
      .false;
    expect(nationalGuardUnitAddress.depends(nationalGuardActivated)).to.be
      .false;
    expect(
      otherServiceNamesPages.otherServiceNamesIntro.depends(receivedBenefits),
    ).to.be.false;
    expect(
      otherServiceNamesPages.otherServiceNamesSummary.depends(receivedBenefits),
    ).to.be.false;
    expect(
      otherServiceNamesPages.otherServiceNamePage.depends(receivedBenefits),
    ).to.be.false;
    expect(powPeriodOfTime.depends(pow)).to.be.false;
    expect(marriageToVeteran.depends({ claimantRelationship })).to.be.true;
    expect(marriageToVeteran.depends(invalidClaimant)).to.be.false;
    expect(marriageToVeteranLocation.depends({ claimantRelationship })).to.be
      .true;
    expect(marriageToVeteranInfo.depends({ claimantRelationship })).to.be.true;
    expect(marriageToVeteranEnd.depends({ claimantRelationship })).to.be.true;
    expect(marriageToVeteranEndInfo.depends({ claimantRelationship })).to.be
      .true;
    expect(legalStatusOfMarriage.depends({ claimantRelationship })).to.be.true;
    expect(marriageStatus.depends({ claimantRelationship })).to.be.true;
    expect(
      reasonForSeparation.depends({
        livedContinuouslyWithVeteran,
        claimantRelationship,
      }),
    ).to.be.true;
    expect(
      separationDetails.depends({
        claimantRelationship,
      }),
    ).to.be.true;
    expect(remarriage.depends({ claimantRelationship })).to.be.true;
    expect(
      remarriageDetails.depends({
        claimantRelationship,
        remarriedAfterVeteralDeath,
      }),
    ).to.be.true;
    expect(
      additionalMarriages.depends({
        claimantRelationship,
        remarriedAfterVeteralDeath,
      }),
    ).to.be.true;
    expect(spouseMarriages.depends({ claimantRelationship })).to.be.true;
    expect(veteranChildren.depends({ claimantRelationship })).to.be.true;
    expect(veteranChildren.depends({ hadPreviousMarriages })).to.be.true;
    expect(
      dependentsResidence.depends({
        veteranChildrenCount,
        veteransChildren,
      }),
    ).to.be.true;
    expect(
      dependentsResidence.depends({
        veteranChildrenCount,
        veteransChildren: veteransChildren.map(child => ({
          ...child,
          livesWith: true,
        })),
      }),
    ).to.be.false; // skips page if all children live with the spouse
    expect(
      dependentsResidence.depends({
        veteranChildrenCount: 0,
        veteransChildren,
      }),
    ).to.be.false; // skips page if no children are reported
    expect(dependentsAddress.depends({ childrenLiveTogetherButNotWithSpouse }))
      .to.be.true;
    expect(dependentsName.depends({ childrenLiveTogetherButNotWithSpouse })).to
      .be.true;
    expect(dicBenefits.depends({ claims, ...claims.DIC })).to.be.true;
    expect(prisonerOfWar.depends({ pow })).to.be.false;
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
