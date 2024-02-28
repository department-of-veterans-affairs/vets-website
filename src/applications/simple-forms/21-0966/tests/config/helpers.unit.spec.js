import { expect } from 'chai';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/exports';
import {
  survivingDependentContactInformationChapterTitle,
  preparerIsSurvivingDependent,
  preparerIsThirdPartyToTheVeteran,
  preparerIsThirdPartyToASurvivingDependent,
  preparerIsThirdParty,
  preparerIsVeteran,
  survivingDependentPersonalInformationChapterTitle,
  benefitSelectionChapterTitle,
  initializeFormDataWithPreparerIdentificationAndPrefill,
  hasActiveCompensationITF,
  hasActivePensionITF,
  noActiveITF,
  hasVeteranPrefill,
  statementOfTruthFullNamePath,
  veteranPersonalInformationChapterTitle,
  veteranContactInformationChapterTitle,
  confirmationPageFormBypassed,
  confirmationPageAlertStatus,
  confirmationPageAlertHeadline,
  confirmationPageAlertParagraph,
  confirmationPageNextStepsParagraph,
} from '../../config/helpers';
import {
  preparerIdentifications,
  veteranBenefits,
  survivingDependentBenefits,
} from '../../definitions/constants';
import formConfig from '../../config/form';

describe('form helper functions', () => {
  it('test defaults for helper functions', () => {
    expect(preparerIsVeteran()).to.equal(false);
    expect(preparerIsSurvivingDependent()).to.equal(false);
    expect(preparerIsThirdPartyToTheVeteran()).to.equal(false);
    expect(preparerIsThirdPartyToASurvivingDependent()).to.equal(false);
    expect(preparerIsThirdParty()).to.equal(false);
    expect(benefitSelectionChapterTitle()).to.match(/Your benefit selection/i);
    expect(hasActiveCompensationITF()).to.equal(false);
    expect(hasActivePensionITF()).to.equal(false);
    expect(noActiveITF()).to.equal(true);
    expect(hasVeteranPrefill()).to.equal(false);
    expect(statementOfTruthFullNamePath()).to.equal(
      'survivingDependentFullName',
    );
    expect(survivingDependentPersonalInformationChapterTitle()).to.match(
      /Your personal information/i,
    );
    expect(survivingDependentContactInformationChapterTitle()).to.match(
      /Your contact information/i,
    );
    expect(veteranPersonalInformationChapterTitle()).to.match(
      /Veteran’s personal information/i,
    );
    expect(veteranContactInformationChapterTitle()).to.match(
      /Veteran’s contact information/i,
    );
  });

  it('provides the correct information for a veteran', () => {
    const formData = {
      preparerIdentification: 'VETERAN',
    };

    expect(preparerIsVeteran({ formData })).to.equal(true);
    expect(preparerIsSurvivingDependent({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToTheVeteran({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToASurvivingDependent({ formData })).to.equal(
      false,
    );
    expect(preparerIsThirdParty({ formData })).to.equal(false);
    expect(benefitSelectionChapterTitle({ formData })).to.match(/Your/i);
    expect(
      survivingDependentPersonalInformationChapterTitle({ formData }),
    ).to.match(/Your/i);
    expect(
      survivingDependentContactInformationChapterTitle({ formData }),
    ).to.match(/Your/i);
    expect(veteranPersonalInformationChapterTitle({ formData })).to.match(
      /Your/i,
    );
    expect(veteranContactInformationChapterTitle({ formData })).to.match(
      /Your/i,
    );
  });

  it('provides the correct information for a surviving dependent', () => {
    const formData = {
      preparerIdentification: 'SURVIVING_DEPENDENT',
    };

    expect(preparerIsVeteran({ formData })).to.equal(false);
    expect(preparerIsSurvivingDependent({ formData })).to.equal(true);
    expect(preparerIsThirdPartyToTheVeteran({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToASurvivingDependent({ formData })).to.equal(
      false,
    );
    expect(preparerIsThirdParty({ formData })).to.equal(false);
    expect(benefitSelectionChapterTitle({ formData })).to.match(/Your/i);
    expect(
      survivingDependentPersonalInformationChapterTitle({ formData }),
    ).to.match(/Your/i);
    expect(
      survivingDependentContactInformationChapterTitle({ formData }),
    ).to.match(/Your/i);
    expect(veteranPersonalInformationChapterTitle({ formData })).to.match(
      /Veteran/i,
    );
    expect(veteranContactInformationChapterTitle({ formData })).to.match(
      /Veteran/i,
    );
  });

  it('provides the correct information for a third party to the veteran', () => {
    const formData = {
      preparerIdentification: 'THIRD_PARTY_VETERAN',
    };

    expect(preparerIsVeteran({ formData })).to.equal(false);
    expect(preparerIsSurvivingDependent({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToTheVeteran({ formData })).to.equal(true);
    expect(preparerIsThirdPartyToASurvivingDependent({ formData })).to.equal(
      false,
    );
    expect(preparerIsThirdParty({ formData })).to.equal(true);
    expect(benefitSelectionChapterTitle({ formData })).to.match(/Veteran/i);
    expect(
      survivingDependentPersonalInformationChapterTitle({ formData }),
    ).to.match(/Veteran/i);
    expect(
      survivingDependentContactInformationChapterTitle({ formData }),
    ).to.match(/Veteran/i);
    expect(veteranPersonalInformationChapterTitle({ formData })).to.match(
      /Veteran/i,
    );
    expect(veteranContactInformationChapterTitle({ formData })).to.match(
      /Veteran/i,
    );
  });

  it('provides the correct information for a third party to the surviving dependent', () => {
    const formData = {
      preparerIdentification: 'THIRD_PARTY_SURVIVING_DEPENDENT',
    };

    expect(preparerIsVeteran({ formData })).to.equal(false);
    expect(preparerIsSurvivingDependent({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToTheVeteran({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToASurvivingDependent({ formData })).to.equal(
      true,
    );
    expect(preparerIsThirdParty({ formData })).to.equal(true);
    expect(benefitSelectionChapterTitle({ formData })).to.match(/Claimant/i);
    expect(
      survivingDependentPersonalInformationChapterTitle({ formData }),
    ).to.match(/Claimant/i);
    expect(
      survivingDependentContactInformationChapterTitle({ formData }),
    ).to.match(/Claimant/i);
    expect(veteranPersonalInformationChapterTitle({ formData })).to.match(
      /Veteran/i,
    );
    expect(veteranContactInformationChapterTitle({ formData })).to.match(
      /Veteran/i,
    );
  });

  it('provides a reasonble default', () => {
    const formData = {
      preparerIdentification: '',
    };

    expect(preparerIsVeteran({ formData })).to.equal(false);
    expect(preparerIsSurvivingDependent({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToTheVeteran({ formData })).to.equal(false);
    expect(preparerIsThirdPartyToASurvivingDependent({ formData })).to.equal(
      false,
    );
    expect(preparerIsThirdParty({ formData })).to.equal(false);
    expect(benefitSelectionChapterTitle({ formData })).to.match(/Your/i);
    expect(
      survivingDependentPersonalInformationChapterTitle({ formData }),
    ).to.match(/Your/i);
    expect(
      survivingDependentContactInformationChapterTitle({ formData }),
    ).to.match(/Your/i);
    expect(veteranPersonalInformationChapterTitle({ formData })).to.match(
      /Veteran/i,
    );
  });

  it('returns true for ITF functions when ITF formData values are present and false when values are empty objects', () => {
    const formData = {
      'view:activeCompensationITF': {
        expirationDate: new Date().toISOString(),
        status: 'active',
      },
      'view:activePensionITF': {},
    };

    expect(hasActiveCompensationITF({ formData })).to.equal(true);
    expect(hasActivePensionITF({ formData })).to.equal(false);
    expect(noActiveITF({ formData })).to.equal(false);

    formData['view:activeCompensationITF'] = {};
    formData['view:activePensionITF'] = {
      expirationDate: new Date().toISOString(),
      status: 'active',
    };

    expect(hasActiveCompensationITF({ formData })).to.equal(false);
    expect(hasActivePensionITF({ formData })).to.equal(true);
    expect(noActiveITF({ formData })).to.equal(false);
  });

  it('returns true for noActiveITF when there are no active ITFs', () => {
    const formData = {
      'view:activeCompensationITF': {},
      'view:activePensionITF': {},
    };

    expect(noActiveITF({ formData })).to.equal(true);
  });
});

describe('hasVeteranPrefill', () => {
  it('returns true when veteran prefill data is present', () => {
    const formData = {
      'view:veteranPrefillStore': {
        fullName: {
          first: 'Marty',
          last: 'McFly',
        },
        ssn: '111519551',
        dateOfBirth: '1955-11-15',
      },
    };

    expect(hasVeteranPrefill({ formData })).to.be.true;
  });
  it('returns false when any part of the veteran prefill data is absent', () => {
    const formData = {
      'view:veteranPrefillStore': {
        fullName: {
          first: 'Marty',
          last: 'McFly',
        },
        dateOfBirth: '1955-11-15',
      },
    };

    expect(hasVeteranPrefill({ formData })).to.be.false;
  });
});

describe('initializeFormDataWithPreparerIdentificationAndPrefill', () => {
  it('returns an initialized formData object with preparerIdentification selection and prefill data', () => {
    const veteranPrefillStore = {
      fullName: {
        first: 'John',
        last: 'Dude',
      },
      ssn: '111223333',
      dateOfBirth: '2000-10-10',
    };

    expect(
      initializeFormDataWithPreparerIdentificationAndPrefill(
        preparerIdentifications.veteran,
        veteranPrefillStore,
      ),
    ).to.deep.equal({
      ...createInitialState(formConfig).data,
      preparerIdentification: preparerIdentifications.veteran,
      'view:veteranPrefillStore': veteranPrefillStore,
    });
  });
});

describe('statementOfTruthFullNamePath', () => {
  it('returns the required signature formData path for third parties', () => {
    const formData = {
      preparerIdentification: preparerIdentifications.thirdPartyVeteran,
    };

    expect(statementOfTruthFullNamePath({ formData })).to.equal(
      'thirdPartyPreparerFullName',
    );

    formData.preparerIdentification =
      preparerIdentifications.thirdPartySurvivingDependent;

    expect(statementOfTruthFullNamePath({ formData })).to.equal(
      'thirdPartyPreparerFullName',
    );
  });

  it('returns the required signature formData path for veterans', () => {
    const formData = {
      preparerIdentification: preparerIdentifications.veteran,
    };

    expect(statementOfTruthFullNamePath({ formData })).to.equal(
      'veteranFullName',
    );
  });

  it('returns the required signature formData path for non-third party surviving dependents', () => {
    const formData = {
      preparerIdentification: preparerIdentifications.survivingDependent,
    };

    expect(statementOfTruthFullNamePath({ formData })).to.equal(
      'survivingDependentFullName',
    );
  });
});

describe('Confirmation Page helper functions', () => {
  it('determines if the form flow was bypassed to go directly to the confirmation page', () => {
    const formData = {
      benefitSelection: {},
    };

    expect(confirmationPageFormBypassed(formData)).to.be.true;

    formData.benefitSelection[veteranBenefits.COMPENSATION] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
  });

  it('returns the correct alert status depending on if the form was bypassed', () => {
    const formData = {
      benefitSelection: {},
    };

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageAlertStatus(formData)).to.equal('warning');

    formData.benefitSelection[veteranBenefits.PENSION] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
    expect(confirmationPageAlertStatus(formData)).to.equal('success');
  });

  it('returns the correct alert headline depending on if the form was bypassed', () => {
    const formData = {
      benefitSelection: {},
    };

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageAlertHeadline(formData)).to.equal(
      'You already have an intent to file on record',
    );

    formData.benefitSelection[survivingDependentBenefits.SURVIVOR] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
    expect(confirmationPageAlertHeadline(formData)).to.equal(
      'You’ve submitted your intent to file',
    );
  });

  it('return the correct alert paragraph depending on the formData', () => {
    const formData = {
      benefitSelection: {},
      'view:activeCompensationITF': {
        expirationDate: new Date().toISOString(),
      },
      'view:activePensionITF': {
        expirationDate: new Date().toISOString(),
      },
    };

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageAlertParagraph(formData)).to.equal(
      'Our records show that you already have an intent to file for disability compensation and for pension claims.',
    );

    formData['view:activePensionITF'] = {};

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageAlertParagraph(formData)).to.equal(
      'Our records show that you already have an intent to file for disability compensation and it will expire on 1-1-2025.',
    );

    formData['view:activePensionITF'] = {
      expirationDate: new Date().toISOString(),
    };
    formData['view:activeCompensationITF'] = {};

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageAlertParagraph(formData)).to.equal(
      'Our records show that you already have an intent to file for pension claims and it will expire on 1-1-2025.',
    );

    formData['view:activePensionITF'] = {};
    formData.benefitSelection[veteranBenefits.COMPENSATION] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
    expect(confirmationPageAlertParagraph(formData)).to.equal(
      'It may take us a few days to process your intent to file. Then you’ll have 1 year to file your claim.',
    );
  });

  it('returns the correct next steps paragraph or null depending on the formData', () => {
    const formData = {
      benefitSelection: {},
      'view:activeCompensationITF': {
        expirationDate: new Date().toISOString(),
      },
      'view:activePensionITF': {
        expirationDate: new Date().toISOString(),
      },
    };

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageNextStepsParagraph(formData)).to.contain(
      'disability compensation',
    );
    expect(confirmationPageNextStepsParagraph(formData)).to.contain(
      'pension claims',
    );

    formData['view:activePensionITF'] = {};

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageNextStepsParagraph(formData)).to.contain(
      'disability compensation',
    );

    formData['view:activePensionITF'] = {
      expirationDate: new Date().toISOString(),
    };
    formData['view:activeCompensationITF'] = {};

    expect(confirmationPageFormBypassed(formData)).to.be.true;
    expect(confirmationPageNextStepsParagraph(formData)).to.contain(
      'pension claims',
    );

    formData['view:activePensionITF'] = {};
    formData.benefitSelection[veteranBenefits.COMPENSATION] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
    expect(confirmationPageNextStepsParagraph(formData)).to.contain(
      'disability compensation',
    );

    formData.benefitSelection[veteranBenefits.COMPENSATION] = false;
    formData.benefitSelection[veteranBenefits.PENSION] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
    expect(confirmationPageNextStepsParagraph(formData)).to.contain(
      'pension claims',
    );

    formData.benefitSelection[veteranBenefits.PENSION] = false;
    formData.benefitSelection[survivingDependentBenefits.SURVIVOR] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
    expect(confirmationPageNextStepsParagraph(formData)).to.contain(
      'pension claims for survivors',
    );

    formData.benefitSelection[veteranBenefits.COMPENSATION] = true;

    expect(confirmationPageFormBypassed(formData)).to.be.false;
    expect(confirmationPageNextStepsParagraph(formData)).to.be.null;
  });
});
