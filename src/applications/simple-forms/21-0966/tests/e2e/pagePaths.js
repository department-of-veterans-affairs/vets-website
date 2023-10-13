import formConfig from '../../config/form';

const formChapters = formConfig.chapters;
export default {
  preparerIdentification:
    formChapters.preparerIdentificationChapter.pages.preparerIdentification
      .path,
  thirdPartyPreparerFullName:
    formChapters.preparerIdentificationChapter.pages.thirdPartyPreparerFullName
      .path,
  veteranBenefitSelection:
    formChapters.benefitSelectionChapter.pages.veteranBenefitSelection.path,
  survivingDependantBenefitSelection:
    formChapters.benefitSelectionChapter.pages
      .survivingDependantBenefitSelection.path,
  survivingDependentPersonalInformation:
    formChapters.survivingDependentPersonalInformationChapter.pages
      .personalInformation.path,
  survivingDependentIdentificationInformation:
    formChapters.survivingDependentPersonalInformationChapter.pages
      .identificationInformation.path,
  survivingDependentMailingAddress:
    formChapters.survivingDependentContactInformationChapter.pages
      .mailingAddress.path,
  survivingDepedentPhoneAndEmailAddress:
    formChapters.survivingDependentContactInformationChapter.pages
      .phoneAndEmailAddress.path,
  veteranPersonalInformation:
    formChapters.veteranPersonalInformationChapter.pages.personalInformation
      .path,
  veteranIdentificationInformation:
    formChapters.veteranPersonalInformationChapter.pages
      .identificationInformation.path,
  relationshipToVeteran:
    formChapters.veteranPersonalInformationChapter.pages.relationshipToVeteran
      .path,
  veteranMailingAddress:
    formChapters.veteranContactInformationChapter.pages.mailingAddress.path,
  veteranPhoneAndEmailAddress:
    formChapters.veteranContactInformationChapter.pages.phoneAndEmailAddress
      .path,
};
