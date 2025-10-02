import { Actions } from '../util/actionTypes';
import {
  loincCodes,
  vitalTypes,
  EMPTY_FIELD,
  vitalUnitCodes,
  vitalUnitDisplayText,
  loadStates,
  allowedVitalLoincs,
} from '../util/constants';
import {
  isArrayAndHasItems,
  macroCase,
  extractContainedResource,
  dateFormatWithoutTimezone,
} from '../util/helpers';

// Normalization map for noisy or source-specific vital type variants.
// Extend this map as new variants are discovered so the rest of the app can
// rely on canonical keys (matching keys used in vitalTypes & display maps).
const VITAL_TYPE_NORMALIZATION_MAP = {
  HEART_RATE: 'PULSE', // normalize HEART_RATE to PULSE (UI groups them together)
  RESPIRATORY_RATE: 'RESPIRATION',
  OXYGEN_SATURATION_IN_ARTERIAL_BLOOD: 'PULSE_OXIMETRY',
  BODY_TEMPERATURE: 'TEMPERATURE',
  BODY_WEIGHT: 'WEIGHT',
  BODY_HEIGHT: 'HEIGHT',
  // Common SPO2 textual variants (after macroCase) mapped to PULSE_OXIMETRY
  SP_O2: 'PULSE_OXIMETRY',
  SP_O_2: 'PULSE_OXIMETRY',
  SP0_2: 'PULSE_OXIMETRY',
  SPO2: 'PULSE_OXIMETRY',
  SPO_2: 'PULSE_OXIMETRY',
  // Weight measured variant
  WEIGHT_MEASURED: 'WEIGHT',
};

// Pattern normalization for any unforeseen SpO2 style variants produced by macroCase.
const isSpo2Like = type =>
  /^SP[O0]_?O?\d$/i.test(type) || /^SPO?0?2$/i.test(type);

const normalizeVitalType = rawType => {
  if (!rawType) return rawType;
  if (VITAL_TYPE_NORMALIZATION_MAP[rawType]) {
    return VITAL_TYPE_NORMALIZATION_MAP[rawType];
  }
  // Flexible catch for SpO2 like strings not explicitly mapped
  if (isSpo2Like(rawType)) return 'PULSE_OXIMETRY';
  return rawType;
};

// Helper to flag whether a normalized type is one of the canonical vitals we explicitly surface
const isKnownCanonicalVital = type => {
  return [
    'BLOOD_PRESSURE',
    'PULSE',
    'RESPIRATION',
    'PULSE_OXIMETRY',
    'TEMPERATURE',
    'WEIGHT',
    'HEIGHT',
  ].includes(type);
};

const initialState = {
  /**
   * The last time that the list was fetched and known to be up-to-date
   * @type {Date}
   */
  listCurrentAsOf: undefined,
  /**
   * PRE_FETCH, FETCHING, FETCHED
   */
  listState: loadStates.PRE_FETCH,

  /**
   * The list of vitals returned from the api
   * @type {Array}
   */
  vitalsList: undefined,
  /**
   * New list of records retrieved. This list is NOT displayed. It must manually be copied into the display list.
   * @type {Array}
   */
  updatedList: undefined,
  /**
   * The vital currently being displayed to the user
   */
  vitalDetails: undefined,
};

const getUnit = (type, unit) => {
  if (vitalUnitCodes[type] === unit) return vitalUnitDisplayText[type];
  return ` ${unit}`;
};

export const getMeasurement = (record, type) => {
  if (vitalTypes.BLOOD_PRESSURE.includes(type)) {
    const systolic = record.component.find(item =>
      item.code.coding.some(coding => coding.code === loincCodes.SYSTOLIC),
    );
    const diastolic = record.component.find(item =>
      item.code.coding.some(coding => coding.code === loincCodes.DIASTOLIC),
    );
    return `${systolic.valueQuantity.value}/${diastolic.valueQuantity.value}`;
  }

  if (
    vitalTypes.HEIGHT.includes(type) &&
    record.valueQuantity?.code === '[in_i]'
  ) {
    const feet = Math.floor(record.valueQuantity.value / 12);
    const inches = record.valueQuantity.value % 12;
    return `${feet}${vitalUnitDisplayText.HEIGHT_FT}, ${inches}${
      vitalUnitDisplayText.HEIGHT_IN
    }`;
  }

  if (record.valueQuantity) {
    const unit = getUnit(type, record.valueQuantity?.code);
    return `${record.valueQuantity?.value}${unit}`;
  }

  return record.valueString || EMPTY_FIELD;
};

export const extractLocation = vital => {
  if (isArrayAndHasItems(vital.performer)) {
    const firstPerformer = vital.performer[0];

    if (isArrayAndHasItems(firstPerformer?.extension)) {
      const refId = firstPerformer.extension[0]?.valueReference?.reference;
      const location = extractContainedResource(vital, refId);
      return location?.name || EMPTY_FIELD;
    }

    // Look for Organization references (to handle Lighthouse data)
    const organizations = vital.performer.filter(performer =>
      performer?.reference?.includes('/Organization/'),
    );

    if (organizations.length) {
      return organizations.map(org => org?.display).join(', ');
    }
  }

  return EMPTY_FIELD;
};

export const convertVital = record => {
  const rawType = macroCase(record.code?.text);
  const type = normalizeVitalType(rawType);
  return {
    name:
      record.code?.text ||
      (isArrayAndHasItems(record.code?.coding) &&
        record.code?.coding[0]?.display),
    originalType: rawType,
    type,
    id: record.id,
    measurement: getMeasurement(record, type) || EMPTY_FIELD,
    date: record?.effectiveDateTime
      ? dateFormatWithoutTimezone(record.effectiveDateTime)
      : EMPTY_FIELD,
    effectiveDateTime: record?.effectiveDateTime,
    location: extractLocation(record),
    notes:
      (isArrayAndHasItems(record.note) && record.note[0]?.text) || EMPTY_FIELD,
  };
};

export const vitalReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Vitals.GET: {
      return {
        ...state,
        vitalDetails: state.vitalsList.filter(
          vital => vital.type === action.vitalType,
        ),
      };
    }
    case Actions.Vitals.GET_LIST: {
      const oldList = state.vitalsList;
      const newList =
        action.response.entry
          ?.filter(entry =>
            entry.resource.code.coding.some(coding =>
              allowedVitalLoincs.includes(coding.code),
            ),
          )
          .map(vital => {
            return convertVital(vital.resource);
          }) || [];

      // Partition into known canonical vs unknown
      const knownCanonicals = [];
      const unknownVitals = [];
      newList.forEach(item => {
        // Treat items whose normalized type is canonical AND whose name maps cleanly to a known display name (excluding OTHER) as known
        if (isKnownCanonicalVital(item.type) && item.type !== 'OTHER')
          knownCanonicals.push(item);
        else unknownVitals.push(item);
      });

      let finalList = knownCanonicals;
      if (unknownVitals.length) {
        // Determine most recent unknown vital for measurement/date display
        const mostRecent = unknownVitals.reduce((acc, cur) => {
          if (!acc) return cur;
          return new Date(cur.effectiveDateTime) >
            new Date(acc.effectiveDateTime)
            ? cur
            : acc;
        }, null);
        finalList = [
          ...knownCanonicals,
          {
            ...mostRecent,
            type: 'OTHER',
            _otherItems: unknownVitals,
          },
        ];
      }

      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        vitalsList: typeof oldList === 'undefined' ? finalList : oldList,
        updatedList: typeof oldList !== 'undefined' ? finalList : undefined,
      };
    }
    case Actions.Vitals.COPY_UPDATED_LIST: {
      const originalList = state.vitalsList;
      const { updatedList } = state;
      if (
        Array.isArray(originalList) &&
        Array.isArray(updatedList) &&
        // FIXME: the updated list could be the same length as the original list but have different contents.
        originalList.length !== updatedList.length
      ) {
        return {
          ...state,
          vitalsList: state.updatedList,
          updatedList: undefined,
        };
      }
      return {
        ...state,
      };
    }
    case Actions.Vitals.CLEAR_DETAIL: {
      return {
        ...state,
        vitalDetails: undefined,
      };
    }
    case Actions.Vitals.UPDATE_LIST_STATE: {
      return {
        ...state,
        listState: action.payload,
      };
    }
    default:
      return state;
  }
};
