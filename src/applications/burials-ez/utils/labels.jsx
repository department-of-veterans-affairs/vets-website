export const relationshipLabels = {
  spouse: 'Surviving spouse or partner from a legal union',
  child: 'Child',
  parent: 'Parent',
  executor:
    'Executor of the Veteran’s estate or someone else acting for the Veteran’s estate',
  funeralDirector: 'Funeral home, cemetery, or other organization',
  otherFamily:
    'Other family member or friend who isn’t the executor of the Veteran’s estate',
};

export const locationOfDeathLabels = {
  atHome: 'At home',
  nursingHomePaid: 'In a nursing home or facility that VA pays for',
  nursingHomeUnpaid: 'In a nursing home or facility that VA doesn’t pay for',
  vaMedicalCenter: 'In a VA medical center',
  stateVeteransHome: 'In a state Veterans facility',
  other: 'Other',
};

export const allowanceLabels = {
  service: {
    title: 'Burial allowance for a service-connected death',
    description:
      'Select if the Veteran’s death was caused by an illness, injury, or condition related to their military service.',
  },
  nonService: {
    title: 'Burial allowance for a non-service-connected death',
    description:
      'Select if the Veteran’s death wasn’t caused by their military service.',
  },
  unclaimed: {
    title: 'Burial allowance for a Veteran’s unclaimed remains',
    description:
      'Select if the Veteran’s remains have not been claimed by relatives or friends.',
  },
};

export const benefitsLabels = {
  burialAllowance: 'Burial and funeral costs',
  plotAllowance: 'Cost of the plot (gravesite) or final resting place',
  transportation:
    'Transportation costs of transporting the Veteran’s remains to the final resting place',
};

export const restingPlaceLabels = {
  cemetery: 'Cemetery or graveyard',
  mausoleum: 'Mausoleum, vault, tomb, or crypt',
  privateResidence: 'Private residence or at home',
  other: 'Other',
};

export const cemeteryTypeLabels = {
  cemetery: 'Yes, in a state cemetery',
  tribalLand: 'Yes, on tribal trust land',
  none: 'No, in neither of these types of cemeteries',
};

export const fasterClaimLabels = {
  Y:
    'Yes. I’ve uploaded all my supporting documents for my application for burial benefits',
  N: 'No. I have other supporting documents to submit later',
};

export const serviceBranchLabels = {
  army: 'Army',
  navy: 'Navy',
  airForce: 'Air Force',
  coastGuard: 'Coast Guard',
  marineCorps: 'Marine Corps',
  spaceForce: 'Space Force',
  usphs: 'USPHS',
  noaa: 'NOAA',
};
