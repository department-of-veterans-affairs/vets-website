export const STATUS_TYPE_CONFIG = {
  '1': {
    alertType: 'info',
    category: 'Account is being updated',
    links: ['details'],
    phoneSet: 'dmc',
  },
  '2': {
    alertType: 'warning',
    category: 'Being sent to Treasury soon',
    linksByView: {
      summary: ['details', 'resolve'],
      details: ['resolve'],
    },
  },
  '3': {
    alertType: 'info',
    category: 'Benefits Offset',
    linksByView: {
      summary: ['details'],
      details: ['askVa'],
    },
    phoneSet: 'dmc',
  },
  '4': {
    alertType: 'info',
    category: 'Collections are Paused',
    linksByView: {
      summary: ['details', 'resolve'],
      details: ['resolve'],
    },
    phoneSet: 'dmc',
  },
  '5': {
    alertType: 'info',
    category: 'Under Review',
    linksByView: {
      summary: ['details', 'resolve'],
      details: ['makePayment'],
    },
  },
  '6': {
    alertType: 'info',
    category: 'Make a Compromise Offer Payment',
    linksByView: {
      summary: ['details', 'resolve'],
      details: ['makePayment'],
    },
  },
  '7': {
    alertType: 'info',
    category: 'Make a Monthly Payment',
    linksByView: {
      summary: ['details', 'resolve'],
      details: ['makePayment'],
    },
  },
  '8': {
    alertType: 'warning',
    category: 'Make a Payment',
    linksByView: {
      summary: ['details', 'resolve'],
      details: ['resolve'],
    },
  },
  '9': {
    alertType: 'warning',
    category: 'Sent to Treasury',
    links: ['details'],
    phoneSet: 'treasury',
  },
  '10': {
    alertType: 'info',
    category: 'Verify Status',
    links: ['details'],
    phoneSet: 'dmc',
  },
  '11': {
    alertType: 'info',
    category: 'Address needed',
    linksByView: {
      summary: ['details'],
      details: ['updateAddress'],
    },
  },
  '12': {
    alertType: 'warning',
    category: 'FSR needs to be submitted',
    linksByView: {
      summary: ['details', 'resolve'],
      details: ['requestHelp'],
    },
  },
};
