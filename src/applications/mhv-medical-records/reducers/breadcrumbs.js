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
    href: Breadcrumbs.MR_LANDING_PAGE.href,
    label: Breadcrumbs.MR_LANDING_PAGE.label,
    isRouterLink: true,
  },
];

const initialState = {
  crumbsList: defaultCrumbsList,
};

export const breadcrumbsReducer = (state = initialState, action) => {
  if (action.type === Actions.Breadcrumbs.SET_BREAD_CRUMBS) {
    if (action.payload.crumbs[0] === undefined) {
      return {
        crumbsList: defaultCrumbsList,
      };
    }
    return {
      crumbsList: [...defaultCrumbsList, ...action.payload.crumbs],
    };
  }
  return state;
};
