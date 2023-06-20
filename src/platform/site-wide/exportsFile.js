export {
  default as showVaExpandableAlert,
} from './alerts/showVaAlertExpandable';

export { default as EbenefitsLink } from './ebenefits/containers/EbenefitsLink';

export { toggleValues, isProduction } from './feature-toggles/selectors';

export {
  FETCH_TOGGLE_VALUES_STARTED,
  FETCH_TOGGLE_VALUES_SUCCEEDED,
  TOGGLE_VALUES_SET,
} from './feature-toggles/actionTypes';

export { FeatureToggleReducer } from './feature-toggles/reducers';

// export { default as header } from './header';

export { addOverlayTriggers } from './legacy/menu';

export { default as LoadingButton } from './loading-button/LoadingButton';

export { default as MegaMenu, initNavMenu } from './legacy/mega-menu';

export { default as startMegaMenuWidget } from './mega-menu/reducers';

export { mhvUrl, mhvBaseUrl } from './mhv/utilities';

export { default as startMobileMenuButton } from './mobile-menu-button';

// export { default as style } from './sass/style.scss';

// export { default as vaMedalliaStyle } from './sass/va-medallia-style.scss';

// export { default as mOverrides } from './sass/modules/_m-overrides.scss';
// export { default as mHeader } from './sass/modules/_m-header.scss';
// export { default as mFooter } from './sass/modules/_m-footer.scss';
// export { default as mCrisisLine } from './sass/modules/_m-crisis-line.scss';
// export {
//   default as mDowntimeNotification,
// } from './sass/modules/_m-downtime-notification.scss';
// export { default as mLayers } from './sass/modules/_m-layers.scss';
// export { default as iconography } from './sass/iconography.scss';

export { sitemapURLs } from './tests/sitemap/sitemap-helpers';

export {
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

export { default as AutoSSO } from './user-nav/containers/AutoSSO';

// export { default as startUserNavWidget } from './user-nav';

// export { default as userNavScss } from './user-nav/sass/user-nav.scss';

export { default as userNavReducer } from './user-nav/reducers';

// export { default as startVAFooter } from './va-footer';

export { restartShouldRedirect } from './wizard';

export {
  default as addFocusBehaviorToCrisisLineModal,
} from './accessible-VCL-modal';

// export { default as startSitewideComponents } from './index';
