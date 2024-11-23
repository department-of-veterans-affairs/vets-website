import { format } from 'date-fns';
import { Actions } from '../util/actionTypes';
import * as Const from '../util/seiConstants';

const initialState = {
  vitals: undefined,
  allergies: undefined,
  familyHistory: undefined,
  vaccines: undefined,
  testEntries: undefined,
  medicalEvents: undefined,
  militaryHistory: undefined,
  providers: undefined,
  healthInsurance: undefined,
  treatmentFacilities: undefined,
  foodJournal: undefined,
  activityJournal: undefined,
  medications: undefined,
};

export const NONE_ENTERED = 'None entered';

/**
 * @param {*} map an object containing key value pairs
 * @param {*} key the key to search for
 * @returns the corresponding value
 */
export const mapValue = (map, key) => {
  if (!map || key === null) return null;
  return map[key] !== undefined ? map[key] : null;
};

/**
 * @param {Number} timestamp a millisecond timestamp. e.g. 1610082000000
 * @returns a nicely formatted date
 */
export const formatTimestamp = timestamp => {
  if (timestamp === undefined || timestamp === null) return null;
  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return null;
  return format(new Date(timestamp), 'MMMM d, yyyy');
};

/**
 * @param {String} inputDate acceptable formats: 05/09/2017, 2020-11-10, 2020-04-29T23:59:00
 * @returns a date formatted as May 1, 2024
 */
export function formatDate(inputDate) {
  if (!inputDate) return null;

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let monthIndex;
  let day;
  let year;

  // Remove the time portion if it exists
  let cleanedDate = inputDate;
  if (cleanedDate.includes('T')) {
    [cleanedDate] = cleanedDate.split('T');
  }

  if (cleanedDate.includes('/')) {
    // Format is MM/DD/YYYY
    const parts = cleanedDate.split('/');
    if (parts.length !== 3) return null;
    monthIndex = parseInt(parts[0], 10) - 1; // Convert to zero-based index
    day = parseInt(parts[1], 10);
    [, , year] = parts;
  } else if (cleanedDate.includes('-')) {
    // Format is YYYY-MM-DD
    const parts = cleanedDate.split('-');
    if (parts.length !== 3) return null;
    [year] = parts;
    monthIndex = parseInt(parts[1], 10) - 1; // Convert to zero-based index
    day = parseInt(parts[2], 10);
  } else {
    // Unknown format
    return null;
  }

  // Validate the date components
  if (
    monthIndex < 0 ||
    monthIndex > 11 ||
    day < 1 ||
    day > 31 ||
    Number.isNaN(monthIndex) ||
    Number.isNaN(day) ||
    Number.isNaN(parseInt(year, 10))
  ) {
    return null;
  }

  // Get the month name
  const monthName = months[monthIndex];

  // Construct the new date format
  return `${monthName} ${day}, ${year}`;
}

/**
 * @param {*} inputTime a time in the format of either: 2100, 21:00
 * @returns a time formatted as 2100
 */
export const formatTime = inputTime => {
  if (!inputTime) return null;

  // Regular expression to match HH:MM or HHMM format
  const timeRegex = /^(\d{1,2}):?(\d{2})$/;
  const match = inputTime.match(timeRegex);

  if (!match) {
    return null;
  }

  const [, hours, minutes] = match;
  return `${hours.padStart(2, '0')}${minutes.padStart(2, '0')}`;
};

/**
 * - Stored procedure: bbvitalsandreadings.prc
 * - DTO:
 */
export const convertVitalsBloodPressure = recordList => {
  if (!Array.isArray(recordList)) return [];
  return recordList.map(record => ({
    date: formatDate(record.dateEntered) || NONE_ENTERED, // 05/09/2017
    time: formatTime(record.timeEntered) || NONE_ENTERED, // 23:59
    systolic: record.systolic || NONE_ENTERED,
    diastolic: record.diastolic || NONE_ENTERED,
    comments: record.comments || NONE_ENTERED,
  }));
};

/**
 * - Stored procedure: bbvitalsandreadings.prc
 * - DTO:
 */
export const convertVitalsBloodSugar = recordList => {
  if (!Array.isArray(recordList)) return [];
  return recordList.map(record => ({
    date: formatDate(record.dateEntered) || NONE_ENTERED, // 05/09/2017
    time: formatTime(record.timeEntered) || NONE_ENTERED, // 23:59
    method:
      mapValue(Const.VITALS_BLOOD_SUGAR_METHOD, record.testingMethod) ||
      NONE_ENTERED,
    bloodSugarCount: record.bloodSugarCount || NONE_ENTERED,
    comments: record.comments || NONE_ENTERED,
  }));
};

/**
 * - Stored procedure: bbvitalsandreadings.prc
 * - DTO:
 */
export const convertVitalsBodyTemp = recordList => {
  if (!Array.isArray(recordList)) return [];
  return recordList.map(record => ({
    date: formatDate(record.dateEntered) || NONE_ENTERED, // 05/09/2017
    time: formatTime(record.timeEntered) || NONE_ENTERED, // 23:59
    bodyTemperature: record.bodyTemperature || NONE_ENTERED,
    measure:
      mapValue(Const.VITALS_BODY_TEMP_MEASURE, record.measure) || NONE_ENTERED,
    method:
      mapValue(Const.VITALS_BODY_TEMP_METHOD, record.bodyTemperatureMethod) ||
      NONE_ENTERED,
    comments: record.comments || NONE_ENTERED,
  }));
};

/**
 * - Stored procedure: bbvitalsandreadings.prc
 * - DTO:
 */
export const convertVitalsBodyWeight = recordList => {
  if (!Array.isArray(recordList)) return [];
  return recordList.map(record => ({
    date: formatDate(record.dateEntered) || NONE_ENTERED, // 05/09/2017
    time: formatTime(record.timeEntered) || NONE_ENTERED, // 23:59
    bodyWeight: record.bodyweight || NONE_ENTERED,
    measure:
      mapValue(Const.VITALS_BODY_WEIGHT_MEASURE, record.bodyweightMeasure) ||
      NONE_ENTERED,
    comments: record.comments || NONE_ENTERED,
  }));
};

/**
 * - Stored procedure: bbvitalsandreadings.prc
 * - DTO:
 */
export const convertVitalsCholesterol = recordList => {
  if (!Array.isArray(recordList)) return [];
  return recordList.map(record => ({
    date: formatDate(record.dateEntered) || NONE_ENTERED, // 05/09/2017
    time: formatTime(record.timeEntered) || NONE_ENTERED, // 23:59
    totalCholesterol: record.total || NONE_ENTERED, // 350
    hdl: record.hdl || NONE_ENTERED,
    ldl: record.ldl || NONE_ENTERED,
    comments: record.comments || NONE_ENTERED,
  }));
};

/**
 * - Stored procedure: bbvitalsandreadings.prc
 * - DTO:
 */
const convertVitalsHeartRate = recordList => {
  if (!Array.isArray(recordList)) return [];
  return recordList.map(record => ({
    date: formatDate(record.dateEntered), // 05/09/2017
    time: formatTime(record.timeEntered), // 23:59
    // readingDate: record.readingDate, // 1494388740000 - the timestamp of dateEntered + timeEntered
    heartRate: record.heartRate || NONE_ENTERED, // 123
    comments: record.comments || NONE_ENTERED,
  }));
};

/**
 * - Stored procedure: bbvitalsandreadings.prc
 * - DTO:
 */
const convertVitalsInr = recordList => {
  if (!Array.isArray(recordList)) return [];
  return recordList.map(record => ({
    date: formatDate(record.dateEntered), // 05/09/2017
    time: formatTime(record.timeEntered), // 23:59
    // readingDate: record.readingDate, // 1494388740000 - the timestamp of dateEntered + timeEntered
    inrValue: record.inr || NONE_ENTERED, // 0.2
    lowendTargetRange: record.lowendTargetRange || NONE_ENTERED, // NONE
    highendTargetRange: record.highendTragetRange || NONE_ENTERED, // NONE
    location: record.location || NONE_ENTERED, // null
    provider: record.provider || NONE_ENTERED, // null
    comments: record.comments || NONE_ENTERED,
  }));
};

/**
 * - Stored procedure: bbvitalsandreadings.prc
 * - DTO:
 */
const convertVitalsPain = recordList => {
  if (!Array.isArray(recordList)) return [];
  return recordList.map(record => ({
    date: formatDate(record.dateEntered), // 05/09/2017
    time: formatTime(record.timeEntered), // 23:59
    // readingDate: record.readingDate, // 1494388740000 - the timestamp of dateEntered + timeEntered
    painLevel: record.painLevel || NONE_ENTERED, // 3
    comments: record.comments || NONE_ENTERED,
  }));
};

/**
 * - Stored procedure: bbvitalsandreadings.prc
 * - DTO:
 */
const convertVitalsPulseOx = recordList => {
  if (!Array.isArray(recordList)) return [];
  return recordList.map(record => ({
    date: formatDate(record.dateEntered), // 05/09/2017
    time: formatTime(record.timeEntered), // 23:59
    // readingDate: record.readingDate, // 1494388740000 - the timestamp of dateEntered + timeEntered
    oximeterReading: record.oximeterReading || NONE_ENTERED, // 65
    respiratoryRate: record.respiratoryRate || NONE_ENTERED, // 67
    supplementalOxygenDevice:
      mapValue(Const.VITALS_PULSE_OX_DEVICE, record.suppOxygenDevice) ||
      NONE_ENTERED, // FM, etc.
    oxygenSetting: record.oxygenSetting || NONE_ENTERED, // 3
    symptoms:
      mapValue(Const.VITALS_PULSE_OX_SYMPTOMS, record.symptoms) || NONE_ENTERED, // D, etc.
    otherSymptoms: record.otherSymptoms || NONE_ENTERED, // null, apparently a free-form string
    comments: record.comments || NONE_ENTERED,
  }));
};

/**
 * - Stored procedure: bbvitalsandreadings.prc
 * - DTO:
 */
const convertVitals = record => {
  // Good test user w/ MHV correlation ID 23889276
  return {
    bloodPressure: convertVitalsBloodPressure(record?.bloodPreassureReadings),
    bloodSugar: convertVitalsBloodSugar(record?.bloodSugarReadings),
    bodyTemperature: convertVitalsBodyTemp(record?.bodyTemperatureReadings),
    bodyWeight: convertVitalsBodyWeight(record?.bodyWeightReadings),
    cholesterol: convertVitalsCholesterol(record?.lipidReadings),
    heartRate: convertVitalsHeartRate(record?.heartRateReadings),
    inr: convertVitalsInr(record?.inrReadings),
    pain: convertVitalsPain(record?.painReadings),
    pulseOximetry: convertVitalsPulseOx(record?.pulseOximetryReadings),
  };
};

/**
 * - Stored procedure: bballergies.prc
 * - DTO:
 */
const convertAllergies = responseObject => {
  // Good test user w/ MHV correlation ID 15176497
  if (!responseObject?.pojoObject) return null;
  const recordList = responseObject.pojoObject;
  return recordList.map(record => ({
    allergyName: record.allergy || NONE_ENTERED,
    date: formatDate(record.eventDate), // 2020-11-10
    severity:
      mapValue(Const.ALLERGIES_SEVERITY, record.severity) || NONE_ENTERED, // S, etc.
    diagnosed:
      mapValue(Const.ALLERGIES_DIAGNOSED, record.diagnosed) || NONE_ENTERED, // Y, etc.
    reaction: record.reaction || NONE_ENTERED,
    comments: record.comments || NONE_ENTERED,
  }));
};

const getLivingOrDeceased = isLiving => {
  if (isLiving === true) {
    return 'Living';
  }
  if (isLiving === false) {
    return 'Deceased';
  }
  return null;
};

const getIssueList = record => {
  const issues = [];

  Const.FAMILY_HISTORY_ISSUES.forEach(mapping => {
    if (record[mapping.jsonField]) {
      issues.push(mapping.string);
    }
  });

  return issues.length > 0 ? issues.join(', ') : null;
};

/**
 * - Stored procedure: bbfamilyhealthhistory.prc
 * - DTO:
 */
const convertFamilyHealthHistory = responseObject => {
  // Good test user w/ MHV correlation ID 15176497
  if (!responseObject?.pojoObject) return null;
  const recordList = responseObject.pojoObject;
  return recordList.map(record => ({
    relationship: record.relationship || NONE_ENTERED,
    firstName: record.firstName || NONE_ENTERED,
    lastName: record.lastName || NONE_ENTERED,
    livingOrDeceased: getLivingOrDeceased(record.living) || NONE_ENTERED,
    healthIssues: getIssueList(record) || NONE_ENTERED,
    otherHealthIssues:
      record.otherHealthIssues && record.otherHealthIssues.length > 0
        ? record.otherHealthIssues
            .map(otherIssue => otherIssue.issue)
            .join(', ')
        : NONE_ENTERED,
    comments: record.comments || NONE_ENTERED,
  }));
};

/**
 * - Stored procedure: bbimmunizations.prc
 * - DTO:
 */
const convertVaccines = responseObject => {
  // Good test user w/ MHV correlation ID 15176497
  if (!responseObject?.pojoObject) return null;
  const recordList = responseObject.pojoObject;
  return recordList.map(record => ({
    vaccine:
      mapValue(Const.VACCINE_TYPE, record.vaccinationTypeCode) || NONE_ENTERED,
    other: record.otherVaccine || NONE_ENTERED,
    method:
      mapValue(Const.VACCINE_METHOD, record.vaccinationMethod) || NONE_ENTERED,
    dateReceived: formatDate(record.dateReceived) || NONE_ENTERED, // 2022-06-29
    reactions:
      record.reactions && record.reactions.length > 0
        ? record.reactions
            .map(reaction => mapValue(Const.VACCINE_REACTION, reaction))
            .join(', ')
        : NONE_ENTERED,
    comments: record.comments || NONE_ENTERED,
  }));
};

/**
 * - Stored procedure: bblabsandtests.prc
 * - DTO: TestEntryDTO.java
 */
const convertLabsAndTests = responseObject => {
  if (!responseObject?.pojoObject) return null;
  const recordList = responseObject.pojoObject;
  return recordList.map(record => ({
    testName: record.testName || NONE_ENTERED,
    date: formatDate(record.eventDate) || NONE_ENTERED, // 2019-12-03T23:59:00
    locationPerformed: record.locationPerformed || NONE_ENTERED,
    provider: record.provider || NONE_ENTERED,
    results: record.results || NONE_ENTERED,
    comments: record.comments || NONE_ENTERED,
  }));
};

/**
 * - Stored procedure: bbmedicalevents.prc
 * - DTO: MedicalEventDTO.java
 */
const convertMedicalEvents = responseObject => {
  if (!responseObject?.pojoObject) return null;
  const recordList = responseObject.pojoObject;
  return recordList.map(record => ({
    medicalEvent: record.medicalEvent || NONE_ENTERED,
    startDate: formatDate(record.startDate) || NONE_ENTERED, // 2020-04-14T23:59:00
    stopDate: formatDate(record.stopDate) || NONE_ENTERED, // 2020-04-29T23:59:00
    response: record.response || NONE_ENTERED,
    comments: record.comments || NONE_ENTERED,
  }));
};

/**
 * - Stored procedure: bbmilitaryhealthhistory.prc
 * - DTO: MilitaryHistoryDTO.java
 */
const convertMilitaryHistory = responseObject => {
  if (!responseObject?.pojoObject) return null;
  const recordList = responseObject.pojoObject;
  return recordList.map(record => ({
    eventTitle: record.eventTitle || NONE_ENTERED,
    eventDate: formatDate(record.eventDate) || NONE_ENTERED, // 2020-11-10
    serviceBranch:
      mapValue(Const.MILITARY_HISTORY_BRANCH, record.serviceBranch) ||
      NONE_ENTERED,
    rank: record.rank || NONE_ENTERED,
    exposuresExist: record.exposures ? 'Yes' : 'No',
    locationOfService:
      mapValue(Const.MILITARY_HISTORY_LOCATION, record.serviceLocation) ||
      NONE_ENTERED,
    militaryOccupationalSpecialty: record.occupationSpecialty || NONE_ENTERED,
    assignment: record.serviceAssignment || NONE_ENTERED,
    exposures: record.exposures || NONE_ENTERED,
    militaryServiceExperience: record.experience || NONE_ENTERED,
  }));
};

/**
 * - Stored procedure: bbhealthcareproviders.prc
 * - DTO: mhv-np-getcare-api/.../HealthCareProviderDTO.java
 */
const convertHealthcareProviders = recordList => {
  if (!recordList) return null;
  return recordList.map(record => ({
    providerName: `${record.firstName || ''} ${record.lastName || ''}`,
    typeOfProvider:
      mapValue(Const.HEALTHCARE_PROVIDER_TYPE, record.providerType) ||
      NONE_ENTERED,
    otherClinicianInformation: record.otherClinician || NONE_ENTERED,
    phoneNumber: record.workPhone
      ? `${record.workPhone || ''} Ext: ${record.workPhoneExt || ''}`
      : NONE_ENTERED,
    email: record.emailAddress || NONE_ENTERED,
    comments: record.comments || NONE_ENTERED,
  }));
};

const getPrimaryInsurance = primaryInd => {
  if (primaryInd === true) {
    return 'Yes';
  }
  if (primaryInd === false) {
    return 'No';
  }
  return null;
};

/**
 * - Stored procedure: bbhealthinsurance.prc
 * - DTO: mhv-np-getcare-api/.../HealthInsuranceDTO.java
 */
const convertHealthInsurance = recordList => {
  if (!recordList) return null;
  return recordList.map(record => ({
    healthInsuranceCompany: record.companyName || NONE_ENTERED,
    primaryInsuranceProvider:
      getPrimaryInsurance(record.primaryInd) || NONE_ENTERED,
    idNumber: record.insuranceIdNumber || NONE_ENTERED,
    groupNumber: record.groupNumber || NONE_ENTERED,
    insured: `${record.firstNameOfInsured || ''} ${record.lastNameOfInsured ||
      ''}`,
    startDate: formatTimestamp(record.startDate) || NONE_ENTERED,
    stopDate: formatTimestamp(record.stopDate) || NONE_ENTERED,
    preApprovalPhoneNumber: record.preApprovalPhone || NONE_ENTERED,
    healthInsCoPhoneNumber: record.companyPhone || NONE_ENTERED,
    comments: record.comments || NONE_ENTERED,
  }));
};

const getVaHomeFacility = vaHomeFacility => {
  if (vaHomeFacility === true) {
    return 'Yes';
  }
  if (vaHomeFacility === false) {
    return 'No';
  }
  return null;
};

/**
 * - Stored procedure: bbtreatmentfacilities.prc
 * - DTO: mhv-np-getcare-api/.../TreatmentFacilityDTO.java
 */
const convertTreatmentFacilities = recordList => {
  if (!recordList) return null;
  return recordList.map(record => ({
    facilityName: record.facilityName || NONE_ENTERED,
    facilityType:
      mapValue(Const.TREATMENT_FACILITY_TYPE, record.facilityType) ||
      NONE_ENTERED,
    vaHomeFacility: getVaHomeFacility(record.homeFacility) || NONE_ENTERED,
    phoneNumber: record.contactInfoWorkPhone
      ? `${record.contactInfoWorkPhone ||
          ''} Ext: ${record.contactInfoWorkPhoneExt || ''}`
      : NONE_ENTERED,
    faxNumber: record.contactInfoFax || NONE_ENTERED,
    mailingAddress:
      [
        record.addressStreet1,
        record.addressStreet2,
        record.addressCity,
        record.addressState,
        record.addressProvince,
        record.addressCountry,
        record.addressPostalCode,
      ]
        .filter(Boolean)
        .join(', ') || NONE_ENTERED,
    comments: record.comments || NONE_ENTERED,
  }));
};

const formatDayOfWeek = dateStr => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const options = { weekday: 'long' };
  return date.toLocaleDateString('en-US', options);
};

/**
 * - Stored procedure: bbfoodjournal.prc
 * - DTO: mhv-np-journal-api/.../MealItemDTO.java
 */
const convertFoodJournalMealItem = record => {
  return {
    item: record.item || NONE_ENTERED,
    quantity: record.quantity || NONE_ENTERED,
    servingSize: record.servingSize || NONE_ENTERED,
    methodOfPreparation: record.prepMethod || NONE_ENTERED,
  };
};

const convertFoodJournalMealItemList = list => {
  return Array.isArray(list)
    ? list.map(mealRecord => convertFoodJournalMealItem(mealRecord))
    : [];
};

/**
 * - Stored procedure: bbfoodjournal.prc
 * - DTO: mhv-np-journal-api/.../FoodJournalDTO.java
 */
const convertFoodJournal = recordList => {
  if (!recordList) return null;
  return recordList.map(record => ({
    date: formatDate(record.dispJournalDate) || NONE_ENTERED, // 09/14/2021
    dayOfWeek: formatDayOfWeek(record.dispJournalDate) || NONE_ENTERED,
    waterConsumed: record.glassesOfWater || 0,
    breakfastItems: convertFoodJournalMealItemList(record.breakFastMealItems),
    lunchItems: convertFoodJournalMealItemList(record.lunchMealItems),
    dinnerItems: convertFoodJournalMealItemList(record.dinnerMealItems),
    snackItems: convertFoodJournalMealItemList(record.snackMealItems),
    comments: record.comments || NONE_ENTERED,
  }));
};

/**
 * - Stored procedure: bbactivityjournal.prc
 * - DTO: mhv-np-journal-api/.../ActivityDetailDTO.java
 */
const convertActivityJournalActivity = record => {
  return {
    activity: record.description || NONE_ENTERED,
    type:
      mapValue(Const.ACTIVITY_JOURNAL_TYPE, record.quantity) || NONE_ENTERED,
    distanceDuration: record.distanceDuration || NONE_ENTERED,
    measure: record.dispMeasure || NONE_ENTERED,
    intensity: record.dispIntensity || NONE_ENTERED,
    numberOfSets: record.setCount || NONE_ENTERED,
    numberOfReps: record.repCount || NONE_ENTERED,
    timeOfDay: record.dispTimeOfDay || NONE_ENTERED,
  };
};

/**
 * - Stored procedure: bbactivityjournal.prc
 * - DTO: mhv-np-journal-api/.../ActivityJournalDTO.java
 */
const convertActivityJournal = recordList => {
  if (!recordList) return null;
  return recordList.map(record => ({
    date: formatDate(record.dispJournalDate) || NONE_ENTERED, // 07/24/2020
    dayOfWeek: formatDayOfWeek(record.dispJournalDate) || NONE_ENTERED,
    comments: record.comments || NONE_ENTERED,
    activities: Array.isArray(record.activityDetails)
      ? record.activityDetails.map(activity =>
          convertActivityJournalActivity(activity),
        )
      : [],
  }));
};

/**
 * - Stored procedure: bbmedications.prc
 * - DTO: mhv-np-rxrefill-api/.../MedicationHistoryDTO.java
 */
const convertMedications = recordList => {
  if (!recordList) return null;
  return recordList.map(record => ({
    category: record.dispCategory || NONE_ENTERED,
    drugName: record.medicationName || NONE_ENTERED,
    prescriptionNumber: record.prescriptionNumber || NONE_ENTERED,
    strength: record.strength || NONE_ENTERED,
    dose: record.dosage || NONE_ENTERED,
    frequency: record.frequency || NONE_ENTERED,
    startDate: formatDate(record.dispStartDate) || NONE_ENTERED, // 09/14/2021
    stopDate: formatDate(record.dispEndDate) || NONE_ENTERED, // 09/29/2021
    pharmacyName: record.pharmacyName || NONE_ENTERED,
    pharmacyPhone: record.pharmacyPhone || NONE_ENTERED,
    reasonForTaking: record.reason || NONE_ENTERED,
    comments: record.comments || NONE_ENTERED,
  }));
};

export const selfEnteredReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SelfEntered.GET_VITALS: {
      return {
        ...state,
        vitals: convertVitals(action.payload),
      };
    }
    case Actions.SelfEntered.GET_ALLERGIES: {
      return {
        ...state,
        allergies: convertAllergies(action.payload),
      };
    }
    case Actions.SelfEntered.GET_FAMILY_HISTORY: {
      return {
        ...state,
        familyHistory: convertFamilyHealthHistory(action.payload),
      };
    }
    case Actions.SelfEntered.GET_VACCINES: {
      return {
        ...state,
        vaccines: convertVaccines(action.payload),
      };
    }
    case Actions.SelfEntered.GET_TEST_ENTRIES: {
      return {
        ...state,
        testEntries: convertLabsAndTests(action.payload),
      };
    }
    case Actions.SelfEntered.GET_MEDICAL_EVENTS: {
      return {
        ...state,
        medicalEvents: convertMedicalEvents(action.payload),
      };
    }
    case Actions.SelfEntered.GET_MILITARY_HISTORY: {
      return {
        ...state,
        militaryHistory: convertMilitaryHistory(action.payload),
      };
    }
    case Actions.SelfEntered.GET_PROVIDERS: {
      return {
        ...state,
        providers: convertHealthcareProviders(action.payload),
      };
    }
    case Actions.SelfEntered.GET_HEALTH_INSURANCE: {
      return {
        ...state,
        healthInsurance: convertHealthInsurance(action.payload),
      };
    }
    case Actions.SelfEntered.GET_TREATMENT_FACILITIES: {
      return {
        ...state,
        treatmentFacilities: convertTreatmentFacilities(action.payload),
      };
    }
    case Actions.SelfEntered.GET_FOOD_JOURNAL: {
      return {
        ...state,
        foodJournal: convertFoodJournal(action.payload),
      };
    }
    case Actions.SelfEntered.GET_ACTIVITY_JOURNAL: {
      return {
        ...state,
        activityJournal: convertActivityJournal(action.payload),
      };
    }
    case Actions.SelfEntered.GET_MEDICATIONS: {
      return {
        ...state,
        medications: convertMedications(action.payload),
      };
    }
    default:
      return state;
  }
};
