import {
  isDtaEnabled,
  isResubmissionClaim,
  needsDocHelp,
} from '../../utils/helpers';
import additionalComments from './addtlComments';
import additionalDocs from './addtlDocsUpload';
import claimIdNumber from './claimIdNumber';
import claimLetter from './claimLetter';
import providerContactInfo from './providerContactInfo';
import providerInfo from './providerInfo';
import providerOverview from './providerOverview';
import supportingDocOptions from './supportingDocOptions';
import supportingDocs from './supportingDocs';

export const resubmissionPages = {
  claimNumber: {
    path: 'resubmission-claim-number',
    title: 'Claim identification number',
    depends: isResubmissionClaim,
    ...claimIdNumber,
  },
  claimLetter: {
    path: 'resubmission-letter',
    title: 'CHAMPVA resubmission letter',
    depends: isResubmissionClaim,
    ...claimLetter,
  },
  supportingDocOptions: {
    path: 'resubmission-document-options',
    title: 'Supporting document options',
    depends: isDtaEnabled,
    ...supportingDocOptions,
  },
  providerOverview: {
    path: 'resubmission-provider-overview',
    title: 'Provider overview',
    depends: needsDocHelp,
    ...providerOverview,
  },
  providerInformation: {
    path: 'resubmission-provider-information',
    title: 'Provider information',
    depends: needsDocHelp,
    ...providerInfo,
  },
  providerContactInformation: {
    path: 'resubmission-provider-contact-information',
    title: 'Provider contact information',
    depends: needsDocHelp,
    ...providerContactInfo,
  },
  additionalClaimDocs: {
    path: 'resubmission-additional-docs',
    title: 'Additional documents',
    depends: needsDocHelp,
    ...additionalDocs,
  },
  additionalProviderComments: {
    path: 'resubmission-additional-information',
    title: 'Additional information',
    depends: needsDocHelp,
    ...additionalComments,
  },
  supportingDocs: {
    path: 'resubmission-supporting-docs',
    title: 'Supporting documents for claim',
    depends: isResubmissionClaim,
    ...supportingDocs,
  },
};
