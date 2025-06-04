import { personalInformationPage } from 'platform/forms-system/src/js/components/PersonalInformation';
import { hasSession } from '../../../helpers';
import claimantType from './claimantType';
import veteranInformation from './veteranInformation';
import claimantInformation from './claimantInformation';
import contactInformation from './contactInformation';
import editEmailAddress from './editEmailAddress';
import editPhoneNumber from './editPhoneNumber';
import emailAddress from './emailAddress';
import phoneNumber from './phoneNumber';
import incomeNetWorthDateRange from './incomeNetWorthDateRange';

const customConfig = {
  key: 'personalInformation',
  path: 'personal/information',
  depends: formData => formData?.claimantType === 'VETERAN' && hasSession(),
  personalInfoConfig: {
    name: { show: true, required: true },
    ssn: { show: true, required: true },
    vaFileNumber: { show: true, required: false },
  },
  // Temporarily use form data until pre-fill is wired up
  dataAdapter: {
    ssnPath: 'veteranSocialSecurityNumber',
    vaFileNumber: 'vaFileNumber',
  },
};

export default {
  title: 'Veteran and claimant information',
  pages: {
    claimantType,
    ...personalInformationPage(customConfig),
    claimantInformation,
    contactInformation,
    editEmailAddress,
    editPhoneNumber,
    emailAddress,
    phoneNumber,
    veteranInformation,
    incomeNetWorthDateRange,
  },
};
