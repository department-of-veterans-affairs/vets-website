export const CernerAlertContent = {
  APPOINTMENTS: {
    linkPath: '/pages/scheduling/upcoming',
    pageName: 'appointments',
    headline: 'To manage your appointments at',
    domain: 'appointments',
    infoAlertActionPhrase: 'manage most of your appointments',
    infoAlertText: 'You can manage most of your appointments here.',
    warningBody:
      'you won’t be able to schedule or cancel appointments online for',
    warningAction: 'call',
    warningAddlInfo: 'to schedule or cancel appointments',
    errorAction: 'manage appointments online for',
    errorBody: 'You can’t schedule or cancel appointments online for',
    errorAddlInfo:
      'If you need to schedule or cancel appointments now, call the facility directly.',
    warning: ['p0', 'p1'],
    error: ['p2', 'p3', 'p4', 'p5', 'p6', 'p7'],
    startDate: 'p2',
    endDate: 'p7',
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
    warningBody: 'there may be a delay in updating medical records for',
    errorIntro: 'Medical records',
    errorBody: 'may not be updated for',
    warning: ['p1', 'p2', 'p3'],
    error: ['p4', 'p5', 'p6'],
    startDate: 'p4',
    endDate: 'p6',
  },
  MEDICATIONS: {
    linkPath: '/pages/medications/current',
    pageName: 'medications',
    headline: 'To view or manage your medications at',
    domain: 'medications',
    infoAlertActionPhrase: 'manage your medications',
    infoAlertText:
      'You no longer need to go to My VA Health to manage your prescriptions for any VA facilities.',
    warningBody: 'you won’t be able to refill your medications online for',
    warningAddlInfo:
      'call your VA pharmacy’s automated refill line to refill a medication.',
    errorAction: 'refill medications online for',
    errorBody: 'You can’t refill your medications online for',
    errorAddlInfo:
      'If you need to refill a medication now, call your VA pharmacy’s automated refill line. the phone number is on your prescription label or in your medications details page.',
    warning: ['p1', 'p2', 'p3'],
    error: ['p4', 'p5', 'p6'],
    startDate: 'p4',
    endDate: 'p6',
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
    warningBody:
      'you won’t be able to send or receive new messages or reply to conversations with providers at',
    warningAction: 'call',
    warningAddlInfo: 'to contact your provider',
    errorAction: 'use messages to contact providers at',
    errorBody:
      'You can’t send or receive new messages or reply to conversations with providers at',
    errorAddlInfo:
      'If you need to contact your provider now, call the facility directly.',
    warning: ['p1', 'p2'],
    error: ['p3', 'p4', 'p5', 'p6'],
    startDate: 'p3',
    endDate: 'p6',
  },
};

export const PretransitionedFacilitiesByVhaId = {
  '692': {
    vhaId: '692',
    vamcFacilityName: 'White City VA Medical Center',
    vamcSystemName: 'VA Southern Oregon health care',
    ehr: 'cerner',
  },
  '687': {
    vhaId: '687',
    vamcFacilityName: 'Jonathan M. Wainwright Memorial VA Medical Center',
    vamcSystemName: 'VA Walla Walla health care',
    ehr: 'cerner',
  },
  '653': {
    vhaId: '653',
    vamcFacilityName: 'Roseburg VA Medical Center',
    vamcSystemName: 'VA Roseburg health care',
    ehr: 'cerner',
  },
  '757': {
    vhaId: '757',
    vamcFacilityName: 'Chalmers P. Wylie Veterans Outpatient Clinic',
    vamcSystemName: 'VA Central Ohio health care',
    ehr: 'cerner',
  },
  '556': {
    vhaId: '556',
    vamcFacilityName: 'Captain James A. Lovell Federal Health Care Center',
    vamcSystemName: 'Lovell Federal health care - VA',
    ehr: 'cerner',
  },

  '668': {
    vhaId: '668',
    vamcFacilityName:
      'Mann-Grandstaff Department of Veterans Affairs Medical Center',
    vamcSystemName: 'VA Spokane health care',
    ehr: 'cerner',
  },
};
