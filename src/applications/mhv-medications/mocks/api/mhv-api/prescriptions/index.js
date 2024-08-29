const { differenceInDays, formatISO, sub } = require('date-fns');
const { prescriptionDocumentationHtml } = require('./documentation');

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
      refillStatus: statusString,
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

const mockPrescriptionDocumentation = () => {
  return prescriptionDocumentationHtml;
};

module.exports = {
  mockPrescription,
  generateMockPrescriptions,
  mockPrescriptionDocumentation,
};
