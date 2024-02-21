function mockPrescription(n = 0, attrs = {}) {
  return {
    id: `fake-${n}`,
    type: 'prescriptions',
    attributes: {
      prescriptionId: n,
      prescriptionNumber: `${n}`,
      prescriptionName: `Fake ${n}`,
      refillStatus: '???',
      refillSubmitDate: '2024-02-21',
      refillDate: '2024-02-28',
      refillRemaining: 6,
      facilityName: 'The Facility',
      orderedDate: '2024-02-23',
      quantity: 1,
      expirationDate: '2099-01-02',
      dispensedDate: '2024-02-25',
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
      dispStatus: null,
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
      sortedDispensedDate: '2024-02-25',
      prescriptionImage: null,
      ...attrs,
    },
    links: {
      self: 'self',
    },
  };
}

const prescriptionsList = {
  data: [...Array(10)].map((_, n) => mockPrescription(n)),
  meta: {
    updatedAt: '2024-02-21T21:35:19.380Z',
    failedStationList: null,
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalEntries: 10,
    },
  },
  links: {},
};

module.exports = {
  prescriptionsList,
};
