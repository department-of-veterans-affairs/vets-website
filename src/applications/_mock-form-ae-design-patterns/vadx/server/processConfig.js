const validEntryNames = [
  'covid19screen',
  'verify',
  'pensions',
  'vaos',
  'rated-disabilities',
  'dashboard',
  'profile',
  'dependents-view-dependents',
  'facilities',
  '1010cg-application-caregiver-assistance',
  'terms-of-use',
  'burials-ez',
  'hca',
  'ezr',
  '686C-674',
  '686C-674-v2',
  '526EZ-all-claims',
  'order-form-2346',
  '0996-higher-level-review',
  'claims-status',
  'letters',
  'login-page',
  'pre-need',
  'post-911-gib-status',
  'discharge-upgrade-instructions',
  'yellow-ribbon',
  '10203-edu-benefits',
  '0993-edu-benefits',
  '5495-edu-benefits',
  'feedback-tool',
  '1995-edu-benefits',
  '5490-edu-benefits',
  '1990-edu-benefits',
  '0994-edu-benefits',
  'auth',
  'sign-in-changes',
  'gi',
  'search',
  'veteran-id-card',
  '28-1900-chapter-31',
  '25-8832-planning-and-career-guidance',
  'view-payments',
  'coronavirus-research',
  'coronavirus-research-update',
  'ask-a-question',
  'my-documents',
  'request-debt-help-form-5655',
  'resources-and-support',
  'messages',
  'view-representative',
  'virtual-agent',
  'ask-va-too',
  '10182-board-appeal',
  'coe-status',
  'coe',
  'check-in',
  'pre-check-in',
  'travel-claim',
  '1990ez-edu-benefits',
  'sahg',
  'enrollment-verification',
  'office-directory',
  'education-letters',
  'dhp-consent-flow',
  'mock-form',
  'mock-form-ae-design-patterns',
  'combined-debt-portal',
  '995-supplemental-claim',
  'fry-dea',
  'toe',
  'mhv-secure-messaging',
  'mhv-secure-messaging-pilot',
  'medical-records',
  '4555-adapted-housing',
  'mhv-landing-page',
  '21-4142-medical-release',
  'mock-simple-forms-patterns',
  'mock-form-patterns-v3',
  'form-upload-flow',
  '10210-lay-witness-statement',
  '21-0966-intent-to-file-a-claim',
  'income-limits',
  '0845-auth-disclose',
  '21-0972-alternate-signer',
  'medications',
  '21P-0847-substitute-claimant',
  'avs',
  'health-care-supply-reordering',
  'notification-center',
  'ds-playground',
  'ds-v3-playground',
  '0247-pmc',
  'pact-act',
  'nod-new',
  'download',
  'hlr-testing',
  'sc-testing',
  '10206-pa',
  '10207-pp',
  'verify-your-enrollment',
  'pre-need-integration',
  'travel-pay',
  '10-10D',
  'find-a-representative',
  'representative',
  '10-7959C',
  '10-7959f-1-FMP',
  '10-7959a',
  '4138-ss',
  'fmp-cover-sheet',
  'appoint-a-representative',
  'income-and-asset-statement',
  'sco',
  '10282-edu-benefits',
  'form-renderer',
  '10215-edu-benefits',
  '10216-edu-benefits',
  'mock-form-minimal-header',
  '1919-edu-benefits',
  '8794-edu-benefits',
  'benefit-eligibility-questionnaire',
  'survivor-dependent-education-benefit-22-5490',
];

const allowedProcesses = {
  'fe-dev-server': {
    command: 'yarn',
    allowedArgs: ['watch'],
    requiredParams: ['entry', 'api'],
    validateArgs: args => {
      if (!args.includes('watch')) return false;
      const entryIndex = args.findIndex(arg => arg.startsWith('entry='));
      const apiIndex = args.findIndex(arg => arg.startsWith('api='));
      if (entryIndex === -1 || apiIndex === -1) return false;

      const entryValue = args[entryIndex].split('=')[1];
      const entryValues = entryValue.split(',').map(v => v.trim());

      return entryValues.every(value => validEntryNames.includes(value));
    },
  },
  'mock-server': {
    command: 'node',
    allowedArgs: ['src/platform/testing/e2e/mockapi.js', '--responses'],
    requiredParams: ['responsesPath'],
    validateArgs: args => {
      return (
        args.includes('src/platform/testing/e2e/mockapi.js') &&
        args.includes('--responses') &&
        args.length === 3
      ); // command, --responses, and path
    },
  },
};

function isValidProcess(name) {
  return Object.keys(allowedProcesses).includes(name);
}

function isValidCommand(name, command) {
  return allowedProcesses[name].command === command;
}

function validateArgs(name, args) {
  return allowedProcesses[name].validateArgs(args);
}

function getRequiredParams(name) {
  return allowedProcesses[name].requiredParams;
}

module.exports = {
  isValidProcess,
  isValidCommand,
  validateArgs,
  getRequiredParams,
  validEntryNames,
};
