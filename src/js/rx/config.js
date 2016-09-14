module.exports = {
  // Base URL to be used in API requests.
  apiUrl: '/api/v0/prescriptions/',

  glossary: [{
    term: 'Active',
    definition: 'If you have refills, you may request a refill of this prescription from your VA pharmacy.'
  },
  {
    term: 'Discontinued',
    definition: 'This prescription is no longer available. Contact your VA health care team if you need more of this medication.'
  },
  {
    term: 'Expired',
    definition: 'This prescription is too old to fill. Contact your VA health care team if you need more of this medication.'
  },
  {
    term: 'On hold',
    definition: 'This prescription cannot be refilled until a hold is resolved by the pharmacy. Contact your VA pharmacy when you need more of this medication.'
  },
  {
    term: 'Pending',
    definition: 'This prescription was sent to the pharmacy for review. Contact your VA pharmacy if you need this medication now.'
  },
  {
    term: 'Submitted',
    definition: 'Your prescription refill has been submitted.'
  },
  {
    term: 'Suspended',
    definition: 'It is too early to request a refill for this prescription. It should be sent to you before you run out. Contact your VA pharmacy if you need this medication now.'
  },
  {
    term: 'Unknown',
    definition: 'An unknown error has occurred. Contact your VA pharmacy if you need this medication now.'
  }],

  rxStatuses: {
    active: 'Active',
    discontinued: 'Discontinued',
    expired: 'Expired',
    onHold: 'On hold',
    submitted: 'Pending',
    suspended: 'Suspended',
    refillinprocess: 'Refill in procress',
    unknown: 'Unknown'
  },

  sortOptions: [
    { value: 'prescription-name',
      label: 'Prescription name'
    },
    { value: 'facility-name',
      label: 'Facility name'
    },
    { value: 'last-requested',
      label: 'Last requested'
    }]
};
