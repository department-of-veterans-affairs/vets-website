import { Actions } from '../util/actionTypes';
import { Breadcrumbs } from '../util/constants';

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
  location: '',
  crumbsList: defaultCrumbsList,
};

export const breadcrumbsReducer = (state = initialState, action) => {
  if (action.type === Actions.Breadcrumbs.SET_BREAD_CRUMBS) {
    if (action.payload.crumbs[0] === undefined) {
      return {
        list: Breadcrumbs.MESSAGES,
        location: action.payload.location,
        crumbsList: defaultCrumbsList,
      };
    }
    return {
      list: action.payload.crumbs[0],
      location: action.payload.location,
      crumbsList: [...defaultCrumbsList, ...action.payload.crumbs],
    };
  }
  return state;
};
