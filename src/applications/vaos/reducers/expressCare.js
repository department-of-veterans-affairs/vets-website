import moment from 'moment';
import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import {
  updateSchemaAndData,
  updateItemsSchema,
} from 'platform/forms-system/src/js/state/helpers';

import {
  FORM_PAGE_OPENED,
  FORM_DATA_UPDATED,
  FETCH_EXPRESS_CARE_WINDOWS,
  FETCH_EXPRESS_CARE_WINDOWS_FAILED,
  FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
} from '../actions/expressCare';

import { FETCH_STATUS } from '../utils/constants';

const initialState = {
  windowsStatus: FETCH_STATUS.notStarted,
  allowRequests: false,
  localWindowString: null,
  minStart: null,
  maxEnd: null,
  newRequest: { data: {}, pages: {} },
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
      const newRequest = { ...state.newRequest };
      const { data, schema } = setupFormData(
        newRequest.data,
        action.schema,
        action.uiSchema,
      );

      return {
        ...state,
        newRequest: {
          ...newRequest,
          data,
          pages: {
            ...newRequest.pages,
            [action.page]: schema,
          },
        },
      };
    }
    case FORM_DATA_UPDATED: {
      const newRequest = { ...state.newRequest };
      const { data, schema } = updateSchemaAndData(
        newRequest.pages[action.page],
        action.uiSchema,
        action.data,
      );

      return {
        ...state,
        newRequest: {
          ...newRequest,
          data,
          pages: {
            ...newRequest.pages,
            [action.page]: schema,
          },
        },
      };
    }
    case FETCH_EXPRESS_CARE_WINDOWS:
      return {
        ...initialState,
        windowsStatus: FETCH_STATUS.loading,
      };
    case FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED: {
      const { facilityData, nowUtc } = action;
      const times = []
        .concat(...facilityData)
        .filter(f => !!f.expressTimes)
        .map(f => {
          const { expressTimes, authoritativeName, id } = f;
          const { start, end, offsetUtc, timezone } = expressTimes;
          const today = nowUtc.format('YYYY-MM-DD');
          const startString = `${today}T${start}${offsetUtc}`;
          const endString = `${today}T${end}${offsetUtc}`;

          return {
            utcStart: moment.utc(startString).format(),
            utcEnd: moment.utc(endString).format(),
            start: moment.parseZone(startString).format(),
            end: moment.parseZone(endString).format(),
            offset: offsetUtc,
            timeZone: timezone,
            name: f.authoritativeName,
            id,
          };
        })
        .sort((a, b) => (a.utcStart < b.utcStart ? -1 : 1));

      let minStart;
      let maxEnd;

      if (times.length) {
        const timesReverseSorted = times.sort(
          (a, b) => (a.utcEnd > b.utcEnd ? -1 : 1),
        );

        minStart = times?.[0];
        maxEnd = timesReverseSorted?.[0];
      }

      return {
        ...state,
        windowsStatus: FETCH_STATUS.succeeded,
        allowRequests:
          times.length && nowUtc.isBetween(minStart?.utcStart, maxEnd?.utcEnd),
        minStart,
        maxEnd,
        localWindowString:
          minStart && maxEnd
            ? `${moment
                .parseZone(minStart.start)
                .format('h:mm a')} to ${moment
                .parseZone(maxEnd.end)
                .format('h:mm a')} ${minStart.timeZone}`
            : null,
      };
    }
    case FETCH_EXPRESS_CARE_WINDOWS_FAILED:
      return {
        ...initialState,
        windowsStatus: FETCH_STATUS.failed,
      };

    default:
      return {
        ...state,
      };
  }
}
