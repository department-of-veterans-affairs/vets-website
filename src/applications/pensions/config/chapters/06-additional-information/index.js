import directDeposit from './directDeposit';
import accountInformation from './accountInformation';
import otherPaymentOptions from './otherPaymentOptions';
import supportingDocuments from './supportingDocuments';
import uploadDocuments from './uploadDocuments';
import fasterClaimProcessing from './fasterClaimProcessing';

export default {
  title: 'Additional information',
  pages: {
    directDeposit,
    accountInformation,
    otherPaymentOptions,
    supportingDocuments, // aidAttendance
    uploadDocuments,
    fasterClaimProcessing,
  },
};
