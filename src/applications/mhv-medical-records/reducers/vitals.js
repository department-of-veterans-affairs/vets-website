import { Actions } from '../util/actionTypes';
import {
  loincCodes,
  vitalTypes,
  EMPTY_FIELD,
  vitalUnitCodes,
  vitalUnitDisplayText,
  loadStates,
  allowedVitalLoincs,
  loincToVitalType,
} from '../util/constants';
import {
  isArrayAndHasItems,
  macroCase,
  extractContainedResource,
  dateFormatWithoutTimezone,
  formatDateTimeInUserTimezone,
} from '../util/helpers';

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
    // Guard against missing component array (malformed FHIR data)
    if (!isArrayAndHasItems(record.component)) {
      return EMPTY_FIELD;
    }

    const systolic = record.component.find(item =>
      item?.code?.coding?.some(coding => coding.code === loincCodes.SYSTOLIC),
    );
    const diastolic = record.component.find(item =>
      item?.code?.coding?.some(coding => coding.code === loincCodes.DIASTOLIC),
    );

    // Ensure both components exist and have valid values before formatting
    if (!systolic?.valueQuantity?.value || !diastolic?.valueQuantity?.value) {
      return EMPTY_FIELD;
    }

    return `${systolic.valueQuantity.value}/${diastolic.valueQuantity.value}`;
  }

  if (
    vitalTypes.HEIGHT.includes(type) &&
    record.valueQuantity?.code === '[in_i]'
  ) {
    const feet = Math.floor(record.valueQuantity?.value / 12);
    const inches = record.valueQuantity?.value % 12;
    return `${feet}${vitalUnitDisplayText.HEIGHT_FT}, ${inches}${
      vitalUnitDisplayText.HEIGHT_IN
    }`;
  }

  if (record.valueQuantity) {
    const unit = getUnit(type, record.valueQuantity?.code);
    // Removed legacy formatting that inserted a space before % for pulse oximetry
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
  // Determine canonical vital type via any mapped LOINC present in code.coding
  let type;
  if (isArrayAndHasItems(record.code?.coding)) {
    for (const coding of record.code.coding) {
      if (loincToVitalType[coding.code]) {
        type = loincToVitalType[coding.code];
        break;
      }
    }
  }
  // Fallback: derive from text (legacy) else mark as OTHER
  // TODO: Add logging when things are coded as OTHER so we know what is regularly getting excluded and can track
  if (!type) {
    const derived = macroCase(record.code?.text);
    type = loincToVitalType[derived] || derived || 'OTHER';
  }
  return {
    name:
      record.code?.text ||
      (isArrayAndHasItems(record.code?.coding) &&
        record.code?.coding[0]?.display),
    type,
    id: record.id,
    measurement: getMeasurement(record, type) || EMPTY_FIELD,
    date: record?.effectiveDateTime
      ? dateFormatWithoutTimezone(record.effectiveDateTime)
      : EMPTY_FIELD,
    effectiveDateTime: record?.effectiveDateTime,
    location: extractLocation(record),
    // TODO: This should be changed to accommodate multiple notes
    notes:
      (isArrayAndHasItems(record.note) && record.note[0]?.text) || EMPTY_FIELD,
  };
};

export const convertUnifiedVital = record => {
  // TODO: move this fallback method also into the Vitals parser in the BE
  // Fallback: derive from text (legacy) else mark as OTHER
  // if (!type) {
  //   const derived = macroCase(record.code?.text);
  //   type = loincToVitalType[derived] || derived || 'OTHER';
  // }
  return {
    name: record.attributes.name,
    type: record.attributes.type,
    id: record.id,
    measurement: record.attributes.measurement || EMPTY_FIELD,
    date: record.attributes.date
      ? formatDateTimeInUserTimezone(record.attributes.date)
      : EMPTY_FIELD,
    effectiveDateTime: record?.attributes.date,
    location: record.attributes.location || EMPTY_FIELD,
    // TODO: This should be changed to accommodate multiple notes
    notes:
      (isArrayAndHasItems(record.attributes.notes) &&
        record.attributes.notes[0]) ||
      EMPTY_FIELD,
  };
};

export const vitalReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Vitals.GET: {
      const list = Array.isArray(state.vitalsList) ? state.vitalsList : [];
      return {
        ...state,
        vitalDetails: list.filter(vital => vital.type === action.vitalType),
      };
    }
    case Actions.Vitals.GET_LIST: {
      const oldList = state.vitalsList;
      const newList =
        action?.response?.entry
          ?.filter(entry =>
            entry.resource?.code?.coding?.some(coding =>
              allowedVitalLoincs.includes(coding.code),
            ),
          )
          .map(vital => {
            return convertVital(vital.resource);
          }) || [];

      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        vitalsList: typeof oldList === 'undefined' ? newList : oldList,
        updatedList: typeof oldList !== 'undefined' ? newList : undefined,
      };
    }
    case Actions.Vitals.GET_UNIFIED_LIST: {
      const oldList = state.vitalsList;
      const newList =
        action.response.data
          ?.map(vital => {
            return convertUnifiedVital(vital);
          }) // Sort newest first using raw ISO timestamp; invalid/missing dates last
          .sort((a, b) => {
            const at = Date.parse(a.effectiveDateTime);
            const bt = Date.parse(b.effectiveDateTime);
            const ak = Number.isFinite(at) ? at : -Infinity;
            const bk = Number.isFinite(bt) ? bt : -Infinity;
            if (bk !== ak) return bk - ak;
            // Optional stable tie-breaker by id to keep order deterministic
            return String(a.id).localeCompare(String(b.id));
          }) || [];

      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        vitalsList: typeof oldList === 'undefined' ? newList : oldList,
        updatedList: typeof oldList !== 'undefined' ? newList : undefined,
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
