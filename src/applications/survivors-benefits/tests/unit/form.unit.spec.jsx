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

  const noSurvivorPension = { claims: { survivorPension: false } };
  expect(incomeAndAssets.depends(noSurvivorPension)).to.be.false;
  expect(submitSupportingDocs.depends(noSurvivorPension)).to.be.false;
  expect(totalAssets.depends(noSurvivorPension)).to.be.false;
  expect(transferredAssets.depends(noSurvivorPension)).to.be.false;
  expect(homeOwnership.depends(noSurvivorPension)).to.be.false;
  expect(landLotSize.depends(noSurvivorPension)).to.be.false;
  expect(additionalLandValue.depends(noSurvivorPension)).to.be.false;
  expect(marketableLand.depends(noSurvivorPension)).to.be.false;
  expect(incomeSources.depends(noSurvivorPension)).to.be.false;

  const withSurvivorPension = { claims: { survivorPension: true } };
  expect(incomeAndAssets.depends(withSurvivorPension)).to.be.true;
  expect(submitSupportingDocs.depends(withSurvivorPension)).to.be.false;
  expect(totalAssets.depends(withSurvivorPension)).to.be.false;
  expect(transferredAssets.depends(withSurvivorPension)).to.be.true;
  expect(homeOwnership.depends(withSurvivorPension)).to.be.true;
  expect(landLotSize.depends(withSurvivorPension)).to.be.false;
  expect(additionalLandValue.depends(withSurvivorPension)).to.be.false;
  expect(marketableLand.depends(withSurvivorPension)).to.be.false;
  expect(incomeSources.depends(withSurvivorPension)).to.be.true;

  const survivorPensionWithAllTrue = {
    claims: {
      survivorPension: true,
    },
    hasAssetsOverThreshold: true,
    homeOwnership: true,
    landLotSize: true,
  };
  expect(incomeAndAssets.depends(survivorPensionWithAllTrue)).to.be.true;
  expect(submitSupportingDocs.depends(survivorPensionWithAllTrue)).to.be.true;
  expect(totalAssets.depends(survivorPensionWithAllTrue)).to.be.false;
  expect(transferredAssets.depends(survivorPensionWithAllTrue)).to.be.true;
  expect(homeOwnership.depends(survivorPensionWithAllTrue)).to.be.true;
  expect(landLotSize.depends(survivorPensionWithAllTrue)).to.be.true;
  expect(additionalLandValue.depends(survivorPensionWithAllTrue)).to.be.true;
  expect(marketableLand.depends(survivorPensionWithAllTrue)).to.be.true;
  expect(incomeSources.depends(survivorPensionWithAllTrue)).to.be.true;

  const survivorPensionWithAllFalse = {
    claims: {
      survivorPension: true,
    },
    hasAssetsOverThreshold: false,
    homeOwnership: false,
    landLotSize: false,
  };
  expect(incomeAndAssets.depends(survivorPensionWithAllFalse)).to.be.true;
  expect(submitSupportingDocs.depends(survivorPensionWithAllFalse)).to.be.false;
  expect(totalAssets.depends(survivorPensionWithAllFalse)).to.be.true;
  expect(transferredAssets.depends(survivorPensionWithAllFalse)).to.be.true;
  expect(homeOwnership.depends(survivorPensionWithAllFalse)).to.be.true;
  expect(landLotSize.depends(survivorPensionWithAllFalse)).to.be.false;
  expect(additionalLandValue.depends(survivorPensionWithAllFalse)).to.be.false;
  expect(marketableLand.depends(survivorPensionWithAllFalse)).to.be.false;
  expect(incomeSources.depends(survivorPensionWithAllFalse)).to.be.true;
});
