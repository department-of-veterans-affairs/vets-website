import _ from 'lodash';
import {
  ADD_COMPARE_INSTITUTION,
  FETCH_COMPARE_FAILED,
  REMOVE_COMPARE_INSTITUTION,
  UPDATE_COMPARE_DETAILS,
  UPDATE_QUERY_PARAMS,
  COMPARE_DRAWER_OPENED,
} from '../actions';

const INITIAL_STATE = Object.freeze({
  search: {
    loaded: [],
    institutions: {},
  },
  details: {
    loaded: [],
    institutions: {},
  },
  selected: [],
  error: null,
  open: false,
});

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD_COMPARE_INSTITUTION:
      if (state.selected.length < 3) {
        return {
          ...state,
          search: {
            loaded: [...state.search.loaded, action.payload.facilityCode],
            institutions: {
              ...state.search.institutions,
              [action.payload.facilityCode]: action.payload,
            },
          },
          selected: [...state.selected, action.payload.facilityCode],
        };
      }
      break;

    case REMOVE_COMPARE_INSTITUTION:
      return {
        ...state,
        search: {
          loaded: state.search.loaded.filter(
            facilityCode => facilityCode !== action.payload,
          ),
          institutions: {
            ..._.omit(state.search.institutions, action.payload),
          },
        },
        details: {
          loaded: state.details.loaded.filter(
            facilityCode => facilityCode !== action.payload,
          ),
          institutions: {
            ..._.omit(state.details.institutions, action.payload),
          },
        },
        selected: state.selected.filter(
          facilityCode => facilityCode !== action.payload,
        ),
      };
    case UPDATE_COMPARE_DETAILS:
      return {
        ...state,
        error: null,
        search: {
          loaded: action.payload.map(result => result.attributes.facilityCode),
          institutions: {
            ...action.payload.reduce(
              (map, result) => ({
                ...map,
                [result.attributes.facilityCode]: {
                  name: result.attributes.name,
                },
              }),
              {},
            ),
          },
        },
        details: {
          loaded: action.payload.map(result => result.attributes.facilityCode),
          institutions: {
            ...action.payload.reduce(
              (map, result) => ({
                ...map,
                [result.attributes.facilityCode]: {
                  ...result.attributes,
                  // story #24874 mock data
                  feesAndTuition: Math.floor(Math.random() * 10000) + 10000,
                },
              }),
              {},
            ),
          },
        },
      };

    case UPDATE_QUERY_PARAMS:
      if (action.payload.facilities) {
        return {
          ...state,
          selected: action.payload.facilities.split(','),
        };
      }
      break;

    case FETCH_COMPARE_FAILED:
      return {
        ...state,
        error: action.payload,
      };

    case COMPARE_DRAWER_OPENED:
      return {
        ...state,
        open: action.payload,
      };

    default:
      return state;
  }
  return state;
}
