/**
 * Mock copays for temporary localhost testing of MonthlyStatementPage and PreviousStatements.
 *
 * Two formats (use one at a time in mockServer.js):
 *
 * 1) Legacy (flag off): each copay has statement_id so useCurrentStatement can filter.
 *    'GET /v0/medical_copays': { data: require('./mockStatementForLocal.js') },
 *
 * 2) Lighthouse (flag on): v1 API response shape. Attributes match how the app reads them
 *    when showVHAPaymentHistory is on (e.g. attributes.facility.name, attributes.invoiceDate,
 *    attributes.lineItems, attributes.principalPaid, etc.).
 *    'GET /v1/medical_copays': require('./mockStatementForLocal.js').lighthouseStatementMockForLocal,
 *
 * Revert mockServer when done testing.
 *
 * Test URLs (with mock enabled):
 * - Monthly statement: /copay-balances/statement/stmt-may-2024
 * - Previous statements: on detail page for a balance (from attributes.recentStatements).
 */

const facility618 = {
  facilitYNum: '618',
  visNNum: '23',
  facilitYDesc: 'MINNEAPOLIS MEDICAL CENTER (618)',
  cyclENum: '004',
  remiTToFlag: 'L',
  maiLInsertFlag: '0',
  staTAddress1: '1 VETERANS DR',
  staTAddress2: null,
  staTAddress3: null,
  city: 'MINNEAPOLIS',
  state: 'MN',
  ziPCde: '554172300',
  ziPCdeOutput: '55417-2300',
  teLNum: '1-866-347-2352',
  stationNumber: '618',
};

/* eslint-disable camelcase */
const mockStatementForLocal = [
  // Statement 1 (May 2024) – two copays so MonthlyStatementPage has content
  {
    id: 'stmt-may-2024',
    statement_id: 'stmt-may-2024',
    accountNumber: '534 1001 0051 54223 HSMITH',
    pSStatementDateOutput: '05/03/2024',
    pHTotCharges: 50,
    station: { ...facility618, facilityName: 'Minneapolis VA Medical Center' },
    details: [
      {
        pDTransDescOutput: 'Outpatient care',
        pDTransAmt: 100,
        pDRefNo: '618-K00K9ZK',
      },
      {
        pDTransDescOutput: 'Pharmacy',
        pDTransAmt: 25,
        pDRefNo: '618-K00K9ZL',
      },
    ],
  },
  {
    id: 'stmt-may-2024-copay-2',
    statement_id: 'stmt-may-2024',
    accountNumber: '534 1001 0051 54223 HSMITH',
    pSStatementDateOutput: '05/03/2024',
    pHTotCharges: 25,
    station: { ...facility618, facilityName: 'Minneapolis VA Medical Center' },
    details: [
      {
        pDTransDescOutput: 'Additional charge',
        pDTransAmt: 30,
        pDRefNo: '618-K00K9ZM',
      },
    ],
  },
  // Statement 2 (April 2024) – same facility, so it shows under “Previous statements”
  {
    id: 'stmt-apr-2024',
    statement_id: 'stmt-apr-2024',
    accountNumber: '534 1001 0051 54223 HSMITH',
    pSStatementDateOutput: '04/05/2024',
    pHTotCharges: 24,
    station: { ...facility618, facilityName: 'Minneapolis VA Medical Center' },
    details: [
      {
        pDTransDescOutput: 'Outpatient care',
        pDTransAmt: 24,
        pDRefNo: '618-K00K9ZJ',
      },
    ],
  },
  // Statement 3 (March 2024)
  {
    id: 'stmt-mar-2024',
    statement_id: 'stmt-mar-2024',
    accountNumber: '534 1001 0051 54223 HSMITH',
    pSStatementDateOutput: '03/01/2024',
    pHTotCharges: 15,
    station: { ...facility618, facilityName: 'Minneapolis VA Medical Center' },
    details: [
      {
        pDTransDescOutput: 'Previous balance',
        pDTransAmt: 15,
        pDRefNo: '618-K00K9ZI',
      },
    ],
  },
];
/* eslint-enable camelcase */

// Lighthouse (v1) line item shape for StatementTable (datePosted, description, billingReference, priceComponents[0].amount, providerName)
function lighthouseLineItem(
  description,
  amount,
  billingRef,
  datePosted = '2024-06-01',
) {
  return {
    datePosted,
    description,
    billingReference: billingRef,
    priceComponents: [{ amount }],
    providerName: 'Minneapolis VA Medical Center',
  };
}

// Lighthouse (v1) expected format: same scenarios, shape inferred from flag-on usage
// (attributes.facility.name, attributes.invoiceDate, attributes.lineItems, etc.)
const lighthouseFacility = {
  name: 'Minneapolis VA Medical Center',
  address: {
    addressLine1: '1 VETERANS DR',
    addressLine2: null,
    addressLine3: null,
    city: 'MINNEAPOLIS',
    state: 'MN',
    postalCode: '55417-2300',
  },
};
const lighthousePatientAddress = {
  addressLine1: '123 Veteran St',
  addressLine2: null,
  addressLine3: null,
  city: 'MINNEAPOLIS',
  state: 'MN',
  postalCode: '55417',
};

/* eslint-disable camelcase */
function lighthouseCopay(opts) {
  const {
    id,
    statement_id: statementId,
    invoiceDate,
    accountNumber,
    principalBalance,
    principalPaid,
    lineItems,
    facilityId = '4-618',
  } = opts;
  return {
    id,
    statement_id: statementId,
    type: 'medicalCopays',
    attributes: {
      facility: { ...lighthouseFacility },
      facilityId,
      city: 'MINNEAPOLIS',
      invoiceDate,
      accountNumber,
      principalBalance: principalBalance ?? 0,
      principalPaid: principalPaid ?? 0,
      lineItems: lineItems ?? [],
      lastUpdatedAt: invoiceDate
        ? `${invoiceDate}T00:00:00Z`
        : '2024-06-01T00:00:00Z',
      currentBalance: principalBalance ?? 0,
      paymentDueDate: invoiceDate,
      patient: { address: lighthousePatientAddress },
    },
  };
}

const lighthouseData = [
  lighthouseCopay({
    id: 'stmt-may-2024',
    statement_id: 'stmt-may-2024',
    invoiceDate: '2024-05-01',
    accountNumber: '534 1001 0051 54223 HSMITH',
    principalBalance: 125,
    principalPaid: 0,
    lineItems: [
      lighthouseLineItem('Outpatient care', 100, '618-K00K9ZK'),
      lighthouseLineItem('Pharmacy', 25, '618-K00K9ZL'),
    ],
  }),
  lighthouseCopay({
    id: 'stmt-may-2024-copay-2',
    statement_id: 'stmt-may-2024',
    invoiceDate: '2024-05-01',
    accountNumber: '534 1001 0051 54223 HSMITH',
    principalBalance: 30,
    principalPaid: 4,
    lineItems: [lighthouseLineItem('Additional charge', 30, '618-K00K9ZM')],
  }),
  lighthouseCopay({
    id: 'stmt-apr-2024',
    statement_id: 'stmt-apr-2024',
    invoiceDate: '2024-04-05',
    accountNumber: '534 1001 0051 54223 HSMITH',
    principalBalance: 24,
    principalPaid: 10,
    lineItems: [
      lighthouseLineItem('Outpatient care', 24, '618-K00K9ZJ', '2024-04-05'),
    ],
  }),
  lighthouseCopay({
    id: 'stmt-mar-2024',
    statement_id: 'stmt-mar-2024',
    invoiceDate: '2024-03-01',
    accountNumber: '534 1001 0051 54223 HSMITH',
    principalBalance: 15,
    principalPaid: 0,
    lineItems: [
      lighthouseLineItem('Previous balance', 15, '618-K00K9ZI', '2024-03-01'),
    ],
  }),
];
/* eslint-enable camelcase */

const lighthouseStatementMockForLocal = {
  data: lighthouseData,
  meta: {
    total: lighthouseData.length,
    page: 1,
    perPage: lighthouseData.length,
    copaySummary: {
      totalCurrentBalance: 194,
      copayBillCount: 4,
      lastUpdatedOn: '2024-06-01T00:00:00Z',
    },
  },
  links: {
    self: 'http://127.0.0.1:3000/v1/medical_copays',
    first: 'http://127.0.0.1:3000/v1/medical_copays?page=1',
    next: null,
    last: 'http://127.0.0.1:3000/v1/medical_copays?page=1',
  },
};

module.exports = mockStatementForLocal;
module.exports.lighthouseStatementMockForLocal = lighthouseStatementMockForLocal;
module.exports.lighthouseData = lighthouseData;
