import { Actions } from '../util/actionTypes';

const initialState = {
  list: [],
};

export const breadcrumbsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Breadcrumbs.SET_BREAD_CRUMBS: {
      const newCrumbList = [...state.list];
      newCrumbList.push(action.payload.crumbs);
      return {
        list: newCrumbList,
        crumbBackFocus: false,
      };
    }
    case Actions.Breadcrumbs.REMOVE_BREAD_CRUMB: {
      const newCrumbList = [...state.list];
      newCrumbList.pop();
      return {
        list: newCrumbList,
        crumbBackFocus: true,
      };
    }
    default:
      return state;
  }
};
