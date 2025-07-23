const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');

// Mock POA requests data - only fields actually used by components
const mockPOARequests = [
  {
    id: '123',
    createdAt: '2024-12-15T14:30:22Z',
    expiresAt: '2025-01-15T14:30:22Z',
    powerOfAttorneyForm: {
      claimant: {
        name: {
          first: 'John',
          last: 'Smith',
        },
        address: {
          city: 'Washington',
          stateCode: 'DC',
          zipCode: '20024',
        },
        ssn: '1234',
        vaFileNumber: '5678',
        phone: '(555) 123-4567',
        email: 'john.smith@gmail.com',
        relationship: 'Self',
      },
      veteran: {
        name: {
          first: 'John',
          last: 'Smith',
        },
        ssn: '1234',
        vaFileNumber: '5678',
      },
      authorizations: {
        recordDisclosureLimitations: [],
        addressChange: true,
      },
    },
    powerOfAttorneyHolder: {
      name: 'Veterans Service Organization',
    },
    accreditedIndividual: {
      fullName: 'Jane Doe',
    },
    resolution: null,
    powerOfAttorneyFormSubmission: {
      status: null,
    },
  },
  {
    id: '124',
    createdAt: '2024-11-20T09:15:33Z',
    expiresAt: '2024-12-20T09:15:33Z',
    powerOfAttorneyForm: {
      claimant: {
        name: {
          first: 'Mary',
          last: 'Johnson',
        },
        address: {
          city: 'Arlington',
          stateCode: 'VA',
          zipCode: '22202',
        },
        ssn: '5678',
        vaFileNumber: '9012',
        phone: '(703) 555-9876',
        email: 'mary.johnson@yahoo.com',
        relationship: 'Self',
      },
      veteran: {
        name: {
          first: 'Mary',
          last: 'Johnson',
        },
        ssn: '5678',
        vaFileNumber: '9012',
      },
      authorizations: {
        recordDisclosureLimitations: ['ALCOHOLISM', 'DRUG_ABUSE'],
        addressChange: false,
      },
    },
    powerOfAttorneyHolder: {
      name: 'American Legion',
    },
    accreditedIndividual: {
      fullName: 'Bob Wilson',
    },
    resolution: {
      createdAt: '2024-12-01T16:45:12Z',
      type: 'decision',
      decisionType: 'acceptance',
    },
    powerOfAttorneyFormSubmission: {
      status: 'completed',
    },
  },
  {
    id: '125',
    createdAt: '2024-10-08T11:22:45Z',
    expiresAt: '2024-11-08T11:22:45Z',
    powerOfAttorneyForm: {
      claimant: {
        name: {
          first: 'Robert',
          last: 'Williams',
        },
        address: {
          city: 'Alexandria',
          stateCode: 'VA',
          zipCode: '22314',
        },
        ssn: '9012',
        vaFileNumber: '3456',
        phone: '(571) 555-0123',
        email: 'robert.williams@outlook.com',
        relationship: 'Self',
      },
      veteran: {
        name: {
          first: 'Robert',
          last: 'Williams',
        },
        ssn: '9012',
        vaFileNumber: '3456',
      },
      authorizations: {
        recordDisclosureLimitations: ['HIV', 'SICKLE_CELL'],
        addressChange: true,
      },
    },
    powerOfAttorneyHolder: {
      name: 'Disabled American Veterans',
    },
    accreditedIndividual: {
      fullName: null,
    },
    resolution: {
      createdAt: '2024-10-25T13:18:07Z',
      type: 'decision',
      decisionType: 'declination',
    },
    powerOfAttorneyFormSubmission: {
      status: 'completed',
    },
  },
  {
    id: '126',
    createdAt: '2024-12-10T08:15:30Z',
    expiresAt: '2025-01-10T08:15:30Z',
    powerOfAttorneyForm: {
      claimant: {
        name: {
          first: 'Sarah',
          last: 'Davis',
        },
        address: {
          city: 'Richmond',
          stateCode: 'VA',
          zipCode: '23219',
        },
        ssn: '4567',
        vaFileNumber: '8901',
        phone: '(804) 555-7890',
        email: 'sarah.davis@gmail.com',
        relationship: 'Self',
      },
      veteran: {
        name: {
          first: 'Sarah',
          last: 'Davis',
        },
        ssn: '4567',
        vaFileNumber: '8901',
      },
      authorizations: {
        recordDisclosureLimitations: [],
        addressChange: true,
      },
    },
    powerOfAttorneyHolder: {
      name: 'Veterans of Foreign Wars',
    },
    accreditedIndividual: {
      fullName: 'Michael Thompson',
    },
    resolution: null,
    powerOfAttorneyFormSubmission: {
      status: null,
    },
  },
  {
    id: '127',
    createdAt: '2024-11-28T16:42:18Z',
    expiresAt: '2024-12-28T16:42:18Z',
    powerOfAttorneyForm: {
      claimant: {
        name: {
          first: 'Michael',
          last: 'Brown',
        },
        address: {
          city: 'Norfolk',
          stateCode: 'VA',
          zipCode: '23510',
        },
        ssn: '7890',
        vaFileNumber: '2345',
        phone: '(757) 555-4321',
        email: 'michael.brown@outlook.com',
        relationship: 'Self',
      },
      veteran: {
        name: {
          first: 'Michael',
          last: 'Brown',
        },
        ssn: '7890',
        vaFileNumber: '2345',
      },
      authorizations: {
        recordDisclosureLimitations: ['HIV'],
        addressChange: false,
      },
    },
    powerOfAttorneyHolder: {
      name: 'Paralyzed Veterans of America',
    },
    accreditedIndividual: {
      fullName: 'Lisa Rodriguez',
    },
    resolution: null,
    powerOfAttorneyFormSubmission: {
      status: null,
    },
  },
  {
    id: '128',
    createdAt: '2024-12-05T12:30:45Z',
    expiresAt: '2025-01-05T12:30:45Z',
    powerOfAttorneyForm: {
      claimant: {
        name: {
          first: 'Jennifer',
          last: 'Wilson',
        },
        address: {
          city: 'Virginia Beach',
          stateCode: 'VA',
          zipCode: '23451',
        },
        ssn: '3456',
        vaFileNumber: '7890',
        phone: '(757) 555-9999',
        email: 'jennifer.wilson@yahoo.com',
        relationship: 'Self',
      },
      veteran: {
        name: {
          first: 'Jennifer',
          last: 'Wilson',
        },
        ssn: '3456',
        vaFileNumber: '7890',
      },
      authorizations: {
        recordDisclosureLimitations: ['DRUG_ABUSE', 'ALCOHOLISM'],
        addressChange: true,
      },
    },
    powerOfAttorneyHolder: {
      name: 'AMVETS',
    },
    accreditedIndividual: {
      fullName: null,
    },
    resolution: null,
    powerOfAttorneyFormSubmission: {
      status: null,
    },
  },
  {
    id: '129',
    createdAt: '2024-12-01T10:20:35Z',
    expiresAt: '2025-01-01T10:20:35Z',
    powerOfAttorneyForm: {
      claimant: {
        name: {
          first: 'David',
          last: 'Martinez',
        },
        address: {
          city: 'Chesapeake',
          stateCode: 'VA',
          zipCode: '23320',
        },
        ssn: '6789',
        vaFileNumber: '0123',
        phone: '(757) 555-2468',
        email: 'david.martinez@gmail.com',
        relationship: 'Self',
      },
      veteran: {
        name: {
          first: 'David',
          last: 'Martinez',
        },
        ssn: '6789',
        vaFileNumber: '0123',
      },
      authorizations: {
        recordDisclosureLimitations: [],
        addressChange: false,
      },
    },
    powerOfAttorneyHolder: {
      name: 'Military Order of the Purple Heart',
    },
    accreditedIndividual: {
      fullName: 'Amanda Clark',
    },
    resolution: null,
    powerOfAttorneyFormSubmission: {
      status: null,
    },
  },
  {
    id: '130',
    createdAt: '2024-11-15T14:55:12Z',
    expiresAt: '2024-12-15T14:55:12Z',
    powerOfAttorneyForm: {
      claimant: {
        name: {
          first: 'Lisa',
          last: 'Anderson',
        },
        address: {
          city: 'Newport News',
          stateCode: 'VA',
          zipCode: '23601',
        },
        ssn: '8901',
        vaFileNumber: '4567',
        phone: '(757) 555-8765',
        email: 'lisa.anderson@yahoo.com',
        relationship: 'Self',
      },
      veteran: {
        name: {
          first: 'Lisa',
          last: 'Anderson',
        },
        ssn: '8901',
        vaFileNumber: '4567',
      },
      authorizations: {
        recordDisclosureLimitations: ['SICKLE_CELL'],
        addressChange: true,
      },
    },
    powerOfAttorneyHolder: {
      name: 'Vietnam Veterans of America',
    },
    accreditedIndividual: {
      fullName: 'James Parker',
    },
    resolution: {
      createdAt: '2024-11-30T09:12:33Z',
      type: 'decision',
      decisionType: 'acceptance',
    },
    powerOfAttorneyFormSubmission: {
      status: 'completed',
    },
  },
];

// Mock submissions data
const mockSubmissions = [
  {
    submittedDate: '2024-12-15',
    firstName: 'John',
    lastName: 'Snyder',
    formType: '21-686c',
    packet: true,
    confirmationNumber: 'e3bd5925-6902-4b94-acbc-49b554ffcec1',
    vbmsStatus: 'awaiting_receipt',
    vbmsReceivedDate: '2024-12-20',
    url: null,
  },
  {
    submittedDate: '2024-11-28',
    firstName: 'Montgomery',
    lastName: 'Anderson',
    formType: '21-22',
    packet: false,
    confirmationNumber: '58d1c6a3-f970-48cb-bc92-65403e2a0c16',
    vbmsStatus: 'received',
    vbmsReceivedDate: '2024-12-03',
    url: null,
  },
  {
    submittedDate: '2024-12-01',
    firstName: 'Isias',
    lastName: 'Fahey',
    formType: '21-22a',
    packet: false,
    confirmationNumber: 'f344d484-8b4b-4e81-93dc-5f6b6ef52bac',
    vbmsStatus: 'processing_error',
    vbmsReceivedDate: '2024-12-05',
    url: null,
  },
  {
    submittedDate: '2024-12-10',
    firstName: 'Sarah',
    lastName: 'Martinez',
    formType: '21-686c',
    packet: true,
    confirmationNumber: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    vbmsStatus: 'received',
    vbmsReceivedDate: '2024-12-15',
    url: null,
  },
  {
    submittedDate: '2024-11-20',
    firstName: 'David',
    lastName: 'Thompson',
    formType: '21-22',
    packet: false,
    confirmationNumber: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    vbmsStatus: 'awaiting_receipt',
    vbmsReceivedDate: '2024-11-25',
    url: null,
  },
  {
    submittedDate: '2024-12-05',
    firstName: 'Emily',
    lastName: 'Wilson',
    formType: '21-22a',
    packet: true,
    confirmationNumber: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    vbmsStatus: 'received',
    vbmsReceivedDate: '2024-12-10',
    url: null,
  },
];

// Mock user for accredited representative portal
const mockARPUser = {
  account: {
    accountUuid: '88f572d491af46efa393cba6c351e252',
  },
  profile: {
    firstName: 'Paul',
    lastName: 'Jacobs',
    verified: true,
    signIn: {
      serviceName: 'idme',
    },
  },
  prefillsAvailable: [],
  inProgressForms: [],
};

const responses = {
  ...commonResponses,

  // Override the user endpoint with ARP-specific user
  'GET /accredited_representative_portal/v0/user': mockARPUser,

  // POA requests endpoints
  'GET /accredited_representative_portal/v0/power_of_attorney_requests': (
    req,
    res,
  ) => {
    const { query } = req;
    const status = query.status || 'all';
    const pageSize = parseInt(query['page[size]'] || '20', 10);
    const pageNumber = parseInt(query['page[number]'] || '1', 10);

    // Filter by status if needed
    let filteredRequests = mockPOARequests;
    if (status === 'pending') {
      filteredRequests = mockPOARequests.filter(r => r.resolution === null);
    } else if (status === 'processed') {
      filteredRequests = mockPOARequests.filter(r => r.resolution !== null);
    }

    // Pagination
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

    return res.json({
      data: paginatedRequests,
      meta: {
        page: {
          number: pageNumber,
          size: pageSize,
          total: filteredRequests.length,
          totalPages: Math.ceil(filteredRequests.length / pageSize),
        },
      },
    });
  },

  // Single POA request endpoint - return the POA request directly, not wrapped in data
  'GET /accredited_representative_portal/v0/power_of_attorney_requests/123':
    mockPOARequests[0],
  'GET /accredited_representative_portal/v0/power_of_attorney_requests/124':
    mockPOARequests[1],
  'GET /accredited_representative_portal/v0/power_of_attorney_requests/125':
    mockPOARequests[2],

  // Claimant search endpoint
  'POST /accredited_representative_portal/v0/claimant/search': (req, res) => {
    // eslint-disable-next-line camelcase
    const { first_name, last_name, ssn, dob } = req.body;

    // Mock searchable claimants - based on actual POA request data
    const searchableClaimants = [
      {
        id: 'claimant-123',
        firstName: 'John',
        lastName: 'Smith',
        ssn: '123-45-1234',
        dob: '1990-01-15',
        city: 'Washington',
        state: 'DC',
        postalCode: '20024',
        representative: null,
        poaRequests: [mockPOARequests[0]], // Pending POA request
      },
      {
        id: 'claimant-124',
        firstName: 'Mary',
        lastName: 'Johnson',
        ssn: '234-56-5678',
        dob: '1985-03-22',
        city: 'Arlington',
        state: 'VA',
        postalCode: '22202',
        representative: 'American Legion',
        poaRequests: [mockPOARequests[1]], // Accepted POA request
      },
      {
        id: 'claimant-125',
        firstName: 'Robert',
        lastName: 'Williams',
        ssn: '345-67-9012',
        dob: '1975-11-08',
        city: 'Alexandria',
        state: 'VA',
        postalCode: '22314',
        representative: null,
        poaRequests: [mockPOARequests[2]], // Declined POA request
      },
    ];

    // Find matching claimant
    const match = searchableClaimants.find(claimant => {
      const firstNameMatch =
        // eslint-disable-next-line camelcase
        claimant.firstName.toLowerCase() === first_name?.toLowerCase();
      const lastNameMatch =
        // eslint-disable-next-line camelcase
        claimant.lastName.toLowerCase() === last_name?.toLowerCase();
      const ssnMatch =
        claimant.ssn.replace(/-/g, '') === ssn?.replace(/-/g, '');
      const dobMatch = claimant.dob === dob;

      return firstNameMatch && lastNameMatch && ssnMatch && dobMatch;
    });

    if (match) {
      return res.json({
        data: match,
      });
    }

    return res.json({ data: null });
  },

  // Submissions endpoint
  'GET /accredited_representative_portal/v0/claim_submissions': (req, res) => {
    const { query } = req;
    const pageSize = parseInt(query['page[size]'] || '20', 10);
    const pageNumber = parseInt(query['page[number]'] || '1', 10);

    // Pagination
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedSubmissions = mockSubmissions.slice(startIndex, endIndex);

    return res.json({
      data: paginatedSubmissions,
      meta: {
        page: {
          number: pageNumber,
          size: pageSize,
          total: mockSubmissions.length,
          totalPages: Math.ceil(mockSubmissions.length / pageSize),
        },
      },
    });
  },

  // POA request decision endpoint
  'POST /accredited_representative_portal/v0/power_of_attorney_requests/:id/decision': (
    req,
    res,
  ) => {
    const { id } = req.params;
    const { decision } = req.body;

    return res.json({
      data: {
        id,
        decision,
        message: 'Decision recorded successfully',
      },
    });
  },

  // Feature toggles override to enable all features
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        ...commonResponses['GET /v0/feature_toggles'].data.features,
        {
          name: 'accredited_representative_portal_frontend',
          value: true,
        },
        {
          name: 'accredited_representative_portal_pilot',
          value: true,
        },
        {
          name: 'accredited_representative_portal_search',
          value: true,
        },
        {
          name: 'accredited_representative_portal_submissions',
          value: true,
        },
      ],
    },
  },
};

module.exports = responses;
