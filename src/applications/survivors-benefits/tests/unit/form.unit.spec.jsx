import { expect } from 'chai';
import formConfig from '../../config/form';

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
  expect(submitSupportingDocs.depends(survivorsPensionWithAllTrue)).to.be.true;
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
  expect(additionalLandValue.depends(survivorsPensionWithAllFalse)).to.be.false;
  expect(marketableLand.depends(survivorsPensionWithAllFalse)).to.be.false;
  expect(incomeSources.depends(survivorsPensionWithAllFalse)).to.be.true;
});
