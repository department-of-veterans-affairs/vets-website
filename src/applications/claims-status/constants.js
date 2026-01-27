// NODE_22_CI_TEST_TRIGGER: Temporary comment to trigger app test selection for Node 22 CI verification. Remove after verification.
import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { MAX_FILE_SIZE_MB, MAX_PDF_SIZE_MB } from './utils/validations';

/**
 * Service registry for unavailable service alerts.
 * Add new services here to support them in ServiceUnavailableAlert.
 */
export const SERVICE_REGISTRY = {
  claims: {
    singular: 'claim',
    plural: 'claims',
  },
  appeals: {
    singular: 'appeal',
    plural: 'appeals',
  },
};

export const ITEMS_PER_PAGE = 10;

// Date Formats
export const DATE_FORMATS = {
  LONG_DATE: 'MMMM d, yyyy',
};

export const CST_BREADCRUMB_BASE = [
  { href: '/', label: 'VA.gov home' },
  {
    href: '/your-claims',
    label: 'Check your claims and appeals',
    isRouterLink: true,
  },
];

// This should make it a bit easier to turn mocks on and off manually
const SHOULD_USE_MOCKS = true;
// NOTE: This should only be TRUE when developing locally
const CAN_USE_MOCKS = !window.Cypress && environment.isLocalhost();

export const canUseMocks = () => SHOULD_USE_MOCKS && CAN_USE_MOCKS;

// This is used in useDataDogRum
export const isProductionEnv = () => {
  return (
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_RUM?.getInitConfiguration() &&
    !window.Mocha
  );
};

// These are claim types codes for disability compensation claims. Claim type codes listed here
// are used in isDisabilityCompensationClaim() to show the 8 claim phase steps instead of 5.
export const disabilityCompensationClaimTypeCodes = [
  '010INITMORE8',
  '010LCMPPIDES',
  '010LCOMP',
  '010LCOMPBDD',
  '010LCOMPD2D',
  '010LCOMPIDES',
  '010NADIDES8',
  '020BDDNO',
  '020CLMINC',
  '020EPDSUPP',
  '020IDESRRNAD',
  '020NADIDESNO',
  '020NEW',
  '020NEWIDES',
  '020NEWPMC',
  '020NHPNH10',
  '020NI',
  '020PNI',
  '020PREDSUPP',
  '020RCOMP',
  '020RI',
  '020RN',
  '020RRNADIDES',
  '020RSCDTH',
  '020RSCDTHPMC',
  '020SD2D',
  '020SMB',
  '020SUPP',
  '110INITLESS8',
  '110LCMP7IDES',
  '110LCOMP7',
  '110LCOMP7BDD',
  '110LCOMPD2D',
  '110LCOMPIDES',
  '110NADIDES7',
];

// These are claim type codes for dependency claims that involve requests to add or remove a
// dependent (a subset of the larger list of all claim type codes for the "Dependency" claim type).
// These codes are currently only used to render a more specific title for the claim, e.g. "Request
// to add or remove a dependent" rather than just "Claim for dependency".
export const addOrRemoveDependentClaimTypeCodes = [
  '130DPNDCYAUT',
  '130DPNAUTREJ',
  '130SCHATTAUT',
  '130SCHAUTREJ',
  '130ADOD2D',
  '130ADSD2D',
  '130DAD2D',
  '130DARD2D',
  '130PDARD2D',
  '130PSARD2D',
  '130SAD2D',
  '130SARD2D',
  '130DPNDCY',
  '130DCY674',
  '130DCY686',
  '130DPV0538',
  '130DRASDP',
  '130DPNEBNADJ',
  '130DPEBNAJRE',
  '130SCHATTEBN',
  '130PDA',
  '130PDAE',
  '130PSA',
  '130PSAE',
  '130DPNPMCAUT',
  '130DPMCAUREJ',
  '130SCPMAUREJ',
  '130DV0538PMC',
  '130DPNDCYPMC',
  '130DCY674PMC',
  '130DV05378PMC',
  '130SSRDPMC',
  '130SSRDPMCE',
  '130DAEBNPMC',
  '130DAEBNPMCR',
  '130SCAEBNPMC',
  '130SCAEBPMCR',
  '130PDAJPMC',
  '130PDAJEXPMC',
  '130PSCHAPMC',
  '130PSCHAEPMC',
  '130RD',
  '130SSRD',
  '130SSRDE',
  '130SCHEBNREJ',
];

// These are claim types codes for pension compensation claims. Claim type codes listed here
// are used in isPensionClaim() to show the 8 claim phase steps instead of 5.
export const pensionClaimTypeCodes = [
  '190ORGDPN',
  '190ORGDPNPMC',
  '190AID',
  '140ISD',
  '290DICEDPMC',
  '020SMDICPMC',
  '020IRDICPMC',
  '687NRPMC',
  '150ELECPMC',
  '150INCNWPMC',
  '150INCPMC',
  '120INCPMC',
  '150NWTHPMC',
  '120SUPHCDPMC',
  '120ILCP7PMC',
  '120SMPPMC',
  '150MERPMC',
  '120ASMP',
  '120ARP',
  '150AIA',
  '600APCDP',
  '600PCDPPM',
  '696MROCPMC',
  '180AILP',
  '180ORGPENPMC',
  '180ORGPEN',
];

export const survivorsPensionClaimTypeCodes = [
  '190ORGDPN',
  '190ORGDPNPMC',
  '190AID',
  '140ISD',
  '687NRPMC',
];
export const DICClaimTypeCodes = ['290DICEDPMC', '020SMDICPMC', '020IRDICPMC'];
export const veteransPensionClaimTypeCodes = [
  '180AILP',
  '180ORGPENPMC',
  '180ORGPEN',
];

// The Standard 5103 Notice Response doesn't come through as a tracked item from our API until it is closed so we need to make a
// mocked item with information.
export const standard5103Item = {
  displayName: 'Review evidence list (5103 notice)',
  type: '5103 Notice Response',
  description: (
    <>
      <p>
        We sent you a “List of evidence we may need (5103 notice)” letter. This
        letter lets you know if submitting additional evidence will help decide
        your claim.
      </p>
      <p>
        You can also let us know that you’re done submitting additional
        evidence, for now.
      </p>
    </>
  ),
};

// File upload form text constants
export const LABEL_TEXT = 'Upload additional evidence';
export const HINT_TEXT = `You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than ${MAX_FILE_SIZE_MB} MB (non-PDF) or ${MAX_PDF_SIZE_MB} MB (PDF only).`;
export const VALIDATION_ERROR = 'Please select a file first';
export const PASSWORD_ERROR = 'Please provide a password to decrypt this file';
export const DOC_TYPE_ERROR = 'Please provide a document type';
export const SUBMIT_TEXT = 'Submit documents for review';
export const SEND_YOUR_DOCUMENTS_TEXT = 'Send your documents another way';

// Contact and submission information constants
export const MAILING_ADDRESS = {
  organization: 'Department of Veterans Affairs',
  department: 'Evidence Intake Center',
  poBox: 'PO Box 4444',
  city: 'Janesville',
  state: 'WI',
  zip: '53547-4444',
};

export const CONTACT_INFO = {
  phone: '800-827-1000',
  tty: '711',
  hours: 'Monday through Friday, 8:00 a.m. to 9:00 p.m. ET',
};

export const ANCHOR_LINKS = {
  addFiles: 'add-files',
  documentsFiled: 'documents-filed', // anchor link to old documents filed section
  otherWaysToSendDocuments: 'other-ways-to-send',
  fileSubmissionsInProgress: 'file-submissions-in-progress',
  filesReceived: 'files-received',
  filesWeCouldntReceive: 'files-we-couldnt-receive',
};

export const LINKS = {
  findVaLocations: '/find-locations',
};
