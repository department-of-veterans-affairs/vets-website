import moment from 'moment';
import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import {
  updateSchemaAndData,
  updateItemsSchema,
} from 'platform/forms-system/src/js/state/helpers';

import { stripDST } from '../utils/timezone';

import {
  FORM_PAGE_OPENED,
  FORM_DATA_UPDATED,
  FORM_SUBMIT,
  FORM_SUBMIT_FAILED,
  FORM_SUBMIT_SUCCEEDED,
  FETCH_EXPRESS_CARE_WINDOWS,
  FETCH_EXPRESS_CARE_WINDOWS_FAILED,
  FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
} from '../actions/expressCare';

import { FETCH_STATUS } from '../utils/constants';

const initialState = {
  windowsStatus: FETCH_STATUS.notStarted,
  windows: null,
  localWindowString: null,
  minStart: null,
  maxEnd: null,
  data: {
    email: 'test@va.gov',
    phoneNumber: '5555555555',
    reasonForVisit: 'cough',
    additionalInformation: 'Whatever',
  },
  submitStatus: FETCH_STATUS.notStarted,
  successfulRequest: null,
};

function setupFormData(data, schema, uiSchema) {
  const schemaWithItemsCorrected = updateItemsSchema(schema);
  return updateSchemaAndData(
    schemaWithItemsCorrected,
    uiSchema,
    getDefaultFormState(schemaWithItemsCorrected, data, {}),
  );
}

export default function expressCareReducer(state = initialState, action) {
  switch (action.type) {
    case FORM_PAGE_OPENED: {
      const { data, schema } = setupFormData(
        state.data,
        action.schema,
        action.uiSchema,
      );

      return {
        ...state,
        data,
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
      };
    }
    case FORM_DATA_UPDATED: {
      const { data, schema } = updateSchemaAndData(
        state.pages[action.page],
        action.uiSchema,
        action.data,
      );

      return {
        ...state,
        data,
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
      };
    }
    case FETCH_EXPRESS_CARE_WINDOWS:
      return {
        ...state,
        windowsStatus: FETCH_STATUS.loading,
      };
    case FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED: {
      const { facilityData, nowUtc } = action;
      const windows = []
        .concat(...facilityData)
        .filter(f => !!f.expressTimes)
        .map(({ expressTimes, authoritativeName, rootStationCode, id }) => {
          const { start, end, offsetUtc, timezone } = expressTimes;
          const today = nowUtc.format('YYYY-MM-DD');
          const startString = `${today}T${start}${offsetUtc}`;
          const endString = `${today}T${end}${offsetUtc}`;

          return {
            utcStart: moment.utc(startString),
            utcEnd: moment.utc(endString),
            start: moment.parseZone(startString),
            end: moment.parseZone(endString),
            offset: offsetUtc,
            timeZone: stripDST(timezone),
            authoritativeName,
            rootStationCode,
            id,
          };
        })
        .sort((a, b) => (a.utcStart.format() < b.utcStart.format() ? -1 : 1));

      let minStart;
      let maxEnd;

      if (windows.length) {
        const windowsReverseSorted = windows.sort(
          (a, b) => (a.utcEnd.format() > b.utcEnd.format() ? -1 : 1),
        );

        minStart = windows?.[0];
        maxEnd = windowsReverseSorted?.[0];
      }

      return {
        ...state,
        windowsStatus: FETCH_STATUS.succeeded,
        minStart,
        maxEnd,
        windows,
        localWindowString:
          minStart && maxEnd
            ? `${minStart.start.format('h:mm a')} to ${maxEnd.end.format(
                'h:mm a',
              )} ${minStart.timeZone}`
            : null,
      };
    }
    case FETCH_EXPRESS_CARE_WINDOWS_FAILED:
      return {
        ...state,
        windowsStatus: FETCH_STATUS.failed,
      };
    case FORM_SUBMIT:
      return {
        ...state,
        submitStatus: FETCH_STATUS.loading,
      };
    case FORM_SUBMIT_SUCCEEDED:
      return {
        ...state,
        submitStatus: FETCH_STATUS.succeeded,
        successfulRequest: action.responseData,
      };
    case FORM_SUBMIT_FAILED:
      return {
        ...state,
        submitStatus: FETCH_STATUS.failed,
      };
    default:
      return state;
  }
}
