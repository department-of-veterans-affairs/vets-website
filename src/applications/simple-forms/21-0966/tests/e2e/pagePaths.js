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
  personalInformation:
    formChapters.survivingDependentPersonalInformationChapter.pages
      .personalInformation.path,
  identificationInformation:
    formChapters.survivingDependentPersonalInformationChapter.pages
      .identificationInformation.path,
  mailingAddress:
    formChapters.survivingDependentContactInformationChapter.pages
      .mailingAddress.path,
  phoneAndEmailAddress:
    formChapters.survivingDependentContactInformationChapter.pages
      .phoneAndEmailAddress.path,
  veteranPersonalInformation:
    formChapters.veteranPersonalInformationChapter.pages
      .veteranPersonalInformation.path,
  veteranIdentificationInformation:
    formChapters.veteranPersonalInformationChapter.pages
      .veteranIdentificationInformation.path,
  relationshipToVeteran:
    formChapters.veteranPersonalInformationChapter.pages.relationshipToVeteran
      .path,
  veteranMailingAddress:
    formChapters.veteranContactInformationChapter.pages.mailingAddress.path,
  veteranPhoneAndEmailAddress:
    formChapters.veteranContactInformationChapter.pages.phoneAndEmailAddress
      .path,
};
