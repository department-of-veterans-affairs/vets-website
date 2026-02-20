// Auto-generated from babel.config.json module-resolver aliases
const path = require('path');

const getAbsolutePath = relativePath =>
  path.join(__dirname, '../', relativePath);

module.exports = {
  '~': getAbsolutePath('src'),
  '@@vap-svc': getAbsolutePath('src/platform/user/profile/vap-svc'),
  '@@profile': getAbsolutePath('src/applications/personalization/profile'),
  '@bio-aquia': getAbsolutePath('src/applications/benefits-optimization-aquia'),
  '@department-of-veterans-affairs/web-components': getAbsolutePath(
    'node_modules/@department-of-veterans-affairs/component-library/node_modules/@department-of-veterans-affairs/web-components',
  ),
  '@department-of-veterans-affairs/mhv/exports$': getAbsolutePath(
    'src/platform/mhv/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-pdf/exports$': getAbsolutePath(
    'src/platform/pdf/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-startup/exports$': getAbsolutePath(
    'src/platform/startup/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-startup/index$': getAbsolutePath(
    'src/platform/startup/index.js',
  ),
  '@department-of-veterans-affairs/platform-startup/index': getAbsolutePath(
    'src/platform/startup',
  ),
  '@department-of-veterans-affairs/platform-startup/store$': getAbsolutePath(
    'src/platform/startup/store.js',
  ),
  '@department-of-veterans-affairs/platform-startup/react$': getAbsolutePath(
    'src/platform/startup/react.js',
  ),
  '@department-of-veterans-affairs/platform-startup/setup$': getAbsolutePath(
    'src/platform/startup/setup.js',
  ),
  '@department-of-veterans-affairs/platform-startup/router$': getAbsolutePath(
    'src/platform/startup/router.js',
  ),
  '@department-of-veterans-affairs/platform-startup/withoutRouter$': getAbsolutePath(
    'src/platform/startup/withoutRouter.js',
  ),
  '@department-of-veterans-affairs/platform-startup/analytics-middleware$': getAbsolutePath(
    'src/platform/startup/analytics-middleware.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/date$': getAbsolutePath(
    'src/platform/utilities/date/index.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/date': getAbsolutePath(
    'src/platform/utilities/date',
  ),
  '@department-of-veterans-affairs/platform-utilities/exports$': getAbsolutePath(
    'src/platform/utilities/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/environment$': getAbsolutePath(
    'src/platform/utilities/environment/index.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/environment': getAbsolutePath(
    'src/platform/utilities/environment',
  ),
  '@department-of-veterans-affairs/platform-utilities/stagingDomains$': getAbsolutePath(
    'src/platform/utilities/environment/stagingDomains.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/feature-toggles/helpers$': getAbsolutePath(
    'src/platform/utilities/feature-toggles/helpers.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/flipper-client$': getAbsolutePath(
    'src/platform/utilities/feature-toggles/flipper-client.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/featureFlagNames$': getAbsolutePath(
    'src/platform/utilities/feature-toggles/featureFlagNames.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/medical-centers$': getAbsolutePath(
    'src/platform/utilities/medical-centers/medical-centers.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/sso/constants$': getAbsolutePath(
    'src/platform/utilities/sso/constants.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/sso$': getAbsolutePath(
    'src/platform/utilities/sso/index.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/sso': getAbsolutePath(
    'src/platform/utilities/sso',
  ),
  '@department-of-veterans-affairs/platform-utilities/keepAliveSSO$': getAbsolutePath(
    'src/platform/utilities/sso/keepAliveSSO.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/loginAttempted$': getAbsolutePath(
    'src/platform/utilities/sso/loginAttempted.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/mockKeepAliveSSO$': getAbsolutePath(
    'src/platform/utilities/sso/mockKeepAliveSSO.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/localStorage$': getAbsolutePath(
    'src/platform/utilities/storage/localStorage.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/asyncLoader$': getAbsolutePath(
    'src/platform/utilities/ui/asyncLoader.jsx',
  ),
  '@department-of-veterans-affairs/platform-utilities/DelayedRender$': getAbsolutePath(
    'src/platform/utilities/ui/DelayedRender.jsx',
  ),
  '@department-of-veterans-affairs/platform-utilities/ui$': getAbsolutePath(
    'src/platform/utilities/ui/index.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/ui': getAbsolutePath(
    'src/platform/utilities/ui',
  ),
  '@department-of-veterans-affairs/platform-utilities/titleCase$': getAbsolutePath(
    'src/platform/utilities/data/titleCase.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/unset$': getAbsolutePath(
    'src/platform/utilities/data/unset.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/api$': getAbsolutePath(
    'src/platform/utilities/api/index.js',
  ),
  '@department-of-veterans-affairs/platform-utilities/api': getAbsolutePath(
    'src/platform/utilities/api',
  ),
  '@department-of-veterans-affairs/platform-shared/exports$': getAbsolutePath(
    'src/platform/shared/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-shared/itf/api$': getAbsolutePath(
    'src/platform/shared/itf/utils/api.js',
  ),
  '@department-of-veterans-affairs/platform-shared/itf/constants$': getAbsolutePath(
    'src/platform/shared/itf/constants.js',
  ),
  '@department-of-veterans-affairs/platform-shared/itf/content$': getAbsolutePath(
    'src/platform/shared/itf/content.js',
  ),
  '@department-of-veterans-affairs/platform-shared/itf/IntentToFile$': getAbsolutePath(
    'src/platform/shared/itf/IntentToFile.jsx',
  ),
  '@department-of-veterans-affairs/platform-shared/itf/utils$': getAbsolutePath(
    'src/platform/shared/itf/utils/index.js',
  ),
  '@department-of-veterans-affairs/platform-shared/itf/utils': getAbsolutePath(
    'src/platform/shared/itf/utils',
  ),
  '@department-of-veterans-affairs/platform-landing-pages/exports$': getAbsolutePath(
    'src/platform/landing-pages/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-landing-pages/facility-sidebar$': getAbsolutePath(
    'src/platform/landing-pages/facility-sidebar.json',
  ),
  '@department-of-veterans-affairs/platform-landing-pages/header-footer-data$': getAbsolutePath(
    'src/platform/landing-pages/header-footer-data.json',
  ),
  '@department-of-veterans-affairs/platform-static-data/exports$': getAbsolutePath(
    'src/platform/static-data/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-static-data/CallHRC$': getAbsolutePath(
    'src/platform/static-data/CallHRC.jsx',
  ),
  '@department-of-veterans-affairs/platform-static-data/CallNCACenter$': getAbsolutePath(
    'src/platform/static-data/CallNCACenter.jsx',
  ),
  '@department-of-veterans-affairs/platform-static-data/CallVBACenter$': getAbsolutePath(
    'src/platform/static-data/CallVBACenter.jsx',
  ),
  '@department-of-veterans-affairs/platform-static-data/EmailVICHelp$': getAbsolutePath(
    'src/platform/static-data/EmailVICHelp.jsx',
  ),
  '@department-of-veterans-affairs/platform-static-data/error-messages$': getAbsolutePath(
    'src/platform/static-data/error-messages.jsx',
  ),
  '@department-of-veterans-affairs/platform-static-data/options-for-select$': getAbsolutePath(
    'src/platform/static-data/options-for-select.js',
  ),
  '@department-of-veterans-affairs/platform-static-data/SubmitSignInForm$': getAbsolutePath(
    'src/platform/static-data/SubmitSignInForm.jsx',
  ),
  '@department-of-veterans-affairs/platform-polyfills/exports$': getAbsolutePath(
    'src/platform/polyfills/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-polyfills/canvas-toBlob$': getAbsolutePath(
    'src/platform/polyfills/canvas-toBlob.js',
  ),
  '@department-of-veterans-affairs/platform-polyfills/download-attribute$': getAbsolutePath(
    'src/platform/polyfills/download-attribute.js',
  ),
  '@department-of-veterans-affairs/platform-polyfills$': getAbsolutePath(
    'src/platform/polyfills/index.js',
  ),
  '@department-of-veterans-affairs/platform-polyfills': getAbsolutePath(
    'src/platform/polyfills',
  ),
  '@department-of-veterans-affairs/platform-polyfills/polyfill-timezone-data$': getAbsolutePath(
    'src/platform/polyfills/polyfill-timezone-data.js',
  ),
  '@department-of-veterans-affairs/platform-polyfills/preESModulesPolyfills$': getAbsolutePath(
    'src/platform/polyfills/preESModulesPolyfills.js',
  ),
  '@department-of-veterans-affairs/platform-user/exports$': getAbsolutePath(
    'src/platform/user/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-user/selectors$': getAbsolutePath(
    'src/platform/user/selectors.js',
  ),
  '@department-of-veterans-affairs/platform-user/authentication/actions$': getAbsolutePath(
    'src/platform/user/authentication/actions/index.js',
  ),
  '@department-of-veterans-affairs/platform-user/authentication/actions': getAbsolutePath(
    'src/platform/user/authentication/actions',
  ),
  '@department-of-veterans-affairs/platform-user/authentication/constants$': getAbsolutePath(
    'src/platform/user/authentication/constants.js',
  ),
  '@department-of-veterans-affairs/platform-user/authentication/selectors$': getAbsolutePath(
    'src/platform/user/authentication/selectors.js',
  ),
  '@department-of-veterans-affairs/platform-user/authentication/utilities$': getAbsolutePath(
    'src/platform/user/authentication/utilities.js',
  ),
  '@department-of-veterans-affairs/platform-user/cerner-dsot/selectors$': getAbsolutePath(
    'src/platform/user/cerner-dsot/selectors.js',
  ),
  '@department-of-veterans-affairs/platform-user/CreateAccountLink$': getAbsolutePath(
    'src/platform/user/authentication/components/CreateAccountLink.jsx',
  ),
  '@department-of-veterans-affairs/platform-user/VerifyAccountLink$': getAbsolutePath(
    'src/platform/user/authentication/components/VerifyAccountLink.jsx',
  ),
  '@department-of-veterans-affairs/platform-user/DowntimeBanner$': getAbsolutePath(
    'src/platform/user/authentication/components/DowntimeBanner.js',
  ),
  '@department-of-veterans-affairs/platform-user/LoginActions$': getAbsolutePath(
    'src/platform/user/authentication/components/LoginActions.jsx',
  ),
  '@department-of-veterans-affairs/platform-user/LoginButton$': getAbsolutePath(
    'src/platform/user/authentication/components/LoginButton.jsx',
  ),
  '@department-of-veterans-affairs/platform-user/LoginContainer$': getAbsolutePath(
    'src/platform/user/authentication/components/LoginContainer.jsx',
  ),
  '@department-of-veterans-affairs/platform-user/LoginHeader$': getAbsolutePath(
    'src/platform/user/authentication/components/LoginHeader.jsx',
  ),
  '@department-of-veterans-affairs/platform-user/LoginInfo$': getAbsolutePath(
    'src/platform/user/authentication/components/LoginInfo.jsx',
  ),
  '@department-of-veterans-affairs/platform-user/ServiceProvidersList$': getAbsolutePath(
    'src/platform/user/authentication/components/ServiceProvidersList.jsx',
  ),
  '@department-of-veterans-affairs/platform-user/ServiceProvidersText$': getAbsolutePath(
    'src/platform/user/authentication/components/ServiceProvidersText.jsx',
  ),
  '@department-of-veterans-affairs/platform-user/SessionTimeoutModal$': getAbsolutePath(
    'src/platform/user/authentication/components/SessionTimeoutModal.jsx',
  ),
  '@department-of-veterans-affairs/platform-user/SignInModal$': getAbsolutePath(
    'src/platform/user/authentication/components/SignInModal.jsx',
  ),
  '@department-of-veterans-affairs/platform-user/RequiredLoginView$': getAbsolutePath(
    'src/platform/user/authorization/components/RequiredLoginView.jsx',
  ),
  '@department-of-veterans-affairs/platform-user/profile/backendServices$': getAbsolutePath(
    'src/platform/user/profile/constants/backendServices.js',
  ),
  '@department-of-veterans-affairs/platform-user/profile/reducers$': getAbsolutePath(
    'src/platform/user/profile/reducers/index.js',
  ),
  '@department-of-veterans-affairs/platform-user/profile/reducers': getAbsolutePath(
    'src/platform/user/profile/reducers',
  ),
  '@department-of-veterans-affairs/platform-user/profile/utilities$': getAbsolutePath(
    'src/platform/user/profile/utilities/index.js',
  ),
  '@department-of-veterans-affairs/platform-user/profile/utilities': getAbsolutePath(
    'src/platform/user/profile/utilities',
  ),
  '@department-of-veterans-affairs/platform-user/local-vapsvc$': getAbsolutePath(
    'src/platform/user/profile/vap-svc/util/local-vapsvc.js',
  ),
  '@department-of-veterans-affairs/platform-user/disableFTUXModals$': getAbsolutePath(
    'src/platform/user/tests/disableFTUXModals.js',
  ),
  '@department-of-veterans-affairs/platform-mocks/exports$': getAbsolutePath(
    'src/platform/mocks/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-mocks/browser$': getAbsolutePath(
    'src/platform/mocks/browser.js',
  ),
  '@department-of-veterans-affairs/platform-mocks/responses$': getAbsolutePath(
    'src/platform/mocks/responses.js',
  ),
  '@department-of-veterans-affairs/platform-testing/exports$': getAbsolutePath(
    'src/platform/testing/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-testing/form-tester$': getAbsolutePath(
    'src/platform/testing/e2e/cypress/support/form-tester/index.js',
  ),
  '@department-of-veterans-affairs/platform-testing/form-tester': getAbsolutePath(
    'src/platform/testing/e2e/cypress/support/form-tester',
  ),
  '@department-of-veterans-affairs/platform-testing/form-tester/utilities$': getAbsolutePath(
    'src/platform/testing/e2e/cypress/support/form-tester/utilities.js',
  ),
  '@department-of-veterans-affairs/platform-testing/mock-helpers$': getAbsolutePath(
    'src/platform/testing/e2e/mock-helpers.js',
  ),
  '@department-of-veterans-affairs/platform-testing/common$': getAbsolutePath(
    'src/platform/testing/local-dev-mock-api/common.js',
  ),
  '@department-of-veterans-affairs/platform-testing/helpers$': getAbsolutePath(
    'src/platform/testing/unit/helpers.js',
  ),
  '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers$': getAbsolutePath(
    'src/platform/testing/unit/react-testing-library-helpers.js',
  ),
  '@department-of-veterans-affairs/platform-testing/schemaform-utils$': getAbsolutePath(
    'src/platform/testing/unit/schemaform-utils.jsx',
  ),
  '@department-of-veterans-affairs/platform-testing/sentry$': getAbsolutePath(
    'src/platform/testing/unit/sentry.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/exports$': getAbsolutePath(
    'src/platform/site-wide/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/MobileAppCallout$': getAbsolutePath(
    'src/platform/site-wide/alerts/MobileAppCallout.jsx',
  ),
  '@department-of-veterans-affairs/platform-site-wide/EbenefitsLink$': getAbsolutePath(
    'src/platform/site-wide/ebenefits/containers/EbenefitsLink.jsx',
  ),
  '@department-of-veterans-affairs/platform-site-wide/selectors$': getAbsolutePath(
    'src/platform/site-wide/feature-toggles/selectors.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/actionTypes$': getAbsolutePath(
    'src/platform/site-wide/feature-toggles/actionTypes.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/feature-toggles/reducers$': getAbsolutePath(
    'src/platform/site-wide/feature-toggles/reducers/index.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/feature-toggles/reducers': getAbsolutePath(
    'src/platform/site-wide/feature-toggles/reducers',
  ),
  '@department-of-veterans-affairs/platform-site-wide/header$': getAbsolutePath(
    'src/platform/site-wide/header/index.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/header': getAbsolutePath(
    'src/platform/site-wide/header',
  ),
  '@department-of-veterans-affairs/platform-site-wide/menu$': getAbsolutePath(
    'src/platform/site-wide/legacy/menu.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/legacy/mega-menu$': getAbsolutePath(
    'src/platform/site-wide/legacy/mega-menu.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/LoadingButton$': getAbsolutePath(
    'src/platform/site-wide/loading-button/LoadingButton.jsx',
  ),
  '@department-of-veterans-affairs/platform-site-wide/mega-menu$': getAbsolutePath(
    'src/platform/site-wide/mega-menu/index.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/mega-menu': getAbsolutePath(
    'src/platform/site-wide/mega-menu',
  ),
  '@department-of-veterans-affairs/platform-site-wide/reducers$': getAbsolutePath(
    'src/platform/site-wide/mega-menu/reducers/index.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/reducers': getAbsolutePath(
    'src/platform/site-wide/mega-menu/reducers',
  ),
  '@department-of-veterans-affairs/platform-site-wide/utilities$': getAbsolutePath(
    'src/platform/site-wide/mhv/utilities.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/mobile-menu-button$': getAbsolutePath(
    'src/platform/site-wide/mobile-menu-button/index.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/mobile-menu-button': getAbsolutePath(
    'src/platform/site-wide/mobile-menu-button',
  ),
  '@department-of-veterans-affairs/platform-site-wide/style$': getAbsolutePath(
    'src/platform/site-wide/sass/style.scss',
  ),
  '@department-of-veterans-affairs/platform-site-wide/va-medallia-style$': getAbsolutePath(
    'src/platform/site-wide/sass/va-medallia-style.scss',
  ),
  '@department-of-veterans-affairs/platform-site-wide/actions$': getAbsolutePath(
    'src/platform/site-wide/user-nav/actions/index.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/actions': getAbsolutePath(
    'src/platform/site-wide/user-nav/actions',
  ),
  '@department-of-veterans-affairs/platform-site-wide/AutoSSO$': getAbsolutePath(
    'src/platform/site-wide/user-nav/containers/AutoSSO.jsx',
  ),
  '@department-of-veterans-affairs/platform-site-wide/PageNotFound$': getAbsolutePath(
    'src/platform/site-wide/user-nav/components/PageNotFound.jsx',
  ),
  '@department-of-veterans-affairs/platform-site-wide/user-nav$': getAbsolutePath(
    'src/platform/site-wide/user-nav/index.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/user-nav': getAbsolutePath(
    'src/platform/site-wide/user-nav',
  ),
  '@department-of-veterans-affairs/platform-site-wide/sass/user-nav$': getAbsolutePath(
    'src/platform/site-wide/user-nav/sass/user-nav.scss',
  ),
  '@department-of-veterans-affairs/ask-va/sass/ask-va$': getAbsolutePath(
    'src/applications/ask-va/sass/ask-va.scss',
  ),
  '@department-of-veterans-affairs/virtual-agent': getAbsolutePath(
    'src/applications/virtual-agent',
  ),
  '@department-of-veterans-affairs/platform-site-wide/user-nav/reducers$': getAbsolutePath(
    'src/platform/site-wide/user-nav/reducers/index.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/user-nav/reducers': getAbsolutePath(
    'src/platform/site-wide/user-nav/reducers',
  ),
  '@department-of-veterans-affairs/platform-site-wide/va-footer$': getAbsolutePath(
    'src/platform/site-wide/va-footer/index.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/va-footer': getAbsolutePath(
    'src/platform/site-wide/va-footer',
  ),
  '@department-of-veterans-affairs/platform-site-wide/wizard$': getAbsolutePath(
    'src/platform/site-wide/wizard/index.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/wizard': getAbsolutePath(
    'src/platform/site-wide/wizard',
  ),
  '@department-of-veterans-affairs/platform-site-wide/accessible-VCL-modal$': getAbsolutePath(
    'src/platform/site-wide/accessible-VCL-modal.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/main$': getAbsolutePath(
    'src/platform/site-wide/index.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/main': getAbsolutePath(
    'src/platform/site-wide',
  ),
  '@department-of-veterans-affairs/platform-site-wide/moment-setup$': getAbsolutePath(
    'src/platform/site-wide/moment-setup.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/wc-loader$': getAbsolutePath(
    'src/platform/site-wide/wc-loader.js',
  ),
  '@department-of-veterans-affairs/platform-site-wide/mhv/utilities$': getAbsolutePath(
    'src/platform/site-wide/mhv/utilities.js',
  ),
  '@department-of-veterans-affairs/platform-forms/exports$': getAbsolutePath(
    'src/platform/forms/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-forms/labels$': getAbsolutePath(
    'src/platform/forms/address/data/labels.js',
  ),
  '@department-of-veterans-affairs/platform-forms/preSubmitInfo$': getAbsolutePath(
    'src/platform/forms/preSubmitInfo.js',
  ),
  '@department-of-veterans-affairs/platform-forms/addressHelpers$': getAbsolutePath(
    'src/platform/forms/address/helpers.js',
  ),
  '@department-of-veterans-affairs/platform-forms/address$': getAbsolutePath(
    'src/platform/forms/address/index.js',
  ),
  '@department-of-veterans-affairs/platform-forms/address': getAbsolutePath(
    'src/platform/forms/address',
  ),
  '@department-of-veterans-affairs/platform-forms/validations$': getAbsolutePath(
    'src/platform/forms/validations.js',
  ),
  '@department-of-veterans-affairs/platform-forms/ErrorMessage$': getAbsolutePath(
    'src/platform/forms/components/common/alerts/ErrorMessage.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/BurialModalContent$': getAbsolutePath(
    'src/platform/forms/components/OMBInfoModalContent/BurialModalContent.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/EducationModalContent$': getAbsolutePath(
    'src/platform/forms/components/OMBInfoModalContent/EducationModalContent.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/HealthcareModalContent$': getAbsolutePath(
    'src/platform/forms/components/OMBInfoModalContent/HealthcareModalContent.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/ApplicantDescription$': getAbsolutePath(
    'src/platform/forms/components/ApplicantDescription.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/FormFooter$': getAbsolutePath(
    'src/platform/forms/components/FormFooter.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/GetPensionOrBurialFormHelp$': getAbsolutePath(
    'src/platform/forms/components/GetPensionOrBurialFormHelp.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/ServicePeriodView$': getAbsolutePath(
    'src/platform/forms/components/ServicePeriodView.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/definitions/address$': getAbsolutePath(
    'src/platform/forms/definitions/address.js',
  ),
  '@department-of-veterans-affairs/platform-forms/bankAccount$': getAbsolutePath(
    'src/platform/forms/definitions/bankAccount.js',
  ),
  '@department-of-veterans-affairs/platform-forms/fullName$': getAbsolutePath(
    'src/platform/forms/definitions/fullName.js',
  ),
  '@department-of-veterans-affairs/platform-forms/nonMilitaryJobs$': getAbsolutePath(
    'src/platform/forms/definitions/nonMilitaryJobs.js',
  ),
  '@department-of-veterans-affairs/platform-forms/nonRequiredFullName$': getAbsolutePath(
    'src/platform/forms/definitions/nonRequiredFullName.js',
  ),
  '@department-of-veterans-affairs/platform-forms/personId$': getAbsolutePath(
    'src/platform/forms/definitions/personId.js',
  ),
  '@department-of-veterans-affairs/platform-forms/form$': getAbsolutePath(
    'src/platform/forms/formulate-integration/Form.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/ApplicationInformation$': getAbsolutePath(
    'src/platform/forms/pages/applicantInformation.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/actions$': getAbsolutePath(
    'src/platform/forms/save-in-progress/actions.js',
  ),
  '@department-of-veterans-affairs/platform-forms/api$': getAbsolutePath(
    'src/platform/forms/save-in-progress/api.js',
  ),
  '@department-of-veterans-affairs/platform-forms/ApplicationStatus$': getAbsolutePath(
    'src/platform/forms/save-in-progress/ApplicationStatus.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/DowntimeMessage$': getAbsolutePath(
    'src/platform/forms/save-in-progress/DowntimeMessage.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/FormSaved$': getAbsolutePath(
    'src/platform/forms/save-in-progress/FormSaved.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/save-in-progress/helpers$': getAbsolutePath(
    'src/platform/forms/save-in-progress/helpers.js',
  ),
  '@department-of-veterans-affairs/platform-forms/MilitaryPrefillMessage$': getAbsolutePath(
    'src/platform/forms/save-in-progress/MilitaryPrefillMessage.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/PrefillMessage$': getAbsolutePath(
    'src/platform/forms/save-in-progress/PrefillMessage.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/reducers$': getAbsolutePath(
    'src/platform/forms/save-in-progress/reducers.js',
  ),
  '@department-of-veterans-affairs/platform-forms/RoutedSavableApp$': getAbsolutePath(
    'src/platform/forms/save-in-progress/RoutedSavableApp.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/SaveFormLink$': getAbsolutePath(
    'src/platform/forms/save-in-progress/SaveFormLink.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/SaveStatus$': getAbsolutePath(
    'src/platform/forms/save-in-progress/SaveStatus.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms/selectors$': getAbsolutePath(
    'src/platform/forms/save-in-progress/selectors.js',
  ),
  '@department-of-veterans-affairs/platform-forms/constants$': getAbsolutePath(
    'src/platform/forms/constants.js',
  ),
  '@department-of-veterans-affairs/platform-forms/fields$': getAbsolutePath(
    'src/platform/forms/fields.js',
  ),
  '@department-of-veterans-affairs/platform-forms/helpers$': getAbsolutePath(
    'src/platform/forms/helpers.js',
  ),
  '@department-of-veterans-affairs/platform-forms/sub-task$': getAbsolutePath(
    'src/platform/forms/sub-task/index.js',
  ),
  '@department-of-veterans-affairs/platform-forms/sub-task': getAbsolutePath(
    'src/platform/forms/sub-task',
  ),
  '@department-of-veterans-affairs/platform-forms/save-in-progress':
    '.src/platform/forms/save-in-progress/SaveInProgressIntro',
  '@department-of-veterans-affairs/platform-forms-system/exports$': getAbsolutePath(
    'src/platform/forms-system/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/AddressViewField$': getAbsolutePath(
    'src/platform/forms-system/src/js/components/AddressViewField.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/FormNavButtons$': getAbsolutePath(
    'src/platform/forms-system/src/js/components/FormNavButtons.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/FormTitle$': getAbsolutePath(
    'src/platform/forms-system/src/js/components/FormTitle.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/ProgressButton$': getAbsolutePath(
    'src/platform/forms-system/src/js/components/ProgressButton.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/ReviewCardField$': getAbsolutePath(
    'src/platform/forms-system/src/js/components/ReviewCardField.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/SchemaForm$': getAbsolutePath(
    'src/platform/forms-system/src/js/components/SchemaForm.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/content/directDeposit$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/content/directDeposit.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/address$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/address.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/autosuggest$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/autosuggest.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/confirmationEmail$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/confirmationEmail.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/currency$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/currency',
  ),
  '@department-of-veterans-affairs/platform-forms-system/currentOrPastDate$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/currentOrPastDate.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/currentOrPastMonthYear$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/currentOrPastMonthYear.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/date$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/date.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/dateRange$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/dateRange.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/directDeposit$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/directDeposit.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/email$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/email.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/definitions/file$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/file.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/fullName$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/fullName.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/monthYear$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/monthYear.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/monthYearRange$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/monthYearRange.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/phone$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/phone.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/profileAddress$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/profileAddress.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/profileContactInfo$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/profileContactInfo.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/ssn$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/ssn.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/year$': getAbsolutePath(
    'src/platform/forms-system/src/js/definitions/year.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/FullNameField$': getAbsolutePath(
    'src/platform/forms-system/src/js/fields/FullNameField.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/ObjectField$': getAbsolutePath(
    'src/platform/forms-system/src/js/fields/ObjectField.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/review/PhoneNumberWidget$': getAbsolutePath(
    'src/platform/forms-system/src/js/review/PhoneNumberWidget.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/ReviewChapters$': getAbsolutePath(
    'src/platform/forms-system/src/js/review/ReviewChapters.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/ReviewCollapsibleChapter$': getAbsolutePath(
    'src/platform/forms-system/src/js/review/ReviewCollapsibleChapter.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/SubmitController$': getAbsolutePath(
    'src/platform/forms-system/src/js/review/SubmitController.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/state/helpers$': getAbsolutePath(
    'src/platform/forms-system/src/js/state/helpers.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/reducers$': getAbsolutePath(
    'src/platform/forms-system/src/js/state/reducers.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/selectors$': getAbsolutePath(
    'src/platform/forms-system/src/js/state/selectors.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/numberToWords$': getAbsolutePath(
    'src/platform/forms-system/src/js/utilities/data/numberToWords.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/findDuplicateIndexes$': getAbsolutePath(
    'src/platform/forms-system/src/js/utilities/data/findDuplicateIndexes.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/get$': getAbsolutePath(
    'src/platform/forms-system/src/js/utilities/data/get.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/set$': getAbsolutePath(
    'src/platform/forms-system/src/js/utilities/data/set.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/utilities/file$': getAbsolutePath(
    'src/platform/forms-system/src/js/utilities/file/index.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/utilities/file': getAbsolutePath(
    'src/platform/forms-system/src/js/utilities/file',
  ),
  '@department-of-veterans-affairs/platform-forms-system/ui$': getAbsolutePath(
    'src/platform/forms-system/src/js/utilities/ui/index.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/ui': getAbsolutePath(
    'src/platform/forms-system/src/js/utilities/ui',
  ),
  '@department-of-veterans-affairs/platform-forms-system/validations$': getAbsolutePath(
    'src/platform/forms-system/src/js/utilities/validations/index.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/validations': getAbsolutePath(
    'src/platform/forms-system/src/js/utilities/validations',
  ),
  '@department-of-veterans-affairs/platform-forms-system/fuzzy-matching$': getAbsolutePath(
    'src/platform/forms-system/src/js/utilities/fuzzy-matching.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/save-in-progress-messages$': getAbsolutePath(
    'src/platform/forms-system/src/js/utilities/save-in-progress-messages.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/viewify-fields$': getAbsolutePath(
    'src/platform/forms-system/src/js/utilities/viewify-fields.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/widgets/PhoneNumberWidget$': getAbsolutePath(
    'src/platform/forms-system/src/js/widgets/PhoneNumberWidget.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/TextWidget$': getAbsolutePath(
    'src/platform/forms-system/src/js/widgets/TextWidget.jsx',
  ),
  '@department-of-veterans-affairs/platform-forms-system/actions$': getAbsolutePath(
    'src/platform/forms-system/src/js/actions.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/constants$': getAbsolutePath(
    'src/platform/forms-system/src/js/constants.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/helpers$': getAbsolutePath(
    'src/platform/forms-system/src/js/helpers.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/routing': getAbsolutePath(
    'src/platform/forms-system/src/js/routing',
  ),
  '@department-of-veterans-affairs/platform-forms-system/validation$': getAbsolutePath(
    'src/platform/forms-system/src/js/validation.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/web-component-patterns$': getAbsolutePath(
    'src/platform/forms-system/src/js/web-component-patterns/index.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/web-component-patterns': getAbsolutePath(
    'src/platform/forms-system/src/js/web-component-patterns',
  ),
  '@department-of-veterans-affairs/platform-forms-system/web-component-fields$': getAbsolutePath(
    'src/platform/forms-system/src/js/web-component-fields/index.js',
  ),
  '@department-of-veterans-affairs/platform-forms-system/web-component-fields': getAbsolutePath(
    'src/platform/forms-system/src/js/web-component-fields',
  ),
  '@department-of-veterans-affairs/platform-forms-system/src/js/web-component-patterns/radioPattern$': getAbsolutePath(
    'src/platform/forms-system/src/js/web-component-patterns/radioPattern.jsx',
  ),
  '@department-of-veterans-affairs/platform-form-renderer/exports$': getAbsolutePath(
    'src/platform/form-renderer/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-form-renderer/FormRenderer$': getAbsolutePath(
    'src/platform/form-renderer/FormRenderer.jsx',
  ),
  '@department-of-veterans-affairs/platform-monitoring/exports$': getAbsolutePath(
    'src/platform/monitoring/exportsFile.js',
  ),
  '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification$': getAbsolutePath(
    'src/platform/monitoring/DowntimeNotification/index.jsx',
  ),
  '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification': getAbsolutePath(
    'src/platform/monitoring/DowntimeNotification',
  ),
  '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification/containers/DowntimeNotification$': getAbsolutePath(
    'src/platform/monitoring/DowntimeNotification/containers/DowntimeNotification.jsx',
  ),
  '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification/components/Banner$': getAbsolutePath(
    'src/platform/monitoring/DowntimeNotification/components/Banner.jsx',
  ),
  '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification/components/Down$': getAbsolutePath(
    'src/platform/monitoring/DowntimeNotification/components/Down.jsx',
  ),
  '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification/components/DowntimeApproaching$': getAbsolutePath(
    'src/platform/monitoring/DowntimeNotification/components/DowntimeApproaching.jsx',
  ),
  '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification/components/Wrapper$': getAbsolutePath(
    'src/platform/monitoring/DowntimeNotification/components/Wrapper.jsx',
  ),
  '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification/util/helpers$': getAbsolutePath(
    'src/platform/monitoring/DowntimeNotification/util/helpers.js',
  ),
  '@department-of-veterans-affairs/platform-monitoring/external-services/ExternalServicesError$': getAbsolutePath(
    'src/platform/monitoring/external-services/ExternalServicesError.jsx',
  ),
  '@department-of-veterans-affairs/platform-monitoring/record-event$': getAbsolutePath(
    'src/platform/monitoring/record-event',
  ),
};
