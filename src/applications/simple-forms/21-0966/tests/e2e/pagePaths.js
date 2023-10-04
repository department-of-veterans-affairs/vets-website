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
    formChapters.personalInformationChapter.pages.personalInformation.path,
  identificationInformation:
    formChapters.personalInformationChapter.pages.identificationInformation
      .path,
  mailingAddress:
    formChapters.contactInformationChapter.pages.mailingAddress.path,
  phoneAndEmailAddress:
    formChapters.contactInformationChapter.pages.phoneAndEmailAddress.path,
  veteranPersonalInformation:
    formChapters.veteranPersonalInformationChapter.pages
      .veteranPersonalInformation.path,
  veteranIdentificationInformation:
    formChapters.veteranPersonalInformationChapter.pages
      .veteranIdentificationInformation.path,
  relationshipToVeteran:
    formChapters.veteranPersonalInformationChapter.pages.relationshipToVeteran
      .path,
};
