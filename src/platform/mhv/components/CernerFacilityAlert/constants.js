export const CernerAlertContent = {
  APPOINTMENTS: {
    linkPath: '/pages/scheduling/upcoming',
    pageName: 'appointments',
    headline: 'To manage your appointments at',
    domain: 'appointments',
    infoAlertActionPhrase: 'manage most of your appointments',
    infoAlertText: 'You can manage most of your appointments here.',
  },
  MHV_LANDING_PAGE: {
    // linkPath and infoAlertActionPhrase are used by the blue info alert
    linkPath: '/pages/home',
    // pageName and headline are unused because the yellow alert is suppressed when domain is 'mhv-landing-page'
    pageName: 'mhv-landing-page',
    headline: 'mhv-landing-page',
    domain: 'mhv-landing-page',
    infoAlertActionPhrase: 'manage your health care',
  },
  MEDICAL_RECORDS: {
    linkPath: '/pages/health_record/comprehensive_record/health_summaries',
    pageName: 'medical records',
    headline: 'Manage your medical records at',
    domain: 'medical records',
    infoAlertActionPhrase: 'manage most of your medical records',
    infoAlertText:
      'You can review and download most of your medical records here.',
  },
  MEDICATIONS: {
    linkPath: '/pages/medications/current',
    pageName: 'medications',
    headline: 'To view or manage your medications at',
    domain: 'medications',
    infoAlertActionPhrase: 'manage your medications',
    infoAlertText:
      'You no longer need to go to My VA Health to manage your prescriptions for any VA facilities.',
  },
  SECURE_MESSAGING: {
    linkPath: '/pages/messaging/inbox',
    pageName: 'secure messages',
    headline: 'To send a secure message to a provider at',
    domain: 'secure messages',
    infoAlertHeadline:
      'You can now manage messages for all VA health care teams here',
    infoAlertText:
      'You no longer need to go to My VA Health to communicate with teams at any VA facilities.',
    bodyActionSingle: 'To send a secure message to a provider at',
    bodyActionMultiple: 'To view or manage secure messages at these facilities',
    bodyIntro: 'Some of your secure messages may be in a different portal.',
  },
};
