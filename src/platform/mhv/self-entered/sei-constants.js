/** from BloodSugarTestingMethodEnumeration.java */
export const VITALS_BLOOD_SUGAR_METHOD = {
  CLT: 'Clinical Lab Test',
  SL: 'Sterile Lancet',
  T: 'Transcutaneous',
  I: 'Implant',
  O: 'Other',
};

/** from TemperatureMeasureEnumeration.java */
export const VITALS_BODY_TEMP_MEASURE = {
  F: 'Fahrenheit',
  C: 'Celsius',
  N: 'Not Available',
};

/** from TemperatureMethodEnumeration.java */
export const VITALS_BODY_TEMP_METHOD = {
  U: 'Underarm',
  R: 'Rectum',
  M: 'Mouth',
  G: 'Groin',
  E: 'Ear',
  O: 'Other',
};

/** from WeightMeasureEnumeration.java */
export const VITALS_BODY_WEIGHT_MEASURE = {
  P: 'Pounds',
  K: 'Kilograms',
  N: 'Not Available',
};

/** from InrHighEndTargetRangeEnumeration.java */
export const VITALS_INR_HIGH_TARGET_RANGE = {
  NONE: 'No Target',
  LETR: '3.0',
  METR: '3.5',
  HETR: '4.0',
};

/** from InrLowEndTargetRangeEnumeration.java */
export const VITALS_INR_LOW_TARGET_RANGE = {
  NONE: 'No Target',
  LETR: '1.5',
  METR: '2.0',
  HETR: '2.5',
};

/** from OxygenDeviceEnumeraion.java */
export const VITALS_PULSE_OX_DEVICE = {
  N: 'None',
  NC: 'Nasal Cannula',
  FM: 'Face Mask',
  PRM: 'Partial Rebreather Mask',
  NRM: 'Non-rebreather Mask',
  SOM: 'Simple Oxygen Mask',
  VM: 'Venturi Mask',
  TM: 'Tracheostomy Mask',
  OH: 'Oxygen Hood',
  FT: 'Face Tent',
  OCD: 'Oxygen Conserving Device (OCD)',
  O: 'Other',
};

/** from SymptomsEnumeration.java */
export const VITALS_PULSE_OX_SYMPTOMS = {
  N: 'None',
  SOB: 'Shortness Of Breath',
  D: 'Dizziness',
  NU: 'Nausea',
  C: 'Confusion',
  F: 'Fainting',
  NV: 'Nervousness',
  O: 'Other',
};

/** from SeverityEnumeration.java */
export const ALLERGIES_SEVERITY = {
  S: 'Severe',
  M: 'Moderate',
  L: 'Mild',
};

/** from DiagnosedEnumeration.java */
export const ALLERGIES_DIAGNOSED = {
  Y: 'Yes',
  N: 'No',
};

/** from RelationshipEnumeration.java */
export const FAMILY_HISTORY_RELATIONSHIPS = {
  S: 'Self',
  M: 'Mother',
  F: 'Father',
  GFMS: "Grandfather - Mother's Side",
  GMMS: "Grandmother - Mother's Side",
  GFFS: "Grandfather - Father's Side",
  GMFS: "Grandmother - Father's Side",
  UMS: "Uncle - Mother's Side",
  AMS: "Aunt - Mother's Side",
  UFS: "Uncle - Father's Side",
  AFS: "Aunt - Father's Side",
  SSTR: 'Sister',
  BRTH: 'Brother',
  DGHTR: 'Daughter',
  SN: 'Son',
  HLFS: 'Half Sister',
  HLFB: 'Half Brother',
  MCSN: 'Male Cousin',
  FCSN: 'Female Cousin',
  NPHW: 'Nephew',
  NCE: 'Niece',
  NOTHING: '',
};

/** from bbfamilyhealthhistory.prc */
export const FAMILY_HISTORY_ISSUES = [
  { jsonField: 'awOther', string: 'Airway and Breathing System Other' },
  { jsonField: 'alcSixDrinks', string: '>6 beers/wines a day' },
  { jsonField: 'pnBack', string: 'Back Pain' },
  { jsonField: 'mdOther', string: 'Mood or Cognitive Disorders Other' },
  { jsonField: 'slInsomnia', string: 'Insomnia' },
  { jsonField: 'caOvarian', string: 'Ovarian Cancer' },
  { jsonField: 'stmSevereIndigestion', string: 'Severe Indigestion' },
  { jsonField: 'skOther', string: 'Skin Disorders Other' },
  { jsonField: 'alLupus', string: 'Lupus' },
  { jsonField: 'gbStones', string: 'Gallbladder stones' },
  { jsonField: 'alcOneDrink', string: '>1 beer/wine a day' },
  { jsonField: 'chMeasles', string: 'Measles' },
  { jsonField: 'kiStones', string: 'Kidney Stones' },
  { jsonField: 'mdBipolar', string: 'Bipolar' },
  { jsonField: 'chDiphtheria', string: 'Diphtheria' },
  { jsonField: 'baLymeDisease', string: 'Lyme Disease' },
  { jsonField: 'caBreast', string: 'Breast Cancer' },
  { jsonField: 'thTumor', string: 'Thyroid Tumor' },
  { jsonField: 'heAttack', string: 'Heart Attack' },
  { jsonField: 'chOther', string: 'Childhood Other' },
  { jsonField: 'mdSchizophrenia', string: 'Schizophrenia' },
  { jsonField: 'kiRenalFailure', string: 'Renal Failure' },
  { jsonField: 'hntHearingLoss', string: 'Hearing Loss' },
  { jsonField: 'awPneumonia', string: 'Pneumonia' },
  { jsonField: 'caProstate', string: 'Prostate Cancer' },
  { jsonField: 'awBronchitis', string: 'Bronchitis' },
  { jsonField: 'baJointPain', string: 'Joint Pain' },
  { jsonField: 'hntMigraineHeadaches', string: 'Migraine Headaches' },
  { jsonField: 'awEmphysema', string: 'Emphysema' },
  { jsonField: 'slApnea', string: 'Sleep Apnea' },
  { jsonField: 'hntDyslexia', string: 'Dyslexia' },
  { jsonField: 'pnLeg', string: 'Leg pain walking long distances' },
  { jsonField: 'smOnePackPerDay', string: 'Smoking >1 pack/day' },
  { jsonField: 'awCOPD', string: 'COPD' },
  { jsonField: 'alAllergies', string: 'Allergies' },
  { jsonField: 'chChickenPox', string: 'Chicken Pox' },
  { jsonField: 'caOther', string: 'Cancer Other' },
  { jsonField: 'skPsoriasis', string: 'Psoriasis' },
  { jsonField: 'nvSeizures', string: 'Seizures (Not Epilepsy)' },
  { jsonField: 'stdGonorrhea', string: 'Gonorrhea' },
  { jsonField: 'stmPain', string: 'Stomach/Bowel Pain' },
  { jsonField: 'wtUnderweight', string: 'Underweight' },
  { jsonField: 'liOther', string: 'Liver Other' },
  { jsonField: 'slOther', string: 'Sleep Disorders Other' },
  { jsonField: 'pnOther', string: 'Pain Other' },
  { jsonField: 'chMumps', string: 'Mumps' },
  { jsonField: 'liHepatitisC', string: 'Hepatitis C' },
  { jsonField: 'nvOther', string: 'Nervous System Other' },
  { jsonField: 'stmIBS', string: 'Irritable Bowel Syndrome' },
  { jsonField: 'blOther', string: 'Blood Disorders Other' },
  { jsonField: 'heCongestiveFailure', string: 'Congestive Heart Failure' },
  { jsonField: 'baOther', string: 'Body Aches and Pains Other' },
  { jsonField: 'hntDizziness', string: 'Dizziness' },
  { jsonField: 'gbDisease', string: 'Gallbladder Disease' },
  { jsonField: 'baFibromyalgia', string: 'Fibromyalgia' },
  { jsonField: 'nbOnePerWeek', string: 'Nose Bleeds >1/week' },
  { jsonField: 'stdChlamydia', string: 'Chlamydia' },
  { jsonField: 'stdSyphilis', string: 'Syphilis' },
  { jsonField: 'smCurrent', string: 'Current Smoker' },
  { jsonField: 'blBruising', string: 'Bruising' },
  { jsonField: 'caLung', string: 'Lung Cancer' },
  { jsonField: 'blLeukemia', string: 'Leukemia' },
  { jsonField: 'liHepatitisB', string: 'Hepatitis B' },
  { jsonField: 'hntCataracts', string: 'Cataracts' },
  { jsonField: 'dbType2', string: 'Diabetics Type 2' },
  { jsonField: 'wtOverweight', string: 'Overweight' },
  { jsonField: 'stdHerpes', string: 'Herpes' },
  { jsonField: 'heOther', string: 'Heart/Cardiovascular Other' },
  { jsonField: 'heHighPressure', string: 'High Blood Pressure' },
  { jsonField: 'nvMultipleSclerosis', string: 'Multiple Sclerosis' },
  { jsonField: 'skEczema', string: 'Eczema' },
  { jsonField: 'thGoiter', string: 'Goiter' },
  { jsonField: 'pnJoint', string: 'Joint Pain' },
  { jsonField: 'stmNausea', string: 'Nausea' },
  { jsonField: 'awSoB', string: 'Shortness of Breath' },
  { jsonField: 'pnMuscle', string: 'Muscle Pain' },
  { jsonField: 'mdParanoia', string: 'Paranoia' },
  { jsonField: 'alOther', string: 'Allergy Other' },
  { jsonField: 'liHepatitisA', string: 'Hepatitis A' },
  { jsonField: 'hntGlaucoma', string: 'Glaucoma' },
  { jsonField: 'heMurmur', string: 'Heart Murmur' },
  { jsonField: 'alcSocial', string: 'Alcohol History Social' },
  { jsonField: 'mdDepression', string: 'Depression' },
  { jsonField: 'nvEpilepsy', string: 'Epilepsy' },
  { jsonField: 'mdPTSD', string: 'PTSD' },
  { jsonField: 'heAngina', string: 'Angina' },
  { jsonField: 'chWhoopingCough', string: 'Whooping Cough' },
  { jsonField: 'thOther', string: 'Thyroid' },
  { jsonField: 'heHighCholesterol', string: 'High Blood Cholesterol' },
  { jsonField: 'awTuberculosis', string: 'Tuberculosis' },
  { jsonField: 'nbOnePerDay', string: 'Nose Bleeds >1/day' },
  { jsonField: 'caColon', string: 'Colon Cancer' },
  { jsonField: 'kiInfections', string: 'Kidney Infections' },
  { jsonField: 'blAnemia', string: 'Anemia' },
  { jsonField: 'baArthritis', string: 'Arthritis' },
  { jsonField: 'caBowel', string: 'Bowel Cancer' },
  { jsonField: 'caSkin', string: 'Skin Cancer' },
  { jsonField: 'blClotting', string: 'Blood Clotting' },
  { jsonField: 'nbOnePerMonth', string: 'Nose Bleeds >1/month' },
  { jsonField: 'hntRetinitisPigmentosa', string: 'Retinitis Pigmentosa' },
  { jsonField: 'caStomach', string: 'Stomach Cancer' },
  { jsonField: 'smTenYears', string: 'Smoking >10 Years' },
  { jsonField: 'awAsthma', string: 'Asthma' },
  { jsonField: 'gbOther', string: 'Gallbladder Other' },
  { jsonField: 'dbType3', string: 'Diabetes Type 3' },
  { jsonField: 'kiOther', string: 'Kidney Other' },
  { jsonField: 'alcTwoShots', string: 'Alcohol >2 shots a day' },
  { jsonField: 'stdOther', string: 'Sexually Transmitted Disease' },
  { jsonField: 'nvParalysis', string: 'Paralysis' },
  { jsonField: 'heStroke', string: 'Stroke' },
  { jsonField: 'mdAnxiety', string: 'Anxiety' },
  { jsonField: 'liCirrhosis', string: 'Cirrhosis' },
  { jsonField: 'dbType1', string: 'Diabetes Type 1' },
  { jsonField: 'heRhythmAbnormality', string: 'Heart Rhythm Abnormalities' },
  { jsonField: 'blSickleCell', string: 'Sickle Cell Anemia' },
  { jsonField: 'hntOther', string: 'Head Eyes Ears Nose Throat Other' },
  { jsonField: 'nvNumbness', string: 'Numbness' },
  { jsonField: 'stmOther', string: 'Stomach/Bowel Other' },
  { jsonField: 'smTwentyYears', string: 'Smoking >20 Years' },
  { jsonField: 'heMitralValveProlapse', string: 'Mitral Valve Prolapse' },
  { jsonField: 'stmUlcers', string: 'Stomach/Bowel Ulcers' },
];

/** from ImmunizationEnumeration.java */
export const VACCINE_TYPE = {
  A: 'Adenovirus',
  NTHRX: 'Anthrax',
  BCGI: 'BCG (tuberculosis, Bacillus Calmette-Guerin)',
  CVD19J: 'COVID-19 (Janssen/J&J)',
  CVD19M: 'COVID-19 (Moderna)',
  CVD19P: 'COVID-19 (Pfizer-BioNTech)',
  COVD19: 'COVID-19',
  CV: 'Chickenpox (Varicella)',
  HLR: 'Cholera',
  DEN: 'Dengue',
  DPHTH: 'Diphtheria',
  DPT: 'DPT (Diphtheria, Pertussis, Tetanus)',
  FLU: 'Flu (influenza)',
  HIB2: 'Haemophilus Influenza B',
  HA: 'Hepatitis A',
  HEPA: 'Hepatitis A',
  HEPAB: 'Hepatitis A & Hepatitis B',
  HB: 'Hepatitis B',
  HEPB: 'Hepatitis B',
  HIB: 'HIB (Haemophilus influenzae type b)',
  HPV: 'HPV (Human papillomavirus)',
  ISG: 'ISG (Gamma Globulin)',
  IIV: 'Influenza inactivated',
  LAIV4: 'Influenza live attenuated',
  RIV4: 'Influenza recombinant',
  NCPHLT: 'Japanese Encephalitis',
  LD: 'Lyme Disease',
  MLR: 'Malaria',
  MSLS: 'Measles',
  MR: 'Measles + Rubella',
  MMR2: 'Measles, Mumps, Rubella',
  MNNGC: 'Meningococcal (Meningitis) A',
  MACWY: 'Meningococcal A, C, W, Y (MenACWY)',
  MENB: 'Meningococcal B (MenB)',
  MPS: 'Mumps',
  MMR: 'MMR (Measles, Mumps, Rubella)',
  MMRV: 'MMRV (Measles, Mumps, Rubella, Varicella (chickenpox))',
  OTHER: 'Other',
  PLQ: 'Plague',
  P: 'Pneumococcal (Pneumonia)',
  PCV13: 'Pneumococcal conjugate (PCV13, PCV15, PCV20)',
  PPSV23: 'Pneumococcal polysaccharide (PPSV23)',
  POP: 'Polio',
  RBS: 'Rabies',
  RTVRS: 'Rotavirus',
  RGM: 'Rubella',
  RM: 'Rubella + Mumps',
  RZV: 'Shingles (Zoster Vaccine Live)',
  RZV2: 'Shingles (Zoster Recombinant)',
  S: 'Smallpox',
  TD: 'Td (Tetanus, diphtheria)',
  TDAP: 'Tdap (Tetanus, diphtheria, pertussis)',
  TT: 'Tetanus',
  TD2: 'Tetanus, Diphtheria',
  TB: 'Tuberculosis (TB, BCG (Bacillus Calmette-Guerin))',
  YPHD: 'Typhoid',
  YPHS: 'Typhus',
  VAR: 'Varicella (chickenpox)',
  YF: 'Yellow Fever',
};

/** from VaccinationMethodEnumeration.java */
export const VACCINE_METHOD = {
  J: 'Injection',
  H: 'Inhalant',
  M: 'By Mouth',
};

/** from VaccinationMethodEnumeration.java */
export const VACCINE_REACTION = {
  HLS: 'Chills',
  DRRHA: 'Diarrhea',
  IWE: 'Itching, Watering Eyes',
  HVS: 'Hives',
  LBP: 'Low Blood Pressure',
  DM: 'Dry Mouth',
  DRWSNS: 'Drowsiness',
  DRNS: 'Dry Nose',
  NSAVMT: 'Nausea/Vomiting',
  RSH: 'Rash',
};

/** from OnboardShipEnumeration.java */
export const MILITARY_HISTORY_ONBOARD_SHIP = {
  Y: 'Yes',
  N: 'No',
};

/** from BranchEnumeration.java */
export const MILITARY_HISTORY_BRANCH = {
  AF: 'Air Force',
  A: 'Army',
  CG: 'Coast Guard',
  MC: 'Marine Corps',
  MS: 'Merchant Seaman',
  N: 'Navy',
  NOAA: 'NOAA',
  USPHS: 'USPHS',
  O: 'Other',
};

/** from LocationEnumeration.java */
export const MILITARY_HISTORY_LOCATION = {
  US: 'United States',
  O: 'Overseas',
};

/** from LocationEnumeration.java */
export const HEALTHCARE_PROVIDER_TYPE = {
  P: 'Primary',
  S: 'Specialist',
  D: 'Dentist',
  E: 'Eye',
  O: 'Other Clinician',
};

/** from FacilityTypeEnumeration.java */
export const TREATMENT_FACILITY_TYPE = {
  V: 'VA',
  NV: 'Non VA',
};

/** from ActivityTypeEnumeration.java */
export const ACTIVITY_JOURNAL_TYPE = {
  A: 'Aerobic/Cardio',
  W: 'Weights',
  O: 'Other',
};

/** from MeasureEnumeration.java */
export const ACTIVITY_JOURNAL_MEASURE = {
  MN: 'Min(s)',
  HR: 'hr(s)',
  ML: 'mile(s)',
  KM: 'kilometer(s)',
  LP: 'lap(s)',
  P: 'pound(s)',
  KG: 'kilogram(s)',
};

/** from CategoryTypeEnumeration.java */
export const MEDICATIONS_CATEGORY = {
  M: 'Rx Medication',
  OTC: 'Over-the-Counter',
  H: 'Herbal',
  S: 'Supplement',
  O: 'Other',
};
