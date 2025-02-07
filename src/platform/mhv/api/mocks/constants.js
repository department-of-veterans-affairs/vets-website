const senderInfo = {
  cb: { id: 2992380, name: 'BROADUS, CALVIN' },
  ay: { id: 3914360, name: 'YOUNG, ANDRE' },
  do: { id: 5290587, name: 'OWENS, DANA' },
  cw: { id: 1982284, name: 'WALLACE, CHRISTOPHER' },
  jc: { id: 6873519, name: 'CAMPALONG, JEREMY' },
  mm: { id: 4927381, name: 'MATHERS, MARSHALL' },
  cy: { id: 5979167, name: 'YOUNG, CALVIN' },
};

const categoryInfo = {
  APPOINTMENT: 'APPOINTMENTS',
  COVID: 'COVID',
  EDUCATION: 'EDUCATION',
  OTHER: 'OTHER',
  MEDICATIONS: 'MEDICATIONS',
  TEST_RESULTS: 'TEST_RESULTS',
};

const triageGroupNames = {
  AUDIOLOGY: 'DETROIT: Audiology, House, Gregory, Md',
  CARDIOLOGY: 'DETROIT: Cardiology, Yang, Christina, Md',
  PRIMARY: '** DETROIT: Primary Care, Lydon, John R. Md',
  MHVCOORD: 'DETROIT: MHV Coordinator, Prince, Diana',
  PHARMACY: 'DETROIT: Pharmacy',
  DERMATOLOGY: 'DETROIT: Dermatology, Bishop, Walter, Md',
};

module.exports = {
  senderInfo,
  categoryInfo,
  triageGroupNames,
};
