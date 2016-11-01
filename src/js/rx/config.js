const headers = {
  'X-Key-Inflection': 'camel'
};

if (typeof localStorage !== 'undefined' && localStorage !== null) {
  headers.Authorization = `Token token=${localStorage.userToken}`;
}

module.exports = {
  // Base URL to be used in API requests.
  api: {
    url: '/api/v0/prescriptions',
    settings: {
      headers
    }
  },

  glossary: {
    Prescription: [
      {
        term: 'Active',
        definition: 'A prescription that can be filled at the local VA pharmacy. If you have refills, you may request a refill of this prescription from your VA pharmacy.'
      },
      {
        term: 'Discontinued',
        definition: 'A prescription your provider has stopped. It is no longer available to be sent to you or pick up at the VA pharmacy window. Contact your VA healthcare team if you need more of this medication.'
      },
      {
        term: 'Expired',
        definition: 'A prescription which is too old to fill. This does not refer to the expiration date of the medication in the bottle. Contact your VA healthcare team if you need more.'
      },
      {
        term: 'Hold',
        definition: 'This prescription cannot be refilled until a hold is resolved by the pharmacy. Contact your VA pharmacy if you need this prescription now.'
      },
      {
        term: 'Submitted',
        definition: 'Your prescription refill has been submitted.'
      },
      {
        term: 'Suspended',
        definition: 'An active prescription that is not scheduled to be filled yet. You should receive it before you run out. Contact your VA pharmacy if you need this medication now.'
      },
      {
        term: 'Unknown',
        definition: 'There has been an unknown error from our end. Contact your VA healthcare team for more information.'
      }],
    Refill: [
      {
        term: 'Refill in process',
        definition: 'This prescription was sent to the pharmacy for review. Contact your VA pharmacy if you need this medication now.'
      },
      {
        term: 'Submitted',
        definition: 'Your prescription refill has been submitted.'
      }
    ]
  },

  rxStatuses: {
    active: 'Active',
    deleted: 'Unknown',
    discontinued: 'Discontinued',
    discontinuedByProvider: 'Discontinued',
    discontinuedEdit: 'Discontinued',
    expired: 'Expired',
    hold: 'Hold',
    nonVerified: 'Unknown',
    providerHold: 'Hold',
    submitted: 'Submitted',
    suspended: 'Suspended',
    refillinprocess: 'Refill in process',
    unknown: 'Unknown'
  },

  sortOptions: [
    { value: 'prescriptionName',
      label: 'Prescription name'
    },
    { value: 'facilityName',
      label: 'Facility name'
    },
    { value: 'lastRequested',
      label: 'Last requested date'
    }]
};
