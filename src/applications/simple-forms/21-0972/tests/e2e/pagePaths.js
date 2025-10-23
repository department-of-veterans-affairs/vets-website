import formConfig from '../../config/form';

const formChapters = formConfig.chapters;
export default {
  preparerPersonalInfo:
    formChapters.preparerPersonalInformationChapter.pages
      .preparerPersonalInformation.path,
  preparerAddress:
    formChapters.preparerAddressChapter.pages.preparerAddress.path,
  preparerContactInformation:
    formChapters.preparerContactInformationChapter.pages
      .preparerContactInformation.path,
  claimantIdentification:
    formChapters.claimantIdentificationChapter.pages.claimantIdentification
      .path,
  claimantPersonalInformation:
    formChapters.claimantPersonalInformationChapter.pages
      .claimantPersonalInformation.path,
  claimantSsn: formChapters.claimantSsnChapter.pages.claimantSsn.path,
  claimantAddress:
    formChapters.claimantAddressChapter.pages.claimantAddress.path,
  claimantContactInformation:
    formChapters.claimantContactInformationChapter.pages
      .claimantContactInformation.path,
  preparerQualifications1A:
    formChapters.preparerQualificationsChapter.pages.preparerQualifications1A
      .path,
  preparerQualifications1B:
    formChapters.preparerQualificationsChapter.pages.preparerQualifications1B
      .path,
  preparerQualifications2:
    formChapters.preparerQualificationsChapter.pages.preparerQualifications2
      .path,
  veteranPersonalInformation:
    formChapters.veteranPersonalInformationChapter.pages
      .veteranPersonalInformation.path,
  veteranIdentificationInformation1:
    formChapters.veteranIdentificationInformationChapter.pages
      .veteranIdentificationInformation1.path,
  veteranIdentificationInformation2:
    formChapters.veteranIdentificationInformationChapter.pages
      .veteranIdentificationInformation2.path,
  additionalInformation:
    formChapters.additionalInformationChapter.pages.additionalInformation.path,
};
