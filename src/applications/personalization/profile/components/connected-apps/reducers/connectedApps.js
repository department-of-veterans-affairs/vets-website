import {
  LOADING_CONNECTED_APPS,
  FINISHED_LOADING_CONNECTED_APPS,
  ERROR_LOADING_CONNECTED_APPS,
  DELETING_CONNECTED_APP,
  ERROR_DELETING_CONNECTED_APP,
  FINISHED_DELETING_CONNECTED_APP,
  DELETED_APP_ALERT_DISMISSED,
} from '../actions';

const initialState = {
  apps: [],
  errors: [],
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING_CONNECTED_APPS:
      return { ...state, loading: true };

    case FINISHED_LOADING_CONNECTED_APPS:
      return { ...state, apps: action.data, loading: false, errors: [] };

    case ERROR_LOADING_CONNECTED_APPS:
      return { ...state, loading: false, errors: action.errors };

    case DELETING_CONNECTED_APP: {
      const apps = state.apps.map(app => {
        if (app.id === action.appId) {
          return { ...app, deleting: true };
        }
        return app;
      });
      return { ...state, apps, errors: [] };
    }

    case ERROR_DELETING_CONNECTED_APP: {
      const apps = state.apps.map(app => {
        if (app.id === action.appId) {
          return { ...app, deleting: false, errors: action.errors };
        }
        return app;
      });
      return { ...state, apps };
    }

    case FINISHED_DELETING_CONNECTED_APP: {
      const apps = state.apps.map(app => {
        if (app.id === action.appId) {
          return { ...app, deleting: false, deleted: true };
        }
        return app;
      });
      return { ...state, apps };
    }

    case DELETED_APP_ALERT_DISMISSED: {
      const apps = state.apps.filter(app => app.id !== action.appId);
      return { ...state, apps };
    }

    default:
      return state;
  }
};
