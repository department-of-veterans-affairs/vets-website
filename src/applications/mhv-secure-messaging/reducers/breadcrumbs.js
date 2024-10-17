import { Actions } from '../util/actionTypes';
import { Breadcrumbs, Paths } from '../util/constants';

const defaultCrumbsList = [
  {
    href: '/',
    label: 'VA.gov',
  },
  {
    href: Breadcrumbs.MYHEALTH.href,
    label: Breadcrumbs.MYHEALTH.label,
  },
  {
    href: Breadcrumbs.MESSAGES.href,
    label: Breadcrumbs.MESSAGES.label,
    isRouterLink: true,
  },
];

const initialState = {
  list: {},
  crumbsList: defaultCrumbsList,
  previousUrl: Paths.INBOX,
};

export const breadcrumbsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Breadcrumbs.SET_BREAD_CRUMBS:
      if (action.payload.crumbs[0] === undefined) {
        return {
          ...state,
          list: Breadcrumbs.MESSAGES,
          crumbsList: defaultCrumbsList,
        };
      }
      return {
        ...state,
        list: action.payload.crumbs[0],
        crumbsList: [...defaultCrumbsList, ...action.payload.crumbs],
      };
    case Actions.Breadcrumbs.SET_PREVIOUS_URL:
      return {
        ...state,
        previousUrl: action.payload,
      };
    default:
      return state;
  }
};
