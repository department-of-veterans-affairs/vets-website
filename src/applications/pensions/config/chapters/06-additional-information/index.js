import directDeposit from './directDeposit';
import accountInformation from './accountInformation';
import otherPaymentOptions from './otherPaymentOptions';
import supportingDocuments from './supportingDocuments';
import documentUpload from './documentUpload';
import fasterClaimProcessing from './fasterClaimProcessing';

export default {
  title: 'Additional information',
  pages: {
    directDeposit,
    accountInformation,
    otherPaymentOptions,
    supportingDocuments, // aidAttendance
    documentUpload,
    fasterClaimProcessing,
  },
};
