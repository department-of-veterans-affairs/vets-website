export const attorney = {
  'view:selectedRepresentative': {
    type: 'representative',
    attributes: {
      individualType: 'attorney',
    },
  },
};

export const agent = {
  'view:selectedRepresentative': {
    type: 'representative',
    attributes: {
      individualType: 'claim_agents',
    },
  },
};

export const vso = {
  'view:selectedRepresentative': {
    type: 'representative',
    attributes: {
      individualType: 'veteran_service_officer',
    },
  },
};

export const org = {
  'view:selectedRepresentative': {
    type: 'organization',
  },
};
