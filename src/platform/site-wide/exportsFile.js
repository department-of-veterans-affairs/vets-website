import showVaExpandableAlert from './alerts/showVaAlertExpandable';

import EbenefitsLink from './ebenefits/containers/EbenefitsLink';

import { toggleValues, isProduction } from './feature-toggles/selectors';

import {
  FETCH_TOGGLE_VALUES_STARTED,
  FETCH_TOGGLE_VALUES_SUCCEEDED,
  TOGGLE_VALUES_SET,
} from './feature-toggles/actionTypes';

import { FeatureToggleReducer } from './feature-toggles/reducers';

import header from './header';

import { addOverlayTriggers } from './legacy/menu';

import LoadingButton from './loading-button/LoadingButton';

import MegaMenu, { initNavMenu } from './legacy/mega-menu';

import startMegaMenuWidget from './mega-menu/reducers';

import { mhvUrl, mhvBaseUrl } from './mhv/utilities';

import startMobileMenuButton from './mobile-menu-button';

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

import startUserNavWidget from './user-nav';

import userNavReducer from './user-nav/reducers';

import startVAFooter from './va-footer';

import { restartShouldRedirect } from './wizard';

import addFocusBehaviorToCrisisLineModal from './accessible-VCL-modal';

import startSitewideComponents from './index';

// const userNavScss = require('./user-nav/sass/user-nav.scss');

// const style = require('./sass/style.scss');

// const vaMedalliaStyle = require('./sass/va-medallia-style.scss');

// const mOverrides = require('./sass/modules/_m-overrides.scss');
// const mHeader = require('./sass/modules/_m-header.scss');
// const mFooter = require('./sass/modules/_m-footer.scss');
// const mCrisisLine = require('./sass/modules/_m-crisis-line.scss');
// const mDowntimeNotification = require('./sass/modules/_m-downtime-notification.scss');
// const mLayers = require('./sass/modules/_m-layers.scss');
// const iconography = require('./sass/iconography.scss');

export {
  showVaExpandableAlert,
  EbenefitsLink,
  toggleValues,
  isProduction,
  FETCH_TOGGLE_VALUES_STARTED,
  FETCH_TOGGLE_VALUES_SUCCEEDED,
  TOGGLE_VALUES_SET,
  FeatureToggleReducer,
  header,
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
  startUserNavWidget,
  userNavReducer,
  startVAFooter,
  restartShouldRedirect,
  addFocusBehaviorToCrisisLineModal,
  startSitewideComponents,
};
