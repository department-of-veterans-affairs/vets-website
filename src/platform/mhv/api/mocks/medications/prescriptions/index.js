const { differenceInDays, formatISO, sub } = require('date-fns');
const prescriptionsList = require('../../../../../../applications/mhv-medications/tests/fixtures/prescriptionsList.json');

function mockPrescription(n = 0, attrs = {}) {
  // Generate some refillable, some not
  const isRefillable = n % 3 === 0;
  const refillRemaining = isRefillable ? Math.ceil(Math.log(n + 1)) : 0;
  // Don't use destructuring with defaults - respect null values from attrs
  const { cmopNdcNumber } = attrs;
  const cmopDivisionPhone = attrs.cmopDivisionPhone ?? '(555) 555-5555';
  const dialCmopDivisionPhone = attrs.dialCmopDivisionPhone ?? '5555555555';
  const prescriptionName = `Fake ${n}`;

  return {
    id: `fake-${n}`,
    type: 'prescriptions',
    attributes: {
      prescriptionId: n,
      prescriptionNumber: `${n}`,
      prescriptionName,
      refillStatus: 'active',
      refillSubmitDate: attrs.refillSubmitDate ?? '2024-02-21T10:30:00-05:00',
      refillDate: '2024-02-28T10:30:00-05:00',
      refillRemaining,
      facilityName: 'The Facility',
      orderedDate: '2024-02-23T10:30:00-05:00',
      quantity: '1',
      expirationDate: '2099-01-02T10:30:00-05:00',
      dispensedDate: attrs.dispensedDate ?? '2024-02-25T10:30:00-05:00',
      stationNumber: '001',
      isRefillable,
      isTrackable: null,
      sig: null,
      cmopDivisionPhone: '(555) 555-5555',
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
      dialCmopDivisionPhone: '5555555555',
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
          cmopNdcNumber,
          cmopDivisionPhone,
          dialCmopDivisionPhone,
          prescriptionName,
        },
      ],
      tracking: null,
      orderableItem: null,
      prescriptionImage: null,
      ...attrs,
      // sortedDispensedDate should match dispensedDate
      sortedDispensedDate:
        attrs.sortedDispensedDate ||
        attrs.dispensedDate ||
        '2024-02-25T10:30:00-05:00',
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

    // Only use fallback dates if the property is undefined (not present)
    // If it's explicitly null in the fixture, keep it as null
    const refillSubmitDate =
      'refillSubmitDate' in realPrescription
        ? realPrescription.refillSubmitDate
        : formatISO(oneWeekAgo);
    const refillDate =
      'refillDate' in realPrescription
        ? realPrescription.refillDate
        : recentlyISOString;
    const orderedDate =
      'orderedDate' in realPrescription
        ? realPrescription.orderedDate
        : formatISO(monthsAgo);
    const dispensedDate =
      'dispensedDate' in realPrescription
        ? realPrescription.dispensedDate
        : recentlyISOString;

    return mockPrescription(i, {
      prescriptionName: realPrescription.prescriptionName,
      refillStatus: realPrescription.refillStatus,
      refillSubmitDate,
      refillDate,
      refillRemaining: realPrescription.refillRemaining,
      facilityName: realPrescription.facilityName,
      orderedDate,
      quantity: realPrescription.quantity,
      expirationDate: realPrescription.expirationDate,
      dispensedDate,
      sortedDispensedDate: dispensedDate,
      stationNumber: realPrescription.stationNumber,
      isRefillable: realPrescription.isRefillable,
      isTrackable: realPrescription.isTrackable,
      sig: realPrescription.sig,
      cmopDivisionPhone:
        'cmopDivisionPhone' in realPrescription
          ? realPrescription.cmopDivisionPhone
          : '(555) 555-5555',
      dialCmopDivisionPhone:
        'dialCmopDivisionPhone' in realPrescription
          ? realPrescription.dialCmopDivisionPhone
          : '5555555555',
      notRefillableDisplayMessage: realPrescription.notRefillableDisplayMessage,
      providerFirstName: realPrescription.providerFirstName,
      providerLastName: realPrescription.providerLastName,
      remarks: realPrescription.remarks,
      divisionName: realPrescription.divisionName,
      dispStatus: realPrescription.dispStatus ?? statusString,
      ndc: realPrescription.ndc,
      reason: realPrescription.reason,
      prescriptionSource: realPrescription.prescriptionSource,
      indicationForUse: realPrescription.indicationForUse,
      category: realPrescription.category,
      trackingList: realPrescription.trackingList,
      rxRfRecords: realPrescription.rxRfRecords,
      tracking: realPrescription.tracking,
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
  mockPrescription,
  generateMockPrescriptions,
};
