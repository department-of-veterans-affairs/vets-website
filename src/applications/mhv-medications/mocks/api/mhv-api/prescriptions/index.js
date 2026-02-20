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
  INACTIVE: 'Inactive',
  INPROGRESS: 'In progress',
  STATUSNOTAVAILABLE: 'Status not available',
};
function mockPrescription(n = 0, attrs = {}, isV2 = false) {
  // Generate some refillable, some not
  const isRefillable = typeof n === 'number' && n % 3 === 0;
  const refillRemaining = isRefillable
    ? Math.ceil(Math.log((typeof n === 'number' ? n : 0) + 1))
    : 0;
  const isRenewable = attrs.isRenewable ?? false;
  const {
    cmopNdcNumber,
    cmopDivisionPhone = '(555) 555-5555',
    dialCmopDivisionPhone = '5555555555',
    pharmacyPhoneNumber = '(555) 555-5555',
  } = attrs;
  const prescriptionName = `Fake ${n}`;
  const newCmopNdcNumber =
    typeof n === 'number' && n % 3 === 0 && !cmopNdcNumber
      ? `000${n}000000`
      : cmopNdcNumber;

  let prescriptionId = n;
  if (isV2 && typeof n === 'number') {
    prescriptionId = `fake-${n}`;
  }

  return {
    id: isV2 ? prescriptionId : `fake-${n}`,
    type: 'prescriptions',
    attributes: {
      prescriptionId,
      prescriptionNumber: `${n}`,
      prescriptionName,
      refillStatus: 'active',
      refillSubmitDate: '2024-02-21T10:30:00-05:00',
      refillDate: '2024-02-28T10:30:00-05:00',
      refillRemaining,
      facilityName: 'The Facility',
      orderedDate: '2024-02-23T10:30:00-05:00',
      quantity: '1',
      expirationDate: '2099-01-02T10:30:00-05:00',
      dispensedDate: '2024-02-25T10:30:00-05:00',
      stationNumber: '001',
      isRefillable,
      isRenewable,
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
      pharmacyPhoneNumber,
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

function mockPrescriptionArray(n = 20, isV2 = false) {
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

    return mockPrescription(
      i,
      {
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
        isRenewable: realPrescription.isRenewable,
        isTrackable: realPrescription.isTrackable,
        sig: realPrescription.sig,
        cmopDivisionPhone:
          realPrescription.cmopDivisionPhone || '(555) 555-5555',
        dialCmopDivisionPhone:
          realPrescription.dialCmopDivisionPhone || '5555555555',
        pharmacyPhoneNumber:
          realPrescription.pharmacyPhoneNumber || '(555) 555-5555',
        notRefillableDisplayMessage:
          realPrescription.notRefillableDisplayMessage,
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
      },
      isV2,
    );
  });
}

// Oracle Health (Cerner) prescription based on real Spokane facility data.
// Used when ORACLE_HEALTH=true env var is set.
function mockOracleHealthPrescription(
  id = 99900001,
  isV2 = false,
  overrides = {},
) {
  const prescriptionId = isV2 ? `oh-${id}` : id;
  return {
    id: isV2 ? prescriptionId : `oh-${id}`,
    type: 'prescription_details',
    attributes: {
      prescriptionId,
      prescriptionNumber: '2720554',
      prescriptionName: 'AMLODIPINE 5MG TAB',
      refillStatus: 'active',
      refillSubmitDate: null,
      refillDate: '2023-07-13T04:00:00.000Z',
      refillRemaining: 0,
      facilityName: 'SPOKANE',
      orderedDate: '2023-04-14T12:00:00.000Z',
      quantity: '30',
      expirationDate: '2027-04-14T12:00:00.000Z',
      dispensedDate: null,
      stationNumber: '668',
      sourceEhr: 'OH',
      isRefillable: false,
      isRenewable: true,
      isTrackable: false,
      cmopNdcNumber: null,
      inCernerTransition: false,
      notRefillableDisplayMessage:
        'A refill request cannot be submitted at this time.',
      sig: 'TAKE ONE TABLET BY MOUTH DAILY FOR 30 DAYS',
      cmopDivisionPhone: null,
      userId: 16955936,
      providerFirstName: 'MOHAMMAD',
      providerLastName: 'ISLAM',
      remarks: null,
      divisionName: 'SPOKANE',
      modifiedDate: '2023-08-11T15:56:58.000Z',
      institutionId: null,
      dialCmopDivisionPhone: '',
      pharmacyPhoneNumber: '(509) 434-7000',
      dispStatus: 'Active',
      ndc: '00597-0030-01',
      reason: null,
      prescriptionNumberIndex: 'RX',
      prescriptionSource: 'RX',
      disclaimer: null,
      indicationForUse: null,
      indicationForUseFlag: null,
      category: 'Rx Medication',
      trackingList: [],
      rxRfRecords: [],
      tracking: false,
      orderableItem: null,
      sortedDispensedDate: null,
      prescriptionImage: null,
      ...overrides,
    },
    links: {
      self: `http://127.0.0.1:3000/my_health/v1/prescriptions/${id}`,
    },
  };
}

function generateMockPrescriptions(
  req,
  n = 20,
  isV2 = false,
  includeOracleHealth = false,
) {
  function edgeCasePrescription({
    prescriptionId,
    prescriptionName,
    dispStatus,
    refillDate,
    refillSubmitDate,
    rxRfRecords,
  }) {
    return mockPrescription(
      prescriptionId,
      {
        prescriptionName,
        dispStatus,
        refillDate,
        refillSubmitDate,
        rxRfRecords,
      },
      isV2,
    );
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
      prescriptionName: 'Refillinprocess Past INPROGRESS',
      dispStatus: dispStatusObj.INPROGRESS,
      refillDate: eightDaysAgo,
    }),
    edgeCasePrescription({
      prescriptionId: 1002,
      prescriptionName: 'Submitted Past INACTIVE',
      dispStatus: dispStatusObj.INACTIVE,
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
      prescriptionName: 'Unexpected dispStatus STATUSNOTAVAILABLE',
      dispStatus: dispStatusObj.STATUSNOTAVAILABLE,
      refillDate: eightDaysAgo,
    }),
    edgeCasePrescription({
      prescriptionId: 1013,
      prescriptionName: 'Boundary 7 Days TRANSFERRED',
      dispStatus: dispStatusObj.TRANSFERRED,
      refillDate: sevenDaysAgo,
    }),
    null,
    undefined,
    '',
    edgeCasePrescription({
      prescriptionId: 1014,
      prescriptionName: 'Non-array rxRfRecords (TRANSFERRED)',
      dispStatus: dispStatusObj.TRANSFERRED,
      rxRfRecords: {},
      refillDate: eightDaysAgo,
    }),
    edgeCasePrescription({
      prescriptionId: 1015,
      prescriptionName: 'Mixed Dates (INPROGRESS)',
      dispStatus: dispStatusObj.INPROGRESS,
      refillDate: eightDaysAgo,
      rxRfRecords: [{ refillDate: 'not-a-date' }, { refillDate: eightDaysAgo }],
    }),
  ];

  const generatedPrescriptions = [
    ...(includeOracleHealth
      ? [
          mockOracleHealthPrescription(99900001, isV2),
          mockOracleHealthPrescription(99900002, isV2, {
            prescriptionName: 'METOPROLOL 25MG TAB (OH Discontinued)',
            dispStatus: 'Discontinued',
            isRenewable: false,
          }),
          mockOracleHealthPrescription(99900003, isV2, {
            prescriptionName: 'LISINOPRIL 20MG TAB (OH On Hold)',
            dispStatus: 'Active: On Hold',
            isRenewable: false,
          }),
        ]
      : []),
    ...mockPrescriptionArray(n, isV2),
    mockPrescription(
      99,
      {
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
      },
      isV2,
    ),
  ];

  const filterKey = req.query['filter[']?.disp_status?.eq || ''; // e.g., "filter[[disp_status][eq]]=Active,Expired"
  const selectedStatuses = filterKey
    ? String(filterKey)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    : null;

  let filteredPrescriptions = !selectedStatuses
    ? generatedPrescriptions
    : generatedPrescriptions.filter(data => {
        const status = data?.attributes?.dispStatus ?? '';
        return selectedStatuses.includes(status);
      });

  const sortKey = String(req.query.sort || ''); // e.g., "sort=alphabetical-status"
  if (sortKey === 'alphabetical-status') {
    filteredPrescriptions = filteredPrescriptions.slice().sort((a, b) => {
      const aStatus = (a?.attributes?.dispStatus ?? '').toString();
      const bStatus = (b?.attributes?.dispStatus ?? '').toString();
      const byStatus = aStatus.localeCompare(bStatus);
      if (byStatus) return byStatus;
      const aName = (a?.attributes?.prescriptionName ?? '').toString();
      const bName = (b?.attributes?.prescriptionName ?? '').toString();
      return aName.localeCompare(bName);
    });
  } // In order to support other sorts, add more if-blocks here

  // Determine whether this request is for the on-screen medications list (paged)
  // or for an export (Print/PDF/TXT) where we want the full filtered list.
  // Exports do not have page or perPage sent in the request
  const isExport = !req.query.page && !req.query.per_page;

  if (isExport) {
    return {
      data: filteredPrescriptions,
      meta: {
        updatedAt: formatISO(new Date()),
        failedStationList: null,
      },
      links: {},
    };
  }

  const currentPage = Number(req.query.page || 1);
  const perPage = Number(req.query.per_page || 10);
  const totalEntries = filteredPrescriptions.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / perPage));
  const start = (currentPage - 1) * perPage;
  const slice = filteredPrescriptions.slice(start, start + perPage);
  return {
    data: slice,
    meta: {
      updatedAt: formatISO(new Date()),
      failedStationList: null,
      pagination: {
        currentPage,
        perPage,
        totalPages,
        totalEntries,
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
  mockOracleHealthPrescription,
  generateMockPrescriptions,
  mockPrescriptionDocumentation,
};
