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
  initializeFormDataWithPreparerIdentification,
  hasActiveCompensationITF,
  hasActivePensionITF,
  noActiveITF,
  statementOfTruthFullNamePath,
  veteranPersonalInformationChapterTitle,
  veteranContactInformationChapterTitle,
} from '../../config/helpers';
import { preparerIdentifications } from '../../definitions/constants';
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
        expirationDate: '1-1-1999',
        status: 'active',
      },
      'view:activePensionITF': {},
    };

    expect(hasActiveCompensationITF({ formData })).to.equal(true);
    expect(hasActivePensionITF({ formData })).to.equal(false);
    expect(noActiveITF({ formData })).to.equal(false);

    formData['view:activeCompensationITF'] = {};
    formData['view:activePensionITF'] = {
      expirationDate: '1-1-1999',
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

describe('initializeFormDataWithPreparerIdentification', () => {
  it('returns an initialized formData object with preparerIdentification selection', () => {
    expect(
      initializeFormDataWithPreparerIdentification(
        preparerIdentifications.veteran,
      ),
    ).to.deep.equal({
      ...createInitialState(formConfig).data,
      preparerIdentification: preparerIdentifications.veteran,
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
