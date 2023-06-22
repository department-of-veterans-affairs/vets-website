import showVaExpandableAlert from './alerts/showVaAlertExpandable';

import EbenefitsLink from './ebenefits/containers/EbenefitsLink';

import { toggleValues, isProduction } from './feature-toggles/selectors';

import {
  FETCH_TOGGLE_VALUES_STARTED,
  FETCH_TOGGLE_VALUES_SUCCEEDED,
  TOGGLE_VALUES_SET,
} from './feature-toggles/actionTypes';

import { FeatureToggleReducer } from './feature-toggles/reducers';

import { addOverlayTriggers } from './legacy/menu';

import LoadingButton from './loading-button/LoadingButton';

import MegaMenu, { initNavMenu } from './legacy/mega-menu';

import startMegaMenuWidget from './mega-menu/reducers';

import { mhvUrl, mhvBaseUrl } from './mhv/utilities';

import startMobileMenuButton from './mobile-menu-button';

// import { default as style } from './sass/style.scss';

// import { default as vaMedalliaStyle } from './sass/va-medallia-style.scss';

// import { default as mOverrides } from './sass/modules/_m-overrides.scss';
// import { default as mHeader } from './sass/modules/_m-header.scss';
// import { default as mFooter } from './sass/modules/_m-footer.scss';
// import { default as mCrisisLine } from './sass/modules/_m-crisis-line.scss';
// import {
//   default as mDowntimeNotification,
// } from './sass/modules/_m-downtime-notification.scss';
// import { default as mLayers } from './sass/modules/_m-layers.scss';
// import { default as iconography } from './sass/iconography.scss';

import { sitemapURLs } from './tests/sitemap/sitemap-helpers';

import {
  TOGGLE_FORM_SIGN_IN_MODAL,
  TOGGLE_LOGIN_MODAL,
  UPDATE_SEARCH_HELP_USER_MENU,
  TOGGLE_ACCOUNT_TRANSITION_MODAL,
  TOGGLE_ACCOUNT_TRANSITION_SUCCESS_MODAL,
  toggleFormSignInModal,
  toggleAccountTransitionModal,
  toggleAccountTransitionSuccessModal,
  toggleLoginModal,
  toggleSearchHelpUserMenu,
} from './user-nav/actions';

import AutoSSO from './user-nav/containers/AutoSSO';

// import { default as userNavScss } from './user-nav/sass/user-nav.scss';

import userNavReducer from './user-nav/reducers';

import { restartShouldRedirect } from './wizard';

import addFocusBehaviorToCrisisLineModal from './accessible-VCL-modal';

const { exports: startSitewideComponents } = require('./index');
const { exports: startHeader } = require('./header');
const { exports: startVAFooter, footerElemementId } = require('./va-footer');
const { exports: startUserNavWidget } = require('./user-nav');

export {
  showVaExpandableAlert,
  EbenefitsLink,
  toggleValues,
  isProduction,
  FETCH_TOGGLE_VALUES_STARTED,
  FETCH_TOGGLE_VALUES_SUCCEEDED,
  TOGGLE_VALUES_SET,
  FeatureToggleReducer,
  addOverlayTriggers,
  LoadingButton,
  MegaMenu,
  initNavMenu,
  startMegaMenuWidget,
  mhvUrl,
  mhvBaseUrl,
  startMobileMenuButton,
  sitemapURLs,
  TOGGLE_FORM_SIGN_IN_MODAL,
  TOGGLE_LOGIN_MODAL,
  UPDATE_SEARCH_HELP_USER_MENU,
  TOGGLE_ACCOUNT_TRANSITION_MODAL,
  TOGGLE_ACCOUNT_TRANSITION_SUCCESS_MODAL,
  toggleFormSignInModal,
  toggleAccountTransitionModal,
  toggleAccountTransitionSuccessModal,
  toggleLoginModal,
  toggleSearchHelpUserMenu,
  AutoSSO,
  userNavReducer,
  restartShouldRedirect,
  addFocusBehaviorToCrisisLineModal,
  startSitewideComponents,
  startHeader,
  startVAFooter,
  footerElemementId,
  startUserNavWidget,
};
