import showVaExpandableAlert from './alerts/showVaAlertExpandable';

import MobileAppCallout from './alerts/MobileAppCallout';

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
import PageNotFound from './user-nav/components/PageNotFound';

import userNavReducer from './user-nav/reducers';

import { restartShouldRedirect } from './wizard';

import addFocusBehaviorToCrisisLineModal from './accessible-VCL-modal';

const userNavScss = require('./user-nav/sass/user-nav.scss');
const mDowntimeNotification = require('./sass/modules/_m-downtime-notification.scss');
const vaMedalliaStyle = require('./sass/va-medallia-style.scss');
const style = require('./sass/style.scss');

const { exports: startSitewideComponents } = require('./index');
const { exports: startHeader } = require('./header');
const { exports: startVAFooter, footerElemementId } = require('./va-footer');
const { exports: startUserNavWidget } = require('./user-nav');

export {
  showVaExpandableAlert,
  MobileAppCallout,
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
  PageNotFound,
  userNavReducer,
  restartShouldRedirect,
  addFocusBehaviorToCrisisLineModal,
  startSitewideComponents,
  startHeader,
  startVAFooter,
  footerElemementId,
  startUserNavWidget,
  vaMedalliaStyle,
  style,
  userNavScss,
  mDowntimeNotification,
};
