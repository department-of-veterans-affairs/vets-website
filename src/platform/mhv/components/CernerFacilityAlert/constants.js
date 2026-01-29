/**
 * Migration alert configuration lifecycle
 *
 * Facilities move through a series of OH migration phases identified as p0–p7.
 * These phase identifiers are ordered (p0 is earliest, p7 is latest) and
 * are supplied by vets-api for each facility in the user's vaProfile facility list.
 *
 * For each tool (appointments, medical records, medications, etc.):
 * - warningPhases: phases where we show a warning-style alert because
 *   some functionality may be limited or changing soon.
 * - errorPhases: phases where we show an error-style alert because
 *   the functionality is not available online for affected facilities.
 * - errorStartDate / errorEndDate: the first and last phases (inclusive)
 *   used when displaying date-related messaging for that tool, based on
 *   T-XX dates for each tool's functionality migrating (calculated on the backend).
 *
 * A facility’s current migration phase is compared against these arrays to
 * determine which alert type (if any) should be displayed on the page.
 */

export const CernerAlertContent = {
  APPOINTMENTS: {
    linkPath: '/pages/scheduling/upcoming',
    headline: 'To manage your appointments at',
    pageName: 'appointments',
    infoAlertActionPhrase: 'manage most of your appointments',
    infoAlertText: 'You can manage most of your appointments here.',
    // Migration alert configuration
    warningPhases: ['p0', 'p1'],
    warningMessage: `you won’t be able to schedule or cancel appointments online for`,
    warningGetNote: facilityText =>
      `During this time, you can still call ${facilityText} to schedule or cancel appointments.`,
    errorPhases: ['p2', 'p3', 'p4', 'p5', 'p6', 'p7'],
    errorHeadline: `You can’t manage appointments online for some facilities right now`,
    errorMessage: `You can’t schedule or cancel appointments online for`,
    errorNote:
      'If you need to schedule or cancel appointments now, call the facility directly.',
    errorStartDate: 'p2',
    errorEndDate: 'p7',
  },
  MHV_LANDING_PAGE: {
    linkPath: '/pages/home',
    headline: '',
    pageName: 'MHV landing page',
    infoAlertActionPhrase: 'manage your health care',
  },
  MEDICAL_RECORDS: {
    linkPath: '/pages/health_record/comprehensive_record/health_summaries',
    headline: 'To manage your medical records at',
    pageName: 'medical records',
    infoAlertActionPhrase: 'manage most of your medical records',
    infoAlertText:
      'You can review and download most of your medical records here.',
    // Migration alert configuration
    warningPhases: ['p1', 'p2', 'p3'],
    warningMessage: `there may be a delay in updating medical records for`,
    errorPhases: ['p4', 'p5', 'p6'],
    errorGetHeadline: endDate =>
      `New medical records may not appear here until ${endDate}`,
    errorIntro: 'Medical records',
    errorMessage: `may not be updated for`,
    errorStartDate: 'p4',
    errorEndDate: 'p6',
  },
  MEDICATIONS: {
    linkPath: '/pages/medications/current',
    headline: 'To view or manage your medications at',
    pageName: 'medications',
    infoAlertActionPhrase: 'manage your medications',
    infoAlertText:
      'You no longer need to go to My VA Health to manage your prescriptions for any VA facilities.',
    // Migration alert configuration
    warningPhases: ['p1', 'p2', 'p3'],
    warningMessage: `you won’t be able to refill your medications online for`,
    warningNote: `During this time, you can still call your VA pharmacy’s automated refill line to refill a medication.`,
    errorPhases: ['p4', 'p5', 'p6'],
    errorHeadline: `You can’t refill medications online for some facilities right now`,
    errorMessage: `You can’t refill your medications online for`,
    errorNote: `If you need to refill a medication now, call your VA pharmacy’s automated refill line. The phone number is on your prescription label or in your medications details page.`,
    errorStartDate: 'p4',
    errorEndDate: 'p6',
  },
  SECURE_MESSAGING: {
    linkPath: '/pages/messaging/inbox',
    headline: 'To send a secure message to a provider at',
    pageName: 'secure messages',
    infoAlertHeadline:
      'You can now manage messages for all VA health care teams here',
    infoAlertText:
      'You no longer need to go to My VA Health to communicate with teams at any VA facilities.',
    bodyActionSingle: 'To send a secure message to a provider at',
    bodyActionMultiple: 'To view or manage secure messages at these facilities',
    bodyIntro: 'Some of your secure messages may be in a different portal.',
    // Migration alert configuration
    warningPhases: ['p1', 'p2'],
    warningMessage: `you won’t be able to send or receive new messages or reply to conversations with providers at`,
    warningGetNote: facilityText =>
      `During this time, you can still call ${facilityText} to contact your provider.`,
    errorPhases: ['p3', 'p4', 'p5', 'p6'],
    errorHeadline: `You can’t use messages to contact providers at some facilities right now`,
    errorMessage: `You can’t send or receive new messages or reply to conversations with providers at`,
    errorNote:
      'If you need to contact your provider now, call the facility directly.',
    errorStartDate: 'p3',
    errorEndDate: 'p6',
  },
};

// These will be used only for the pretransitioned sites' existing "Go to My VA Health" alerts
// Once these 6 sites are fully transitioned away from that alert this const can be removed
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
