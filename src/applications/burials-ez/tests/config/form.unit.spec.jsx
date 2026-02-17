import { expect } from 'chai';
import { render } from '@testing-library/react';

import formConfig from '../../config/form';

describe('Burials Form', () => {
  describe('claimantInformation', () => {
    it('should render relationship to veteran title', () => {
      const result = render(
        formConfig.chapters.claimantInformation.pages.relationshipToVeteran.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Relationship to Veteran');
    });

    it('should render personal information title', () => {
      const result = render(
        formConfig.chapters.claimantInformation.pages.personalInformation.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Personal Information');
    });

    it('should render mailing address title', () => {
      const result = render(
        formConfig.chapters.claimantInformation.pages.mailingAddress.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Mailing address');
    });

    it('should render contact information title', () => {
      const result = render(
        formConfig.chapters.claimantInformation.pages.contactInformation.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Contact information');
    });
  });

  describe('veteranInformation', () => {
    it('should render deceased veteran information title', () => {
      const result = render(
        formConfig.chapters.veteranInformation.pages.veteranInformation.reviewTitle(),
      );
      expect(result.container.textContent).to.eq(
        'Deceased Veteran information',
      );
    });

    it('should render burial dates title', () => {
      const result = render(
        formConfig.chapters.veteranInformation.pages.burialInformation.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Burial dates');
    });

    it('should render location of death title', () => {
      const result = render(
        formConfig.chapters.veteranInformation.pages.locationOfDeath.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Veteran death location');
    });
  });

  describe('militaryHistory', () => {
    it('should render separation documents title', () => {
      const result = render(
        formConfig.chapters.militaryHistory.pages.separationDocuments.reviewTitle(),
      );
      expect(result.container.textContent).to.eq(
        'DD214 or other separation documents',
      );
    });

    it('should render uploadDD214 title', () => {
      const result = render(
        formConfig.chapters.militaryHistory.pages.uploadDD214.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Veteran’s DD214');
    });
    it('should depend correctly for upload DD214', () => {
      const result =
        formConfig.chapters.militaryHistory.pages.uploadDD214.depends({
          'view:separationDocuments': true,
        });
      expect(result).to.eq(true);
    });

    it('should render servicePeriods title', () => {
      const result = render(
        formConfig.chapters.militaryHistory.pages.servicePeriods.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Service periods');
    });
    it('should depend correctly for service periods', () => {
      const result =
        formConfig.chapters.militaryHistory.pages.servicePeriods.depends({
          'view:separationDocuments': true,
        });
      expect(result).to.eq(false);
    });

    it('should render previousNamesQuestion title', () => {
      const result = render(
        formConfig.chapters.militaryHistory.pages.previousNamesQuestion.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Veteran’s previous names');
    });

    it('should depend correctly for previous names', () => {
      const result =
        formConfig.chapters.militaryHistory.pages.previousNames.depends({
          'view:servedUnderOtherNames': true,
        });
      expect(result).to.eq(true);
    });
  });

  describe('benefitsSelection', () => {
    it('should render benefits selection title', () => {
      const result = render(
        formConfig.chapters.benefitsSelection.pages.benefitsSelection.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Benefits selection');
    });
    it('should render burial allowance part one title', () => {
      const result = render(
        formConfig.chapters.benefitsSelection.pages.burialAllowancePartOne.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Burial allowance');
    });
    it('should depend correctly for burial allowance part one', () => {
      const result =
        formConfig.chapters.benefitsSelection.pages.burialAllowancePartOne.depends(
          { 'view:claimedBenefits': { burialAllowance: true } },
        );
      expect(result).to.eq(true);
    });

    it('should hide state of true when burial allowance not selected', () => {
      const result =
        formConfig.chapters.benefitsSelection.pages.burialAllowanceConfirmation.depends(
          {
            relationshipToVeteran: 'spouse',
            'view:claimedBenefits': {
              plotAllowance: true,
            },
            burialAllowanceRequested: {
              unclaimed: true,
            },
          },
        );
      expect(result).to.eq(undefined);
    });

    it('should show state of true when burial allowance not selected', () => {
      const result =
        formConfig.chapters.benefitsSelection.pages.burialAllowanceConfirmation.depends(
          {
            relationshipToVeteran: 'funeralDirector',
            'view:claimedBenefits': {
              burialAllowance: true,
            },
            burialAllowanceRequested: {
              unclaimed: true,
            },
          },
        );
      expect(result).to.eq(true);
    });

    it('should depend correctly for burial allowance part two', () => {
      const result =
        formConfig.chapters.benefitsSelection.pages.burialAllowancePartTwo.depends(
          { 'view:claimedBenefits': { burialAllowance: true } },
        );
      expect(result).to.eq(true);
    });

    it('should render final resting place title', () => {
      const result = render(
        formConfig.chapters.benefitsSelection.pages.finalRestingPlace.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Final resting place');
    });

    it('should depend correctly for final resting place', () => {
      const result =
        formConfig.chapters.benefitsSelection.pages.finalRestingPlace.depends({
          'view:claimedBenefits': { plotAllowance: true },
        });
      expect(result).to.eq(true);
    });

    it('should render national or federal cemetery title', () => {
      const result = render(
        formConfig.chapters.benefitsSelection.pages.nationalOrFederalCemetery.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Cemetery location');
    });

    it('should depend correctly for national or federal cemetery', () => {
      const result =
        formConfig.chapters.benefitsSelection.pages.nationalOrFederalCemetery.depends(
          { 'view:claimedBenefits': { plotAllowance: true } },
        );
      expect(result).to.eq(true);
    });

    it('should depend correctly for cemetery location question', () => {
      const result =
        formConfig.chapters.benefitsSelection.pages.cemeteryLocationQuestion.depends(
          { 'view:claimedBenefits': { plotAllowance: true } },
        );
      expect(result).to.eq(true);
    });

    it('should depend correctly for cemetery location', () => {
      const result =
        formConfig.chapters.benefitsSelection.pages.cemeteryLocation.depends({
          'view:claimedBenefits': { plotAllowance: true },
          cemetaryLocationQuestion: 'cemetery',
        });
      expect(result).to.eq(true);
    });

    it('should depend correctly for tribal land location', () => {
      const result =
        formConfig.chapters.benefitsSelection.pages.tribalLandLocation.depends({
          'view:claimedBenefits': { plotAllowance: true },
          cemetaryLocationQuestion: 'tribalLand',
        });
      expect(result).to.eq(true);
    });

    it('should render plot allowance part one title', () => {
      const result = render(
        formConfig.chapters.benefitsSelection.pages.plotAllowancePartOne.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Plot or interment allowance');
    });

    it('should depend correctly for plot allowance part one', () => {
      const result =
        formConfig.chapters.benefitsSelection.pages.plotAllowancePartOne.depends(
          { 'view:claimedBenefits': { plotAllowance: true } },
        );
      expect(result).to.eq(true);
    });

    it('should depend correctly for plot allowance part two', () => {
      const result =
        formConfig.chapters.benefitsSelection.pages.plotAllowancePartTwo.depends(
          { 'view:claimedBenefits': { plotAllowance: true } },
        );
      expect(result).to.eq(true);
    });

    it('should render transportation expenses title', () => {
      const result = render(
        formConfig.chapters.benefitsSelection.pages.transportationExpenses.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Transportation allowance');
    });

    it('should depend correctly for transportation expenses', () => {
      const result =
        formConfig.chapters.benefitsSelection.pages.transportationExpenses.depends(
          { 'view:claimedBenefits': { transportation: true } },
        );
      expect(result).to.eq(true);
    });
  });

  describe('additionalInformation', () => {
    it('should render death certificate title', () => {
      const result = render(
        formConfig.chapters.additionalInformation.pages.deathCertificate.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Death certificate');
    });

    it('should render transportation receipts title', () => {
      const result = render(
        formConfig.chapters.additionalInformation.pages.transportationReceipts.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Transportation receipts');
    });

    it('should depend correctly for transportation receipts', () => {
      const result =
        formConfig.chapters.additionalInformation.pages.transportationReceipts.depends(
          { transportationExpenses: true },
        );
      expect(result).to.eq(true);
    });

    it('should render additional evidence title', () => {
      const result = render(
        formConfig.chapters.additionalInformation.pages.additionalEvidence.reviewTitle(),
      );
      expect(result.container.textContent).to.eq('Additional evidence');
    });
  });
});
