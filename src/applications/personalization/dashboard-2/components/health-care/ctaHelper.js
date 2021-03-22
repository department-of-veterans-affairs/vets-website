import { mhvUrl } from '~/platform/site-wide/mhv/utilities';

export const messagesCTA = (authenticatedWithSSOe, unreadMessagesCount) => {
  return {
    icon: 'comments',
    text:
      typeof unreadMessagesCount === 'number'
        ? `You have ${unreadMessagesCount} new messages`
        : 'Send a secure message to your health care team',
    href: mhvUrl(authenticatedWithSSOe, 'secure-messaging'),
    boldText: unreadMessagesCount > 0,
  };
};

export const prescriptionsCTA = authenticatedWithSSOe => {
  return {
    icon: 'prescription-bottle',
    text: 'Refill and track your prescriptions',
    href: mhvUrl(
      authenticatedWithSSOe,
      'web/myhealthevet/refill-prescriptions',
    ),
  };
};

export const labResultsCTA = authenticatedWithSSOe => {
  return {
    icon: 'clipboard-list',
    text: 'Get your lab and test results',
    href: mhvUrl(authenticatedWithSSOe, 'download-my-data'),
  };
};

export const medicalRecordsCTA = {
  icon: 'file-medical',
  text: 'Get your VA medical records',
  href: '/health-care/get-medical-records/',
};
