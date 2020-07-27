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
  times: null,
  allowRequests: false,
  localWindowString: null,
  minStart: null,
  maxEnd: null,
  data: {},
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
            utcStart: moment.utc(startString),
            utcEnd: moment.utc(endString),
            start: moment.parseZone(startString),
            end: moment.parseZone(endString),
            offset: offsetUtc,
            timeZone: timezone,
            name: f.authoritativeName,
            rootStationCode: f.rootStationCode,
            id,
          };
        })
        .sort((a, b) => (a.utcStart.format() < b.utcStart.format() ? -1 : 1));

      let minStart;
      let maxEnd;

      if (times.length) {
        const timesReverseSorted = times.sort(
          (a, b) => (a.utcEnd.format() > b.utcEnd.format() ? -1 : 1),
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
        times,
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
        ...initialState,
        windowsStatus: FETCH_STATUS.failed,
      };

    default:
      return {
        ...state,
      };
  }
}
