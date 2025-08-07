const { differenceInDays, formatISO, sub } = require('date-fns');
const { prescriptionDocumentationHtml } = require('./documentation');
const prescriptionsList = require('../../../../tests/fixtures/prescriptionsList.json');

const dispStatusObj = {
  UNKNOWN: 'Unknown',
  ACTIVE: 'Active',
  REFILL_IN_PROCESS: 'Active: Refill in Process',
  SUBMITTED: 'Active: Submitted',
  EXPIRED: 'Expired',
  DISCONTINUED: 'Discontinued',
  TRANSFERRED: 'Transferred',
  NON_VA: 'Active: Non-VA',
  ON_HOLD: 'Active: On Hold',
  ACTIVE_PARKED: 'Active: Parked',
};
function mockPrescription(n = 0, attrs = {}) {
  // Generate some refillable, some not
  const isRefillable = n % 3 === 0;
  const refillRemaining = isRefillable ? Math.ceil(Math.log(n + 1)) : 0;
  const {
    cmopNdcNumber,
    cmopDivisionPhone = '(555) 555-5555',
    dialCmopDivisionPhone = '5555555555',
  } = attrs;
  const prescriptionName = `Fake ${n}`;
  const newCmopNdcNumber =
    n % 3 === 0 && !cmopNdcNumber ? `000${n}000000` : cmopNdcNumber;
  return {
    id: `fake-${n}`,
    type: 'prescriptions',
    attributes: {
      prescriptionId: n,
      prescriptionNumber: `${n}`,
      prescriptionName,
      refillStatus: 'active',
      refillSubmitDate: '2024-02-21T10:30:00-05:00',
      refillDate: '2024-02-28T10:30:00-05:00',
      refillRemaining,
      facilityName: 'The Facility',
      orderedDate: '2024-02-23T10:30:00-05:00',
      quantity: 1,
      expirationDate: '2099-01-02T10:30:00-05:00',
      dispensedDate: '2024-02-25T10:30:00-05:00',
      stationNumber: '001',
      isRefillable,
      isTrackable: null,
      sig: null,
      cmopDivisionPhone,
      inCernerTransition: null,
      notRefillableDisplayMessage: 'You cannot refill this!',
      cmopNdcNumber: newCmopNdcNumber ?? null,
      userId: null,
      providerFirstName: 'ProviderFirst',
      providerLastName: 'ProviderLast',
      remarks: 'Remarks, remarks, remarks',
      divisionName: null,
      modifiedDate: null,
      institutionId: null,
      dialCmopDivisionPhone,
      dispStatus: isRefillable ? 'Active' : 'Expired',
      ndc: null,
      reason: 'A good reason',
      prescriptionNumberIndex: null,
      prescriptionSource: null,
      disclaimer: null,
      indicationForUse: null,
      indicationForUseFlag: null,
      category: null,
      trackingList: [
        {
          carrier: 'USPS',
          completeDateTime: '2024-05-28T04:39:11-04:00',
          dateLoaded: '2024-04-21T16:55:19-04:00',
          divisionPhone: '(401)271-9804',
          id: 9878,
          isLocalTracking: false,
          ndc: '00113002240',
          othersInSamePackage: false,
          rxNumber: 2719780,
          stationNumber: 995,
          trackingNumber: '332980271979930000002300',
          viewImageDisplayed: false,
        },
      ],
      rxRfRecords: [
        {
          shape: 'OVAL',
          color: 'WHITE',
          frontImprint: '9,3',
          backImprint: '72,14',
          cmopNdcNumber: newCmopNdcNumber ?? null,
          cmopDivisionPhone,
          dialCmopDivisionPhone,
          prescriptionName,
        },
      ],
      tracking: null,
      orderableItem: null,
      sortedDispensedDate: '2024-02-25T10:30:00-05:00',
      prescriptionImage: null,
      ...attrs,
    },
    links: {
      self: 'self',
    },
  };
}

function mockPrescriptionArray(n = 20) {
  const realPrescriptions = prescriptionsList.data;

  return [...Array(n)].map((_, i) => {
    const today = new Date();
    const someDate = sub(today, { days: i * 2 + 1 });
    const monthsAgo = sub(someDate, { months: 3 });
    const oneWeekAgo = sub(someDate, { days: 7 });
    const recently = sub(someDate, { days: 3 });

    const recentlyISOString = formatISO(recently);
    const statusString =
      differenceInDays(today, someDate) > 14 ? 'Expired' : 'Active';

    const realPrescription =
      realPrescriptions[i % realPrescriptions.length].attributes;

    return mockPrescription(i, {
      prescriptionName: realPrescription.prescriptionName,
      refillStatus: realPrescription.refillStatus,
      refillSubmitDate:
        realPrescription.refillSubmitDate || formatISO(oneWeekAgo),
      refillDate: realPrescription.refillDate || recentlyISOString,
      refillRemaining: realPrescription.refillRemaining,
      facilityName: realPrescription.facilityName,
      orderedDate: realPrescription.orderedDate || formatISO(monthsAgo),
      quantity: realPrescription.quantity,
      expirationDate: realPrescription.expirationDate,
      dispensedDate: realPrescription.dispensedDate || recentlyISOString,
      stationNumber: realPrescription.stationNumber,
      isRefillable: realPrescription.isRefillable,
      isTrackable: realPrescription.isTrackable,
      sig: realPrescription.sig,
      cmopDivisionPhone: realPrescription.cmopDivisionPhone || '(555) 555-5555',
      dialCmopDivisionPhone:
        realPrescription.dialCmopDivisionPhone || '5555555555',
      notRefillableDisplayMessage: realPrescription.notRefillableDisplayMessage,
      providerFirstName: realPrescription.providerFirstName,
      providerLastName: realPrescription.providerLastName,
      remarks: realPrescription.remarks,
      divisionName: realPrescription.divisionName,
      dispStatus: realPrescription.dispStatus || statusString,
      ndc: realPrescription.ndc,
      reason: realPrescription.reason,
      prescriptionSource: realPrescription.prescriptionSource,
      indicationForUse: realPrescription.indicationForUse,
      category: realPrescription.category,
    });
  });
}

function generateMockPrescriptions(n = 20) {
  function edgeCasePrescription({
    prescriptionId,
    prescriptionName,
    dispStatus,
    refillDate,
    refillSubmitDate,
    rxRfRecords,
  }) {
    return mockPrescription(prescriptionId, {
      prescriptionName,
      dispStatus,
      refillDate,
      refillSubmitDate,
      rxRfRecords,
    });
  }
  const now = new Date();
  const sevenDaysAgo = new Date(
    now.getTime() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const eightDaysAgo = new Date(
    now.getTime() - 8 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const sixDaysAgo = new Date(
    now.getTime() - 6 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const futureDate = new Date(
    now.getTime() + 5 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const timestamp = Date.now() - 8 * 24 * 60 * 60 * 1000;
  const recentlyRequested = [
    edgeCasePrescription({
      prescriptionId: 1001,
      prescriptionName: 'Refillinprocess Past',
      dispStatus: dispStatusObj.REFILL_IN_PROCESS,
      refillDate: eightDaysAgo,
    }),
    edgeCasePrescription({
      prescriptionId: 1002,
      prescriptionName: 'Submitted Past',
      dispStatus: dispStatusObj.SUBMITTED,
      refillSubmitDate: eightDaysAgo,
    }),
    edgeCasePrescription({
      prescriptionId: 1003,
      prescriptionName: 'Submitted Recent',
      dispStatus: dispStatusObj.SUBMITTED,
      refillSubmitDate: sixDaysAgo,
    }),
    edgeCasePrescription({
      prescriptionId: 1004,
      prescriptionName: 'Refillinprocess Future',
      dispStatus: dispStatusObj.REFILL_IN_PROCESS,
      refillDate: futureDate,
    }),
    edgeCasePrescription({
      prescriptionId: 1005,
      prescriptionName: 'Null Dates',
      dispStatus: dispStatusObj.REFILL_IN_PROCESS,
    }),
    edgeCasePrescription({
      prescriptionId: 1006,
      prescriptionName: 'Empty rxRfRecords',
      dispStatus: dispStatusObj.REFILL_IN_PROCESS,
      rxRfRecords: [],
    }),
    edgeCasePrescription({
      prescriptionId: 1007,
      prescriptionName: 'Empty rxRfRecords[0]',
      dispStatus: dispStatusObj.REFILL_IN_PROCESS,
      rxRfRecords: [{}],
    }),
    edgeCasePrescription({
      prescriptionId: 1008,
      prescriptionName: 'Invalid Date',
      dispStatus: dispStatusObj.REFILL_IN_PROCESS,
      refillDate: 'not-a-date',
    }),
    edgeCasePrescription({
      prescriptionId: 1009,
      prescriptionName: 'Timestamp Number',
      dispStatus: dispStatusObj.REFILL_IN_PROCESS,
      refillDate: timestamp,
    }),
    edgeCasePrescription({
      prescriptionId: 1010,
      prescriptionName: 'String Timestamp',
      dispStatus: dispStatusObj.REFILL_IN_PROCESS,
      refillDate: String(timestamp),
    }),
    edgeCasePrescription({
      prescriptionId: 1011,
      prescriptionName: 'Missing dispStatus',
      refillDate: eightDaysAgo,
    }),
    edgeCasePrescription({
      prescriptionId: 1012,
      prescriptionName: 'Unexpected dispStatus',
      dispStatus: dispStatusObj.UNKNOWN,
      refillDate: eightDaysAgo,
    }),
    edgeCasePrescription({
      prescriptionId: 1013,
      prescriptionName: 'Boundary 7 Days',
      dispStatus: dispStatusObj.REFILL_IN_PROCESS,
      refillDate: sevenDaysAgo,
    }),
    null,
    undefined,
    '',
    edgeCasePrescription({
      prescriptionId: 1014,
      prescriptionName: 'Non-array rxRfRecords',
      dispStatus: dispStatusObj.REFILL_IN_PROCESS,
      rxRfRecords: {},
      refillDate: eightDaysAgo,
    }),
    edgeCasePrescription({
      prescriptionId: 1015,
      prescriptionName: 'Mixed Dates',
      dispStatus: dispStatusObj.REFILL_IN_PROCESS,
      refillDate: eightDaysAgo,
      rxRfRecords: [{ refillDate: 'not-a-date' }, { refillDate: eightDaysAgo }],
    }),
  ];
  return {
    data: [
      ...mockPrescriptionArray(n),
      mockPrescription(99, {
        dispStatus: dispStatusObj.NON_VA,
        dispensedDate: null,
        facilityName: null,
        indicationForUse: null,
        prescriptionName: 'TACROLIMUS 1MG CAP',
        prescriptionSource: 'NV',
        providerFirstName: null,
        providerLastName: null,
        sig: null,
        trackingList: [],
      }),
    ],
    meta: {
      updatedAt: formatISO(new Date()),
      failedStationList: null,
      pagination: {
        currentPage: 1,
        perPage: n,
        totalPages: 1,
        totalEntries: n,
      },
      recentlyRequested,
    },
    links: {},
  };
}

const mockPrescriptionDocumentation = () => {
  return prescriptionDocumentationHtml;
};

module.exports = {
  mockPrescription,
  generateMockPrescriptions,
  mockPrescriptionDocumentation,
};
