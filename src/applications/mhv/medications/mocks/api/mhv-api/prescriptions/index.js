const { differenceInDays, formatISO, sub } = require('date-fns');

function mockPrescription(n = 0, attrs = {}) {
  return {
    id: `fake-${n}`,
    type: 'prescriptions',
    attributes: {
      prescriptionId: n,
      prescriptionNumber: `${n}`,
      prescriptionName: `Fake ${n}`,
      refillStatus: 'active',
      refillSubmitDate: '2024-02-21T10:30:00-05:00',
      refillDate: '2024-02-28T10:30:00-05:00',
      refillRemaining: 6,
      facilityName: 'The Facility',
      orderedDate: '2024-02-23T10:30:00-05:00',
      quantity: 1,
      expirationDate: '2099-01-02T10:30:00-05:00',
      dispensedDate: '2024-02-25T10:30:00-05:00',
      stationNumber: '001',
      isRefillable: true,
      isTrackable: null,
      sig: null,
      cmopDivisionPhone: null,
      inCernerTransition: null,
      notRefillableDisplayMessage: 'You cannot refill this!',
      cmopNdcNumber: null,
      userId: null,
      providerFirstName: 'ProviderFirst',
      providerLastName: 'ProviderLast',
      remarks: 'Remarks, remarks, remarks',
      divisionName: null,
      modifiedDate: null,
      institutionId: null,
      dialCmopDivisionPhone: null,
      ndc: null,
      reason: 'A good reason',
      prescriptionNumberIndex: null,
      prescriptionSource: null,
      disclaimer: null,
      indicationForUse: null,
      indicationForUseFlag: null,
      category: null,
      trackingList: [],
      rxRfRecords: [],
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
  return [...Array(n)].map((_, i) => {
    const today = new Date();
    const someDate = sub(today, { days: i * 2 + 1 });
    const monthsAgo = sub(someDate, { months: 3 });
    const oneWeekAgo = sub(someDate, { days: 7 });
    const recently = sub(someDate, { days: 3 });

    const recentlyISOString = formatISO(recently);
    const statusString =
      differenceInDays(today, someDate) > 14 ? 'Expired' : 'Active';
    const prescriptionName = String.fromCodePoint(65 + i).repeat(5);

    return mockPrescription(i, {
      lastFilledDate: formatISO(monthsAgo),
      refillDate: recentlyISOString,
      refillSubmitDate: formatISO(oneWeekAgo),
      sortedDispensedDate: recentlyISOString,
      dispStatus: statusString,
      refillStatus: statusString.toLowerCase(),
      prescriptionName,
    });
  });
}

function generateMockPrescriptions(n = 20) {
  return {
    data: mockPrescriptionArray(n),
    meta: {
      updatedAt: formatISO(new Date()),
      failedStationList: null,
      pagination: {
        currentPage: 1,
        perPage: n,
        totalPages: 1,
        totalEntries: n,
      },
    },
    links: {},
  };
}

module.exports = {
  generateMockPrescriptions,
};
