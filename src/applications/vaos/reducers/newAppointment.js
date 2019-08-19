import { updateSchemaAndData } from 'platform/forms-system/src/js/state/helpers';
import { FORM_DATA_UPDATED, FORM_PAGE_OPENED } from '../actions/newAppointment';

const initialState = {
  pages: {},
  data: {},
};

export default function formReducer(state = initialState, action) {
  switch (action.type) {
    case FORM_PAGE_OPENED: {
      const { data, schema } = updateSchemaAndData(
        action.schema,
        action.uiSchema,
        state.data,
      );

      return {
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
        data,
        pages: {
          ...state.pages,
          [action.page]: schema,
        },
      };
    }
    default:
      return state;
  }
}
