import formConfig from '../../config/form';

const formChapters = formConfig.chapters;
export default {
  preparerPersonalInfo:
    formChapters.preparerPersonalInformationChapter.pages
      .preparerPersonalInformation.path,
  relationshipToDeceasedClaimant:
    formChapters.relationshipToDeceasedClaimantChapter.pages
      .relationshipToDeceasedClaimant.path,
  otherRelationshipToDeceasedClaimant:
    formChapters.relationshipToDeceasedClaimantChapter.pages
      .otherRelationshipToDeceasedClaimant.path,
  preparerIdentificationInformation:
    formChapters.preparerIdentificationInformationChapter.pages
      .preparerIdentificationInformation.path,
  preparerAddress:
    formChapters.preparerAddressChapter.pages.preparerAddress.path,
  preparerContactInformation:
    formChapters.preparerContactInformationChapter.pages
      .preparerContactInformation.path,
  deceasedClaimantPersonalInformation:
    formChapters.deceasedClaimantPersonalInformationChapter.pages
      .deceasedClaimantPersonalInformation.path,
  veteranIdentificationInformation:
    formChapters.veteranIdentificationInformationChapter.pages
      .veteranIdentificationInformation.path,
  additionalInformation:
    formChapters.additionalInformationChapter.pages.additionalInformation.path,
};
